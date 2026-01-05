import React from 'react';
import type { ChordShape } from '../data/chords';

interface ChordDiagramProps {
    chord: ChordShape;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord }) => {
    // Config
    const width = 120;
    const height = 140;
    const numStrings = 6;
    const numFrets = 5;

    // Margins
    const xPad = 25;
    const yPad = 30; // space for title/top
    const stringSpacing = (width - 2 * xPad) / (numStrings - 1);
    const fretSpacing = (height - yPad - 15) / numFrets;

    // Helpers
    const getX = (stringIdx: number) => xPad + stringIdx * stringSpacing;
    const getY = (fretIdx: number) => yPad + fretIdx * fretSpacing;

    return (
        <div className="bg-white rounded shadow-lg p-2 inline-block">
            <h3 className="text-center font-bold text-black mb-1">{chord.name}</h3>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Nut (Thick line if startingFret is 1) */}
                {chord.startingFret === 1 && (
                    <line x1={getX(0)} y1={getY(0)} x2={getX(5)} y2={getY(0)} stroke="black" strokeWidth="4" />
                )}
                {chord.startingFret > 1 && (
                    <text x={10} y={getY(1)} fontSize="12" fontWeight="bold" fill="black">{chord.startingFret}</text>
                )}

                {/* Frets */}
                {Array.from({ length: numFrets + 1 }).map((_, i) => (
                    <line
                        key={`fret-${i}`}
                        x1={getX(0)}
                        y1={getY(i)}
                        x2={getX(5)}
                        y2={getY(i)}
                        stroke="black"
                        strokeWidth={i === 0 && chord.startingFret === 1 ? 0 : 1}
                    />
                ))}

                {/* Strings */}
                {Array.from({ length: numStrings }).map((_, i) => (
                    <line
                        key={`str-${i}`}
                        x1={getX(i)}
                        y1={getY(0)}
                        x2={getX(i)}
                        y2={getY(numFrets)}
                        stroke="black"
                        strokeWidth="1"
                    />
                ))}

                {/* Barres */}
                {chord.barres?.map((barre, i) => {
                    const relFret = barre.fret - chord.startingFret + 1;
                    if (relFret < 1 || relFret > numFrets) return null;
                    return (
                        <rect
                            key={`barre-${i}`}
                            x={getX(barre.fromString) - 8}
                            y={getY(relFret) - 4} // Centered (8px height)
                            width={(barre.toString - barre.fromString) * stringSpacing + 16}
                            height={8} // Even thinner (was 12)
                            rx={4} // Rounded cap
                            fill="black"
                        />
                    );
                })}

                {/* Fingers / Dots */}
                {chord.strings.map((fret, strIdx) => {
                    if (fret === -1) {
                        // Mute
                        return <text key={`mute-${strIdx}`} x={getX(strIdx)} y={getY(0) - 5} textAnchor="middle" fontSize="10" fill="black">x</text>;
                    }
                    if (fret === 0) {
                        // Open
                        return <circle key={`open-${strIdx}`} cx={getX(strIdx)} cy={getY(0) - 5} r="3" stroke="black" fill="white" />;
                    }

                    // Fretted position
                    const relFret = fret - chord.startingFret + 1;

                    // If strictly barred (covered by barre graphics), we might skip detailed dot or draw it on top.
                    // Let's draw finger dots on top of barre for clarity? Or just barre.
                    // The user image shows dots ON the barre.

                    // Checking if this specific note is covered by a barre:
                    const isBarred = chord.barres?.some(b => b.fret === fret && strIdx >= b.fromString && strIdx <= b.toString);

                    // If it is covered by a barre, we usually draw the barre shape (above) and maybe the finger number?
                    // Actually user image shows a full black bar, and then blue numbers for fingers.
                    // My implementation draws a black rect for barre.
                    // If I draw a circle here it will be on top.

                    return (
                        <g key={`note-${strIdx}`}>
                            {!isBarred && (
                                <circle
                                    cx={getX(strIdx)}
                                    cy={getY(relFret) - fretSpacing / 2}
                                    r="6"
                                    fill="black"
                                />
                            )}
                            {/* Finger Number */}
                            {chord.fingers[strIdx] > 0 && (
                                <text
                                    x={getX(strIdx)}
                                    y={getY(relFret) - fretSpacing / 2 + 3}
                                    textAnchor="middle"
                                    fill={isBarred ? "white" : "white"}
                                    fontSize="8"
                                    fontWeight="bold"
                                >
                                    {chord.fingers[strIdx]}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
