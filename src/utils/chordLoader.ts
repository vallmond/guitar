import type { ChordShape } from '../data/chords';

export async function loadChords(): Promise<Record<string, ChordShape[]>> {
    const response = await fetch(import.meta.env.BASE_URL + 'chords.json');
    if (!response.ok) {
        throw new Error('Failed to load chords library');
    }
    return response.json();
}
