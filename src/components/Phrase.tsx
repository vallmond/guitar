import React, { useMemo } from 'react';
import type { SongLine, RhythmPattern } from '../types';
import { parsePattern, alignLyricsToPattern } from '../utils/rhythmEngine';
import { ChordLabel } from './ChordLabel';

import type { ChordShape } from '../data/chords';

interface PhraseProps {
    lines: SongLine[];
    patterns: RhythmPattern[];
    chordLibrary?: Record<string, ChordShape[]>;
    preferredVoicings?: Record<string, number>;
}

export const Phrase: React.FC<PhraseProps> = ({ lines, patterns, chordLibrary, preferredVoicings }) => {
    // 1. Calculate the total grid size
    const totalSteps = useMemo(() => {
        return patterns.reduce((acc, p) => acc + p.len, 0);
    }, [patterns]);

    // 2. Flatten all steps into a single array with absolute positioning index
    const allSteps = useMemo(() => {
        let currentStepOffset = 0;
        const flattened = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const pattern = patterns[i];
            const parsed = parsePattern(pattern);
            const aligned = alignLyricsToPattern(parsed, line.lyrics);

            // Map to absolute position
            const mapped = aligned.map(step => ({
                ...step,
                absoluteIndex: currentStepOffset + step.index,
                measureIndex: i
            }));

            flattened.push(...mapped);
            currentStepOffset += pattern.len;
        }
        return flattened;
    }, [lines, patterns]);

    const gridStyle = {
        gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`
    };

    return (
        <div className="w-full mb-4 relative group">
            {/* Hover Grid Overlay (Optional details on hover) */}
            <div className="absolute inset-0 grid gap-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={gridStyle}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={`grid-${i}`} className="border-l border-gray-800 h-full"></div>
                ))}
            </div>

            {/* Chords Row */}
            <div className="grid gap-0" style={gridStyle}>
                {lines.map((line, i) => {
                    const startStep = patterns.slice(0, i).reduce((acc, p) => acc + p.len, 0);
                    return (
                        <div
                            key={`chord-${i}`}
                            className="col-span-4 whitespace-nowrap mb-0" // Tighter layout
                            style={{ gridColumnStart: startStep + 1, lineHeight: '1.2' }}
                        >
                            <ChordLabel
                                chord={line.chord}
                                chordShape={
                                    chordLibrary?.[line.chord]
                                        ? chordLibrary[line.chord][preferredVoicings?.[line.chord] || 0]
                                        : undefined
                                }
                            />
                        </div>
                    );
                })}
            </div>

            {/* Lyrics Row (Continuous) */}
            <div className="grid gap-0 relative" style={gridStyle}>
                {allSteps.map((step) => {
                    return (
                        <div
                            key={`step-${step.absoluteIndex}`}
                            className="flex flex-col items-start justify-center relative"
                            style={{ gridColumnStart: step.absoluteIndex + 1 }}
                        >
                            {step.lyric && (
                                <div className="text-lg font-medium text-white whitespace-nowrap absolute left-0 top-0 -translate-y-1/4 z-10 transition-colors group-hover:text-yellow-200">
                                    {step.lyric.replace(/-$/, '')}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Phrase Underline */}
            <div className="w-full h-px bg-gray-700 mt-2 group-hover:bg-blue-500 transition-colors"></div>
        </div>
    );
};
