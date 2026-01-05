import type { ChordShape } from '../data/chords';

export async function loadChords(): Promise<Record<string, ChordShape[]>> {
    const response = await fetch('/chords.json');
    if (!response.ok) {
        throw new Error('Failed to load chords library');
    }
    return response.json();
}
