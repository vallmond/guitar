export type TimeSignature = [number, number];

export interface SongMeta {
    title: string;
    artist: string;
    bpm: number;
    time_signature: TimeSignature;
}

export interface RhythmPattern {
    name: string;
    len: number; // Duration in steps (e.g. 16 for 16th notes in 4/4)
    scheme: string; // "D . . u . u"
}

export interface LyricSegment {
    step: number; // 0-indexed step within the pattern
    text: string;
}

export interface SongLine {
    chord: string;
    pattern: string; // Reference to a pattern key
    lyrics: LyricSegment[];
}

export interface SongBlock {
    type?: string;
    lines: SongLine[];
    text?: string[]; // Raw text for this block, allows per-block parsing
}

export interface SongData {
    meta: SongMeta;
    patterns: Record<string, RhythmPattern>;
    blocks?: SongBlock[]; // Now optional if rawText is provided
    rawText?: string | string[]; // Global raw text option
    preferredVoicings?: Record<string, number>; // Map of chord name to variant index (0-based)
}
