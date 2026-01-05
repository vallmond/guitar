import { useState, useEffect } from 'react';
import { loadSong } from './utils/songLoader';
import { loadChords } from './utils/chordLoader';
import type { SongData } from './types';
import type { ChordShape } from './data/chords';
import { SongViewer } from './components/SongViewer';
import { SongList } from './components/SongList';
import { ChordLibrary } from './components/ChordLibrary';

function App() {
  const [view, setView] = useState<'library' | 'song' | 'chords'>('library');
  const [song, setSong] = useState<SongData | null>(null);
  const [chords, setChords] = useState<Record<string, ChordShape[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Centralized function to sync state from current URL
  const syncStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const songId = params.get('song');
    const viewParam = params.get('view');

    setError(null);

    if (viewParam === 'chords') {
      setView('chords');
      setSong(null);
      return;
    }

    if (songId) {
      setLoading(true);
      fetch(import.meta.env.BASE_URL + 'songs/index.json')
        .then(res => res.json())
        .then((library: any[]) => {
          const entry = library.find(s => s.id === songId);
          if (entry) {
            return loadSong(entry.filename);
          }
          throw new Error('Song not found in library');
        })
        .then(data => {
          setSong(data);
          setView('song');
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(`Could not load song "${songId}": ${err.message}`);
          setLoading(false);
        });
    } else {
      // Default to library if no song and no specific view
      setView('library');
      setSong(null);
      setLoading(false);
    }
  };

  // Initial Load & Popstate Listener
  useEffect(() => {
    // 1. Load Chords globally
    loadChords().then(setChords).catch(console.error);

    // 2. Initial Sync
    syncStateFromUrl();

    // 3. Listen for back/forward interactions
    const handlePopState = () => syncStateFromUrl();
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Helpers
  const navigateToSong = (songId: string, filename: string) => {
    // Update URL
    const url = `?song=${songId}`;
    window.history.pushState({}, '', url);

    // Update State directly (faster than waiting for popstate, though we could dispatch it)
    setLoading(true);
    setError(null);
    loadSong(filename)
      .then((data) => {
        setSong(data);
        setView('song');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const navigateToLibrary = () => {
    window.history.pushState({}, '', '/');
    setView('library');
    setSong(null);
    setError(null);
  };

  const navigateToChords = () => {
    window.history.pushState({}, '', '?view=chords');
    setView('chords');
    setSong(null);
    setError(null);
  };

  // Handlers for Components
  const handleSelectSong = (filename: string) => {
    // We need the ID for the URL. 
    // SongList passes filename (e.g. /songs/gruppa_krovi.json).
    // We need to look up the ID from the index, or change SongList to pass ID.
    // Easiest: fetch index to reverse lookup, OR better: Update SongList to pass ID.

    // Attempt to extract ID from filename or just rely on index fetch? 
    // The current SongList implementation passes `song.url` (filename).
    // Let's quickly fetch the index to find the ID, ensuring valid URLs.
    // Let's quickly fetch the index to find the ID, ensuring valid URLs.
    fetch(import.meta.env.BASE_URL + 'songs/index.json')
      .then(res => res.json())
      .then((library: any[]) => {
        const entry = library.find(s => s.filename === filename);
        if (entry) {
          navigateToSong(entry.id, entry.filename); // filename passed as is, loader handles base
        } else {
          console.error("Could not find ID for file:", filename);
          // Fallback?
        }
      });
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-10 text-center">Loading...</div>;
  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white p-10 text-center">
      <div className="text-red-500 mb-4">Error: {error}</div>
      <button onClick={navigateToLibrary} className="text-blue-400 underline">Back to Library</button>
    </div>
  );

  if (view === 'chords') {
    return <ChordLibrary chords={chords} onBack={navigateToLibrary} />;
  }

  return view === 'library' ? (
    <div className="static">
      <SongList onSelectSong={handleSelectSong} />
      <div className="fixed bottom-6 right-6">
        <button onClick={navigateToChords} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg font-bold">
          🎸 Chord Library
        </button>
      </div>
    </div>
  ) : (
    song && <SongViewer song={song} onBack={navigateToLibrary} chordLibrary={chords} />
  );
}

export default App;
