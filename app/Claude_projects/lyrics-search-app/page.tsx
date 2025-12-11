"use client";

import { useState, FormEvent, MouseEvent } from "react";

interface Artist {
  name: string;
}

interface Song {
  artist: Artist;
  title: string;
}

interface SearchData {
  data: Song[];
  prev?: string;
  next?: string;
}

interface LyricsData {
  lyrics?: string;
  error?: string;
}

export default function LyricsSearchApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [lyrics, setLyrics] = useState<{
    artist: string;
    title: string;
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  const apiURL = "https://api.lyrics.ovh";

  const searchSongs = async (term: string) => {
    try {
      const res = await fetch(`${apiURL}/suggest/${term}`);
      const data: SearchData = await res.json();
      displaySearchResults(data);
    } catch (err) {
      setError("Failed to fetch songs");
      console.error(err);
    }
  };

  const displaySearchResults = (data: SearchData) => {
    setSongs(data.data || []);
    setLyrics(null);
    setError(null);
    setShowInitialMessage(false);
    setPrevUrl(data.prev || null);
    setNextUrl(data.next || null);
  };

  const getMoreSongs = async (url: string) => {
    try {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
      const data: SearchData = await res.json();
      displaySearchResults(data);
    } catch (err) {
      setError("Failed to fetch more songs");
      console.error(err);
    }
  };

  const getLyrics = async (artist: string, songTitle: string) => {
    try {
      const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
      const data: LyricsData = await res.json();

      if (data.error) {
        setError(data.error);
        setSongs([]);
        setLyrics(null);
      } else if (data.lyrics) {
        setLyrics({
          artist,
          title: songTitle,
          text: data.lyrics,
        });
        setSongs([]);
        setError(null);
      }
      setShowInitialMessage(false);
      setPrevUrl(null);
      setNextUrl(null);
    } catch (err) {
      setError("Failed to fetch lyrics");
      console.error(err);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (!term) {
      alert("Please type in a search term");
    } else {
      searchSongs(term);
    }
  };

  const handleGetLyrics = (artist: string, songTitle: string) => {
    getLyrics(artist, songTitle);
  };

  return (
    <>
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

      <style jsx>{`
        .header {
          background-image: url("https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 0;
          position: relative;
        }

        .header::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .header-content {
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header h1 {
          margin: 0 0 30px;
        }

        .form {
          position: relative;
          width: 500px;
          max-width: 100%;
        }

        .form input {
          border: 0;
          border-radius: 50px;
          font-size: 16px;
          padding: 15px 30px;
          width: 100%;
        }

        .form button {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #e056fd;
          border: 0;
          border-radius: 50px;
          color: #fff;
          font-size: 16px;
          padding: 13px 30px;
        }

        .btn {
          background-color: #8d56fd;
          border: 0;
          border-radius: 10px;
          color: #fff;
          padding: 4px 10px;
        }

        .songs {
          list-style-type: none;
          padding: 0;
        }

        .songs li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0;
        }

        .container {
          margin: 30px auto;
          max-width: 100%;
          width: 500px;
        }

        .container h2 {
          font-weight: 300;
        }

        .container p {
          text-align: center;
        }

        .centered {
          display: flex;
          justify-content: center;
        }

        .centered button {
          transform: scale(1.3);
          margin: 15px;
        }

        .lyrics-text {
          white-space: pre-wrap;
          line-height: 1.6;
        }
      `}</style>

      <header className="header">
        <div className="header-content">
          <h1>LyricsSearch</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="search"
              placeholder="Enter artist or song name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <div className="container">
        {showInitialMessage && <p>Results will be displayed here</p>}

        {error && <p>{error}</p>}

        {lyrics && (
          <div>
            <h2>
              <strong>{lyrics.artist}</strong> - {lyrics.title}
            </h2>
            <div className="lyrics-text">{lyrics.text}</div>
          </div>
        )}

        {songs.length > 0 && (
          <ul className="songs">
            {songs.map((song, index) => (
              <li key={`${song.artist.name}-${song.title}-${index}`}>
                <span>
                  <strong>{song.artist.name}</strong> - {song.title}
                </span>
                <button
                  className="btn"
                  onClick={() => handleGetLyrics(song.artist.name, song.title)}
                >
                  Get Lyrics
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="container centered">
        {prevUrl && (
          <button className="btn" onClick={() => getMoreSongs(prevUrl)}>
            Prev
          </button>
        )}
        {nextUrl && (
          <button className="btn" onClick={() => getMoreSongs(nextUrl)}>
            Next
          </button>
        )}
      </div>
    </>
  );
}