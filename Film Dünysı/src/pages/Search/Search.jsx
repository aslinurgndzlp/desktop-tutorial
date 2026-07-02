import React, { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { tmdbApi } from '../../services/tmdbApi';
import { useDebounce } from '../../hooks/useDebounce';
import SearchBar from '../../components/SearchBar/SearchBar';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fallback: Fetch popular movies to display when search is empty
  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ['search-popular-fallback'],
    queryFn: () => tmdbApi.getPopular(1),
    enabled: !debouncedSearchTerm,
  });

  // Infinite Query for search results
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['movies-search', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) => tmdbApi.searchMovies(debouncedSearchTerm, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    enabled: !!debouncedSearchTerm,
    initialPageParam: 1
  });

  // Flatten the pages array into a single array of movie results
  const searchResults = data ? data.pages.flatMap((page) => page.results || []) : [];
  const totalResultsCount = searchResults.length;

  return (
    <div className="text-white">
      {/* Search Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3" style={{ fontFamily: 'var(--heading-font)' }}>
          Milyonlarca Filmi Keşfet
        </h1>
        <p className="text-muted-custom mb-4">
          Detayları görmek, oyuncuları incelemek ve favorilerine eklemek için hemen ara.
        </p>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Results Container */}
      <div className="mt-4">
        {/* Case 1: Search term is active and query is loading */}
        {isLoading && <Loader message="Filmler aranıyor..." />}

        {/* Case 2: Query failed with error */}
        {isError && (
          <EmptyState
            title="Arama Başarısız"
            message={error?.message || "Film araması esnasında bir hata oluştu. Lütfen bağlantınızı kontrol edin."}
            icon="bi-exclamation-triangle-fill"
          />
        )}

        {/* Case 3: Search term is active, finished loading, and results exist */}
        {debouncedSearchTerm && !isLoading && !isError && (
          <>
            {totalResultsCount > 0 ? (
              <div>
                <h4 className="fw-semibold text-start mb-4">
                  "{debouncedSearchTerm}" için arama sonuçları ({searchResults[0]?.total_results || totalResultsCount})
                </h4>

                <InfiniteScroll
                  dataLength={totalResultsCount}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={<Loader message="Daha fazla film yükleniyor..." />}
                  endMessage={
                    <div className="text-center py-4 text-muted-custom small">
                      <hr style={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                      Tüm sonuçları gördünüz.
                    </div>
                  }
                  scrollThreshold={0.9}
                >
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 py-2">
                    {searchResults.map((movie, idx) => (
                      // Add index to id for uniqueness if the API returns duplicates
                      <div className="col" key={`${movie.id}-${idx}`}>
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            ) : (
              <EmptyState
                title="Sonuç Bulunamadı"
                message={`"${debouncedSearchTerm}" aramasıyla eşleşen bir film bulunamadı. Lütfen farklı kelimeler deneyin.`}
                icon="bi-search-heart"
              />
            )}
          </>
        )}

        {/* Case 4: Search input is empty, display Popular recommendations */}
        {!searchTerm && !debouncedSearchTerm && (
          <div>
            <h4 className="fw-semibold text-start mb-4">
              <i className="bi bi-compass text-primary-custom me-2"></i>Keşfetmeniz İçin Önerilenler
            </h4>
            
            {isPopularLoading ? (
              <Loader message="Öneriler yükleniyor..." />
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                {popularData?.results?.map((movie) => (
                  <div className="col" key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
