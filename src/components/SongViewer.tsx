import React from 'react';
import type { SongData } from '../types';
import { Phrase } from './Phrase';

import type { ChordShape } from '../data/chords';

interface SongViewerProps {
    song: SongData;
    onBack: () => void;
    chordLibrary?: Record<string, ChordShape[]>;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onBack, chordLibrary }) => {
    if (!song.blocks) {
        return <div className="p-10 text-center text-red-400">Error: No blocks found in song data.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-mono">
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition-colors"
            >
                ← Back to Library
            </button>

            {/* Header */}
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-2 text-blue-500">{song.meta.title}</h1>
                <h2 className="text-xl text-gray-400">{song.meta.artist}</h2>
                <div className="mt-4 text-sm text-gray-500">
                    BPM: {song.meta.bpm} | Time: {song.meta.time_signature.join('/')}
                </div>
            </header>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
                {song.blocks.map((block, blockIdx) => {
                    // Group lines into sets of 2 (Phrases)
                    const phrases = [];
                    if (block.lines) {
                        for (let i = 0; i < block.lines.length; i += 2) {
                            phrases.push(block.lines.slice(i, i + 2));
                        }
                    }

                    return (
                        <div key={blockIdx} className="mb-8">
                            {block.type && <h3 className="text-2xl font-bold text-gray-500 mb-4 border-b border-gray-700 pb-2">{block.type}</h3>}
                            <div className="space-y-2">
                                {phrases.map((lines, phraseIdx) => {
                                    const patterns = lines.map(l => song.patterns[l.pattern]);
                                    // Filter out any undefined patterns just in case
                                    if (patterns.some(p => !p)) return null;

                                    return (
                                        <Phrase
                                            key={phraseIdx}
                                            lines={lines}
                                            patterns={patterns as any[]}
                                            chordLibrary={chordLibrary}
                                            preferredVoicings={song.preferredVoicings}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <footer className="mt-20 text-center text-gray-700 text-xs">
                Data-driven Rhythm Viewer
            </footer>
        </div>
    );
};
