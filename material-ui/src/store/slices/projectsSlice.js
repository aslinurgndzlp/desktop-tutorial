import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/projects';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addProject = createAsyncThunk('projects/addProject', async (projectData) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, data }) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    currentProject: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // addProject
      .addCase(addProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateProject
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      // deleteProject
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null;
        }
      });
  }
});

export const { setCurrentProject, clearCurrentProject } = projectsSlice.actions;
export default projectsSlice.reducer;
