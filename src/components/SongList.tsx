import React, { useEffect, useState } from 'react';

interface SongEntry {
    id: string;
    title: string;
    artist: string;
    filename: string;
}

interface SongListProps {
    onSelectSong: (url: string) => void;
}

export const SongList: React.FC<SongListProps> = ({ onSelectSong }) => {
    const [songs, setSongs] = useState<SongEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/songs/index.json')
            .then(res => res.json())
            .then(data => {
                setSongs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load library", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center p-10 text-gray-500">Loading Library...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-mono">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 text-orange-500">Guitar Chords Library</h1>
                <p className="text-gray-400">Select a song to start playing</p>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {songs.map(song => (
                    <div
                        key={song.id}
                        onClick={() => onSelectSong(song.filename)}
                        className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-750 cursor-pointer transition-all group"
                    >
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 mb-2">{song.title}</h3>
                        <p className="text-gray-400">{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
