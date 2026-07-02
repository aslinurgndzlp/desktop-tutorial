import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { FavoriteProvider } from './context/FavoriteContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { RatingProvider } from './context/RatingContext';
import { CommentProvider } from './context/CommentContext';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import Favorites from './pages/Favorites/Favorites';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable refetching on window focus for smoother navigation
      retry: 1, // retry failed API requests once
      staleTime: 5 * 60 * 1000, // consider cache data fresh for 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <RatingProvider>
            <CommentProvider>
              <FavoriteProvider>
                <Router>
                  <div className="d-flex flex-column min-vh-100 bg-dark-custom">
                    {/* Navigation Header */}
                    <Navbar />

                    {/* Main Content Area */}
                    <main className="flex-grow-1 container py-4" style={{ marginTop: '72px' }}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/movie/:id" element={<MovieDetails />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>

                    {/* Navigation Footer */}
                    <Footer />
                  </div>
                </Router>
              </FavoriteProvider>
            </CommentProvider>
          </RatingProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
