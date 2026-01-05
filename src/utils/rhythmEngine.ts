import type { LyricSegment, RhythmPattern } from '../types';

export type StrokeType = 'DOWN' | 'UP' | 'MUTE' | 'CONTINUE' | 'EMPTY';

export interface RhythmStep {
    index: number;
    stroke: StrokeType;
    lyric?: string;
    isBeat: boolean; // True if this step lands on a main beat (simplified logic for now)
}

function getStrokeType(char: string): StrokeType {
    switch (char) {
        case 'D': return 'DOWN';
        case 'U': return 'UP';
        case 'u': return 'UP'; // lowercase u for weaker upstroke?
        case 'x': return 'MUTE';
        case '.': return 'CONTINUE'; // Sustain or empty space dependent on context, treating as 'Empty/Continue'
        case ' ': return 'EMPTY';
        default: return 'EMPTY';
    }
}

export function parsePattern(pattern: RhythmPattern): RhythmStep[] {
    // Pattern scheme string e.g. "D . . u D . . u"
    // We assume the string can be space-separated or just characters
    // For safety, let's strip spaces if they are just separators, 
    // BUT in my example "D . . u" spaces are delimiters.
    // Re-reading example: "D . . u D . . u . u D . . u D ."
    // It seems spaces separate 16th notes?
    // Let's assume the scheme string contains exactly `len` tokens.

    const tokens = pattern.scheme.trim().split(/\s+/);

    // Validation: if tokens.length !== pattern.len, we might have an issue 
    // or the format allows fewer tokens to imply repetition or silence. 
    // For strictness, let's pad or truncate.

    const steps: RhythmStep[] = [];

    for (let i = 0; i < pattern.len; i++) {
        const char = tokens[i] || '.';
        steps.push({
            index: i,
            stroke: getStrokeType(char),
            isBeat: i % 4 === 0 // Assuming 4 sub-beats per beat, so every 4th step is a beat
        });
    }

    return steps;
}

export function alignLyricsToPattern(patternSteps: RhythmStep[], lyrics: LyricSegment[]): RhythmStep[] {
    // efficient lookup
    const lyricMap = new Map<number, string>();
    lyrics.forEach(l => lyricMap.set(l.step, l.text));

    return patternSteps.map(step => ({
        ...step,
        lyric: lyricMap.get(step.index)
    }));
}
