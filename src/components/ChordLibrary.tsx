import React from 'react';
import type { ChordShape } from '../data/chords';
import { ChordDiagram } from './ChordDiagram';

interface ChordLibraryProps {
    chords: Record<string, ChordShape[]>;
    onBack: () => void;
}

export const ChordLibrary: React.FC<ChordLibraryProps> = ({ chords, onBack }) => {
    // Group by first letter
    const grouped = Object.keys(chords).reduce((acc, key) => {
        const char = key.charAt(0).toUpperCase();
        if (!acc[char]) acc[char] = [];
        acc[char].push(key);
        return acc;
    }, {} as Record<string, string[]>);

    const groups = Object.keys(grouped).sort();

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-mono">
            <button
                onClick={onBack}
                className="mb-8 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition-colors"
            >
                ← Back to Home
            </button>

            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4 text-purple-500">Chord Library</h1>
                <p className="text-gray-400">Reference for all available chords</p>
            </header>

            <div className="max-w-6xl mx-auto space-y-12">
                {groups.map(char => (
                    <div key={char}>
                        <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b border-gray-800 pb-2 pl-2">
                            {char}
                        </h2>
                        <div className="flex flex-wrap gap-8 justify-start">
                            {grouped[char].sort().map(name => {
                                const variants = chords[name];
                                return variants.map((variant, idx) => (
                                    <div key={`${name}-${idx}`} className="flex flex-col items-center">
                                        <div className="bg-white p-1 rounded-lg shadow hover:scale-105 transition-transform">
                                            <ChordDiagram chord={variant} />
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            {variant.variant || `Variant ${idx + 1}`}
                                        </div>
                                    </div>
                                ));
                            })}
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="text-gray-500 italic text-center">No chords loaded.</div>
                )}
            </div>
        </div>
    );
};
