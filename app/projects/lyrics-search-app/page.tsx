"use client";

import Head from "next/head";
import { FormEvent, useState } from "react";

const API_URL = "https://api.lyrics.ovh";

type Song = {
  artist: {
    name: string;
  };
  title: string;
};

type SuggestResponse = {
  data: Song[];
  prev?: string;
  next?: string;
};

const LyricsSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [lyricsHtml, setLyricsHtml] = useState<string | null>(null);
  const [lyricsTitle, setLyricsTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      alert("Please type in a search term");
      return;
    }
    await searchSongs(term);
  };

  const searchSongs = async (term: string) => {
    setLoading(true);
    setErrorMsg(null);
    setLyricsHtml(null);
    setLyricsTitle(null);

    try {
      const res = await fetch(`${API_URL}/suggest/${encodeURIComponent(term)}`);
      const data: SuggestResponse = await res.json();
      showData(data);
    } catch (err) {
      setErrorMsg("Error fetching songs. Please try again.");
      setSongs([]);
      setPrevUrl(null);
      setNextUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const showData = (data: SuggestResponse) => {
    setSongs(data.data || []);
    setPrevUrl(data.prev || null);
    setNextUrl(data.next || null);
    setLyricsHtml(null);
    setLyricsTitle(null);
  };

  const getMoreSongs = async (url: string) => {
    if (!url) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const proxiedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      const res = await fetch(proxiedUrl);
      const data: SuggestResponse = await res.json();
      showData(data);
    } catch {
      setErrorMsg("Error loading more songs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getLyrics = async (artist: string, songTitle: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `${API_URL}/v1/${encodeURIComponent(artist)}/${encodeURIComponent(
          songTitle
        )}`
      );
      const data: { lyrics?: string; error?: string } = await res.json();

      if (data.error) {
        setLyricsHtml(data.error);
        setLyricsTitle(null);
      } else if (data.lyrics) {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
        setLyricsHtml(lyrics);
        setLyricsTitle(`<strong>${artist}</strong> - ${songTitle}`);
      } else {
        setLyricsHtml("No lyrics found.");
        setLyricsTitle(null);
      }

      setSongs([]);
      setPrevUrl(null);
      setNextUrl(null);
    } catch {
      setErrorMsg("Error fetching lyrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>LyricsSearch</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* HEADER */}
      <header>
        <h1>LyricsSearch</h1>

        <form id="form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter artist or song name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {/* RESULTS */}
      <div id="result" className="container">
        {loading && <p>Loading...</p>}

        {errorMsg && <p className="error">{errorMsg}</p>}

        {lyricsHtml && (
          <>
            {lyricsTitle && (
              <h2
                dangerouslySetInnerHTML={{
                  __html: lyricsTitle,
                }}
              />
            )}
            <span
              dangerouslySetInnerHTML={{
                __html: lyricsHtml,
              }}
            />
          </>
        )}

        {!lyricsHtml && !loading && songs.length === 0 && (
          <p>Results will be displayed here</p>
        )}

        {songs.length > 0 && (
          <ul className="songs">
            {songs.map((song, i) => (
              <li key={i}>
                <span>
                  <strong>{song.artist.name}</strong> - {song.title}
                </span>
                <button
                  className="btn"
                  onClick={() => getLyrics(song.artist.name, song.title)}
                >
                  Get Lyrics
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* PAGINATION */}
      <div id="more" className="container centered">
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

      {/* FIXED COLOR STYLES */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background: #ffffff;
          color: #000000 !important; /* all text black */
          font-family: Arial, sans-serif;
          margin: 0;
        }

        /* HEADER IMAGE but keep white text over the image */
        header {
          background-image: url("https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1350&q=80");
          background-size: cover;
          background-position: center;
          position: relative;
          padding: 100px 0;
          text-align: center;
          color: white !important;
        }

        header::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
        }

        header * {
          z-index: 1;
          position: relative;
        }

        /* FORM */
        form {
          width: 500px;
          max-width: 100%;
          margin: 0 auto;
          position: relative;
        }

        form input {
          width: 100%;
          padding: 15px 20px;
          border-radius: 50px;
          border: 1px solid #333;
          font-size: 16px;
          color: #000;
          background: #fff;
        }

        form button {
          position: absolute;
          right: 4px;
          top: 4px;
          padding: 12px 25px;
          background: #e056fd;
          color: #fff;
          border-radius: 50px;
          border: none;
          cursor: pointer;
        }

        /* RESULTS */
        .container {
          width: 500px;
          max-width: 100%;
          margin: 30px auto;
          color: #000 !important;
        }

        .songs li {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          color: #000 !important;
        }

        .btn {
          background: #8d56fd;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          color: #fff;
          cursor: pointer;
        }

        .error {
          color: red;
          font-weight: bold;
        }

        .centered {
          text-align: center;
        }

        h2 {
          color: #000 !important;
        }

        span {
          color: #000 !important;
        }
      `}</style>
    </>
  );
};

export default LyricsSearchPage;
