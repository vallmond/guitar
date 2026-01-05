export interface ChordShape {
    name: string;
    variant?: string; // e.g. "Open", "Barre 5th fret"
    startingFret: number; // The fret number of the top of the diagram (usually 1, or the barre fret)
    strings: number[]; // 0=open, -1=mute, 1+ = relative fret from startingFret (or absolute? let's do absolute fret)
    fingers: number[]; // 0=none, 1=index, 2=middle, 3=ring, 4=pinky
    barres?: { fret: number, fromString: number, toString: number }[]; // strings 0-5 (low E to high e)
}

export const CHORD_LIBRARY: Record<string, ChordShape> = {
    "F#m": {
        name: "F#m",
        startingFret: 2,
        strings: [2, 4, 4, 2, 2, 2],
        fingers: [1, 3, 4, 1, 1, 1], // Barre usually implies index on all, but we can visualize explicit dots
        barres: [{ fret: 2, fromString: 0, toString: 5 }]
    },
    "C#m": {
        name: "C#m",
        startingFret: 4,
        strings: [-1, 4, 6, 6, 5, 4], // x 4 6 6 5 4
        fingers: [0, 1, 3, 4, 2, 1],
        barres: [{ fret: 4, fromString: 1, toString: 5 }]
    },
    "Bm": {
        name: "Bm",
        startingFret: 2,
        strings: [-1, 2, 4, 4, 3, 2], // x 2 4 4 3 2
        fingers: [0, 1, 3, 4, 2, 1],
        barres: [{ fret: 2, fromString: 1, toString: 5 }]
    },
    "E": {
        name: "E",
        startingFret: 1,
        strings: [0, 2, 2, 1, 0, 0], // 0 2 2 1 0 0
        fingers: [0, 2, 3, 1, 0, 0],
        barres: []
    }
};
