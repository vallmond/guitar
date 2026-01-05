import React, { useState } from 'react';
import type { ChordShape } from '../data/chords';
import { ChordDiagram } from './ChordDiagram';

interface ChordLabelProps {
    chord: string; // Name e.g. "F#m"
    chordShape?: ChordShape; // The data object
}

export const ChordLabel: React.FC<ChordLabelProps> = ({ chord, chordShape }) => {
    const [hover, setHover] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span className="text-lg font-bold text-blue-400 cursor-pointer hover:underline decoration-blue-400 decoration-2 underline-offset-4">
                {chord}
            </span>

            {/* Tooltip */}
            {hover && chordShape && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-in fade-in duration-200">
                    <ChordDiagram chord={chordShape} />
                    {/* Arrow */}
                    <div className="w-3 h-3 bg-white rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5 shadow-sm"></div>
                </div>
            )}
        </div>
    );
};
