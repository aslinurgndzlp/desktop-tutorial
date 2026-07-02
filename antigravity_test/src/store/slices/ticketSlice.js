import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  trips: [],
  searchCriteria: {
    from: '',
    to: '',
    date: '',
    type: 'bus', // 'bus' or 'flight'
  },
  filteredTrips: [],
  selectedTrip: null,
  selectedSeats: [], // array of seat numbers
  selectedSeatGenders: {}, // map of seatNumber -> 'male'|'female'
  bookings: [], // array of user bookings
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTrips = createAsyncThunk(
  'tickets/fetchTrips',
  async (criteria, { rejectWithValue }) => {
    const { from, to, date, type } = criteria;
    
    // Read locally added trips from localStorage
    const localTripsStr = localStorage.getItem('local_trips');
    const localTrips = localTripsStr ? JSON.parse(localTripsStr) : [];
    const localMatched = localTrips.filter(
      t => t.from === from && t.to === to && t.date === date && t.type === type
    );

    try {
      const response = await axios.get(`http://localhost:3001/trips?from=${from}&to=${to}&date=${date}&type=${type}`);
      const apiTrips = response.data;
      const combined = [...apiTrips];
      localMatched.forEach(localTrip => {
        if (!combined.some(t => t.id === localTrip.id)) {
          combined.push(localTrip);
        }
      });
      return combined;
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, local fallback deneniyor:', err);
      try {
        const fallback = await axios.get('/db.json');
        const dbMatched = fallback.data.trips.filter(
          t => t.from === from && t.to === to && t.date === date && t.type === type
        );
        const combined = [...dbMatched];
        localMatched.forEach(localTrip => {
          if (!combined.some(t => t.id === localTrip.id)) {
            combined.push(localTrip);
          }
        });
        return combined;
      } catch (fallbackErr) {
        if (localMatched.length > 0) {
          return localMatched;
        }
        return rejectWithValue('Biletler yüklenirken bir hata oluştu.');
      }
    }
  }
);

export const updateTripSeats = createAsyncThunk(
  'tickets/updateTripSeats',
  async ({ tripId, selectedSeats, selectedSeatGenders }, { rejectWithValue }) => {
    try {
      // 1. Fetch current trip details to get existing bookedSeats & bookedGenders
      const tripRes = await axios.get(`http://localhost:3001/trips/${tripId}`);
      const trip = tripRes.data;
      const updatedBookedSeats = [...trip.bookedSeats, ...selectedSeats];
      const updatedBookedGenders = { ...trip.bookedGenders, ...selectedSeatGenders };

      // 2. Update trip in database
      const updateRes = await axios.patch(`http://localhost:3001/trips/${tripId}`, {
        bookedSeats: updatedBookedSeats,
        bookedGenders: updatedBookedGenders
      });
      return updateRes.data;
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, yerel güncelleme simüle ediliyor:', err);
      // Sync local storage trip seats if it exists in local_trips
      const localTripsStr = localStorage.getItem('local_trips');
      if (localTripsStr) {
        const trips = JSON.parse(localTripsStr);
        const idx = trips.findIndex(t => t.id === tripId);
        if (idx > -1) {
          trips[idx].bookedSeats = [...trips[idx].bookedSeats, ...selectedSeats];
          trips[idx].bookedGenders = { ...trips[idx].bookedGenders, ...selectedSeatGenders };
          localStorage.setItem('local_trips', JSON.stringify(trips));
        }
      }
      return { tripId, selectedSeats, selectedSeatGenders, isFallback: true };
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'tickets/fetchBookings',
  async (userId, { rejectWithValue }) => {
    const localBookingsStr = localStorage.getItem(`bookings_${userId}`);
    const localBookings = localBookingsStr ? JSON.parse(localBookingsStr) : [];
    try {
      const response = await axios.get(`http://localhost:3001/bookings?userId=${userId}`);
      const apiBookings = response.data;
      
      // Auto-sync local bookings to json-server if they don't exist
      const combined = [...apiBookings];
      for (const localBooking of localBookings) {
        if (!apiBookings.some(b => b.id === localBooking.id)) {
          try {
            const syncRes = await axios.post('http://localhost:3001/bookings', localBooking);
            const idx = combined.findIndex(b => b.id === localBooking.id);
            if (idx === -1) {
              combined.push(syncRes.data);
            }
          } catch (syncErr) {
            console.warn('Rezervasyon sunucuya senkronize edilemedi:', syncErr);
            if (!combined.some(b => b.id === localBooking.id)) {
              combined.push(localBooking);
            }
          }
        }
      }
      return combined;
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, yerel rezervasyonlar listeleniyor:', err);
      return localBookings;
    }
  }
);

export const addBooking = createAsyncThunk(
  'tickets/addBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/bookings', bookingData);
      
      const userId = bookingData.userId;
      const localBookings = localStorage.getItem(`bookings_${userId}`);
      const bookingsList = localBookings ? JSON.parse(localBookings) : [];
      bookingsList.push(response.data);
      localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookingsList));

      return response.data;
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, rezervasyon yerel olarak simüle edildi:', err);
      const userId = bookingData.userId;
      const localBookings = localStorage.getItem(`bookings_${userId}`);
      const bookingsList = localBookings ? JSON.parse(localBookings) : [];
      bookingsList.push(bookingData);
      localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookingsList));
      return bookingData;
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'tickets/deleteBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      // 1. Get the booking to find tripId and seats
      const bookingRes = await axios.get(`http://localhost:3001/bookings/${bookingId}`);
      const booking = bookingRes.data;

      // 2. Delete the booking
      await axios.delete(`http://localhost:3001/bookings/${bookingId}`);

      // 3. Update the trip to remove the seats
      try {
        const tripRes = await axios.get(`http://localhost:3001/trips/${booking.tripId}`);
        const trip = tripRes.data;
        const updatedSeats = trip.bookedSeats.filter(s => !booking.seats.includes(s));
        const updatedGenders = { ...trip.bookedGenders };
        booking.seats.forEach(s => {
          delete updatedGenders[s];
        });

        await axios.patch(`http://localhost:3001/trips/${booking.tripId}`, {
          bookedSeats: updatedSeats,
          bookedGenders: updatedGenders
        });
      } catch (tripErr) {
        console.warn('Rezervasyon silinirken sefer koltukları güncellenemedi:', tripErr);
      }

      // Sync local storage trips
      const localTripsStr = localStorage.getItem('local_trips');
      if (localTripsStr) {
        const trips = JSON.parse(localTripsStr);
        const idx = trips.findIndex(t => t.id === booking.tripId);
        if (idx > -1) {
          trips[idx].bookedSeats = trips[idx].bookedSeats.filter(s => !booking.seats.includes(s));
          booking.seats.forEach(s => {
            delete trips[idx].bookedGenders[s];
          });
          localStorage.setItem('local_trips', JSON.stringify(trips));
        }
      }

      // Sync local storage
      const userId = booking.userId;
      const localBookings = localStorage.getItem(`bookings_${userId}`);
      if (localBookings) {
        const bookingsList = JSON.parse(localBookings).filter(b => b.id !== bookingId);
        localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookingsList));
      }

      return { bookingId, tripId: booking.tripId, booking };
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, rezervasyon yerel olarak siliniyor:', err);
      let foundBooking = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('bookings_')) {
          const list = JSON.parse(localStorage.getItem(key));
          const idx = list.findIndex(b => b.id === bookingId);
          if (idx > -1) {
            foundBooking = list[idx];
            list.splice(idx, 1);
            localStorage.setItem(key, JSON.stringify(list));
            break;
          }
        }
      }
      if (foundBooking) {
        // Sync local storage trips
        const localTripsStr = localStorage.getItem('local_trips');
        if (localTripsStr) {
          const trips = JSON.parse(localTripsStr);
          const idx = trips.findIndex(t => t.id === foundBooking.tripId);
          if (idx > -1) {
            trips[idx].bookedSeats = trips[idx].bookedSeats.filter(s => !foundBooking.seats.includes(s));
            foundBooking.seats.forEach(s => {
              delete trips[idx].bookedGenders[s];
            });
            localStorage.setItem('local_trips', JSON.stringify(trips));
          }
        }
        return { bookingId, tripId: foundBooking.tripId, booking: foundBooking };
      }
      return { bookingId };
    }
  }
);

export const addTrip = createAsyncThunk(
  'tickets/addTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:3001/trips', tripData);
      
      // Also save to local storage so it merges during offline/online searches
      const localTrips = localStorage.getItem('local_trips');
      const tripsList = localTrips ? JSON.parse(localTrips) : [];
      tripsList.push(res.data);
      localStorage.setItem('local_trips', JSON.stringify(tripsList));

      return res.data;
    } catch (err) {
      console.warn('Sunucu bağlantı hatası, sefer yerel olarak simüle edildi:', err);
      const localTrips = localStorage.getItem('local_trips');
      const tripsList = localTrips ? JSON.parse(localTrips) : [];
      tripsList.push(tripData);
      localStorage.setItem('local_trips', JSON.stringify(tripsList));
      return tripData;
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'tickets/deleteTrip',
  async (tripId) => {
    await axios.delete(`http://localhost:3001/trips/${tripId}`);
    return tripId;
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSearchCriteria: (state, action) => {
      state.searchCriteria = { ...state.searchCriteria, ...action.payload };
    },
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
      state.selectedSeats = [];
      state.selectedSeatGenders = {};
    },
    toggleSeat: (state, action) => {
      const { seatNumber, gender } = action.payload;
      const index = state.selectedSeats.indexOf(seatNumber);
      if (index > -1) {
        state.selectedSeats.splice(index, 1);
        delete state.selectedSeatGenders[seatNumber];
      } else {
        state.selectedSeats.push(seatNumber);
        state.selectedSeatGenders[seatNumber] = gender;
      }
    },
    clearSeatSelection: (state) => {
      state.selectedSeats = [];
      state.selectedSeatGenders = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTrips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredTrips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Seferler yüklenirken hata oluştu.';
      })
      // updateTripSeats
      .addCase(updateTripSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTripSeats.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTrip = action.payload;
        
        if (updatedTrip.isFallback) {
          const { tripId, selectedSeats, selectedSeatGenders } = updatedTrip;
          const applyFallback = (t) => {
            if (t.id === tripId) {
              t.bookedSeats = [...t.bookedSeats, ...selectedSeats];
              t.bookedGenders = { ...t.bookedGenders, ...selectedSeatGenders };
            }
          };
          state.trips.forEach(applyFallback);
          state.filteredTrips.forEach(applyFallback);
          if (state.selectedTrip && state.selectedTrip.id === tripId) {
            state.selectedTrip.bookedSeats = [...state.selectedTrip.bookedSeats, ...selectedSeats];
            state.selectedTrip.bookedGenders = { ...state.selectedTrip.bookedGenders, ...selectedSeatGenders };
          }
          return;
        }

        const tripIndex = state.trips.findIndex(t => t.id === updatedTrip.id);
        if (tripIndex > -1) {
          state.trips[tripIndex] = updatedTrip;
        }
        const filteredIndex = state.filteredTrips.findIndex(t => t.id === updatedTrip.id);
        if (filteredIndex > -1) {
          state.filteredTrips[filteredIndex] = updatedTrip;
        }
        if (state.selectedTrip && state.selectedTrip.id === updatedTrip.id) {
          state.selectedTrip = updatedTrip;
        }
      })
      // fetchBookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      // addBooking
      .addCase(addBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      // deleteBooking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        const { bookingId, tripId, booking } = action.payload;
        state.bookings = state.bookings.filter(b => b.id !== bookingId);
        
        if (booking && tripId) {
          const applyRelease = (t) => {
            if (t.id === tripId) {
              t.bookedSeats = t.bookedSeats.filter(s => !booking.seats.includes(s));
              booking.seats.forEach(s => {
                delete t.bookedGenders[s];
              });
            }
          };
          state.trips.forEach(applyRelease);
          state.filteredTrips.forEach(applyRelease);
          if (state.selectedTrip && state.selectedTrip.id === tripId) {
            applyRelease(state.selectedTrip);
          }
        }
      })
      // addTrip
      .addCase(addTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      // deleteTrip
      .addCase(deleteTrip.fulfilled, (state, action) => {
        const tripId = action.payload;
        state.trips = state.trips.filter(t => t.id !== tripId);
        state.filteredTrips = state.filteredTrips.filter(t => t.id !== tripId);
        if (state.selectedTrip && state.selectedTrip.id === tripId) {
          state.selectedTrip = null;
        }
      });
  }
});

export const {
  setSearchCriteria,
  setSelectedTrip,
  toggleSeat,
  clearSeatSelection
} = ticketSlice.actions;

export default ticketSlice.reducer;
