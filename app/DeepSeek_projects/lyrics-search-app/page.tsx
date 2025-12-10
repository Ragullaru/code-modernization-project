'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

interface Song {
  id: number;
  title: string;
  artist: {
    name: string;
  };
}

interface ApiResponse {
  data: Song[];
  prev?: string;
  next?: string;
  total?: number;
}

interface LyricsResponse {
  lyrics?: string;
  error?: string;
}

export default function LyricsSearchApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [lyrics, setLyrics] = useState<string>('');
  const [currentArtist, setCurrentArtist] = useState<string>('');
  const [currentSongTitle, setCurrentSongTitle] = useState<string>('');
  const [prevUrl, setPrevUrl] = useState<string>('');
  const [nextUrl, setNextUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const apiURL = 'https://api.lyrics.ovh';

  // Search by song or artist
  const searchSongs = async (term: string) => {
    if (!term.trim()) {
      setError('Please type in a search term');
      return;
    }

    setIsLoading(true);
    setError('');
    setLyrics('');
    setShowResults(true);

    try {
      const res = await fetch(`${apiURL}/suggest/${term}`);
      const data: ApiResponse = await res.json();
      
      setSongs(data.data || []);
      setPrevUrl(data.prev || '');
      setNextUrl(data.next || '');
      
      if (!data.data || data.data.length === 0) {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to fetch songs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get more songs (prev/next)
  const getMoreSongs = async (url: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Using CORS proxy for pagination
      const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
      const data: ApiResponse = await res.json();
      
      setSongs(data.data || []);
      setPrevUrl(data.prev || '');
      setNextUrl(data.next || '');
      setLyrics('');
    } catch (err) {
      setError('Failed to fetch more songs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get lyrics for song
  const getLyrics = async (artist: string, songTitle: string) => {
    setIsLoading(true);
    setError('');
    setCurrentArtist(artist);
    setCurrentSongTitle(songTitle);

    try {
      const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
      const data: LyricsResponse = await res.json();

      if (data.error) {
        setError(data.error);
        setLyrics('');
      } else if (data.lyrics) {
        setLyrics(data.lyrics);
      }
    } catch (err) {
      setError('Failed to fetch lyrics. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    searchSongs(searchTerm);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGetLyrics = (artist: string, songTitle: string) => {
    getLyrics(artist, songTitle);
  };

  const handlePrev = () => {
    if (prevUrl) {
      getMoreSongs(prevUrl);
    }
  };

  const handleNext = () => {
    if (nextUrl) {
      getMoreSongs(nextUrl);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSongs([]);
    setLyrics('');
    setPrevUrl('');
    setNextUrl('');
    setError('');
    setShowResults(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <h1 style={styles.title}>LyricsSearch</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter artist or song name..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </header>

      <main style={styles.main}>
        <div style={styles.resultContainer}>
          {isLoading ? (
            <p style={styles.message}>Loading...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : lyrics ? (
            <div style={styles.lyricsContainer}>
              <h2 style={styles.lyricsTitle}>
                <strong>{currentArtist}</strong> - {currentSongTitle}
              </h2>
              <div 
                style={styles.lyrics}
                dangerouslySetInnerHTML={{ 
                  __html: lyrics.replace(/(\r\n|\r|\n)/g, '<br>') 
                }}
              />
              <button 
                onClick={resetSearch}
                style={styles.backButton}
              >
                Back to Search
              </button>
            </div>
          ) : showResults ? (
            <>
              {songs.length > 0 ? (
                <ul style={styles.songsList}>
                  {songs.map((song) => (
                    <li key={song.id} style={styles.songItem}>
                      <span style={styles.songInfo}>
                        <strong>{song.artist.name}</strong> - {song.title}
                      </span>
                      <button
                        onClick={() => handleGetLyrics(song.artist.name, song.title)}
                        style={styles.lyricsButton}
                      >
                        Get Lyrics
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={styles.message}>No songs found. Try a different search.</p>
              )}
            </>
          ) : (
            <p style={styles.message}>Results will be displayed here</p>
          )}
        </div>

        {(prevUrl || nextUrl) && !lyrics && (
          <div style={styles.paginationContainer}>
            {prevUrl && (
              <button 
                onClick={handlePrev}
                style={styles.paginationButton}
              >
                Prev
              </button>
            )}
            {nextUrl && (
              <button 
                onClick={handleNext}
                style={styles.paginationButton}
              >
                Next
              </button>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background-color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
        }

        button {
          cursor: pointer;
        }

        button:active {
          transform: scale(0.95);
        }

        input:focus,
        button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
  },
  header: {
    backgroundImage: 'url("https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 0',
    position: 'relative' as const,
  },
  headerOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    margin: '0 0 30px',
    zIndex: 1,
    position: 'relative' as const,
  },
  form: {
    position: 'relative' as const,
    width: '500px',
    maxWidth: '100%',
    zIndex: 1,
  },
  searchInput: {
    border: 0,
    borderRadius: '50px',
    fontSize: '16px',
    padding: '15px 30px',
    width: '100%',
  },
  searchButton: {
    position: 'absolute' as const,
    top: '2px',
    right: '2px',
    backgroundColor: '#e056fd',
    border: 0,
    borderRadius: '50px',
    color: '#fff',
    fontSize: '16px',
    padding: '13px 30px',
  },
  main: {
    maxWidth: '500px',
    margin: '30px auto',
    width: '100%',
  },
  resultContainer: {
    width: '100%',
  },
  message: {
    textAlign: 'center' as const,
  },
  error: {
    color: '#ff0000',
    textAlign: 'center' as const,
  },
  songsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  songItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  },
  songInfo: {
    flex: 1,
    marginRight: '10px',
  },
  lyricsButton: {
    backgroundColor: '#8d56fd',
    border: 0,
    borderRadius: '10px',
    color: '#fff',
    padding: '4px 10px',
    whiteSpace: 'nowrap' as const,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    backgroundColor: '#8d56fd',
    border: 0,
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 20px',
    margin: '0 10px',
    transform: 'scale(1.3)',
  },
  lyricsContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  lyricsTitle: {
    fontWeight: 300,
    marginBottom: '20px',
  },
  lyrics: {
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap' as const,
    marginBottom: '20px',
  },
  backButton: {
    backgroundColor: '#8d56fd',
    border: 0,
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 20px',
    display: 'block',
    margin: '0 auto',
  },
};