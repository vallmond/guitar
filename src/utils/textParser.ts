import type { SongBlock, SongLine, LyricSegment } from '../types';

export function parseSongText(text: string, defaultPattern: string = 'kino_strum', patternLength: number = 16): SongBlock[] {
    // 1. Clean and split by Lines (visual lines in editor)
    const rawLines = text.trim().split('\n').filter(l => l.trim());

    const blocks: SongBlock[] = [];
    const lines: SongLine[] = [];

    rawLines.forEach(rawLine => {
        const parts = rawLine.split('<');

        parts.forEach((part, index) => {
            if (index === 0 && !part.trim()) return; // empty start
            if (index === 0 && part.trim()) return;

            const closeIndex = part.indexOf('>');
            if (closeIndex === -1) return; // Malformed

            const tag = part.substring(0, closeIndex);
            let content = part.substring(closeIndex + 1);

            // Check if this tag is a chord or a modifier
            if (tag === '$') {
                if (lines.length > 0) {
                    applyModifier(lines[lines.length - 1], content, patternLength);
                }
                return;
            }

            const line: SongLine = {
                chord: tag,
                pattern: defaultPattern,
                lyrics: distributeLyrics(content, 0, patternLength) // Default distribution
            };

            lines.push(line);
        });
    });

    blocks.push({ type: 'Generated', lines });
    return blocks;
}

function applyModifier(line: SongLine, extraContent: string, patternLength: number) {
    if (extraContent.trim()) {
        // Late entry with text - modify the existing line
        // BUG FIX: Do not overwrite existing lyrics. Merge them.
        // Start halfway through the pattern usually?? Or a specific step?
        // Previously hardcoded to 8 (16/2). Let's use patternLength / 2.
        const startStep = Math.floor(patternLength / 2);

        const newLyrics = distributeLyrics(extraContent, startStep, patternLength);
        if (line.lyrics && line.lyrics.length > 0) {
            line.lyrics = [...line.lyrics, ...newLyrics];
        } else {
            line.lyrics = newLyrics;
        }
    } else {
        // Empty modifier tag <$>. 
        if (!line.lyrics) {
            line.lyrics = [];
        }
    }
}

function distributeLyrics(text: string, startStep: number = 0, patternLength: number = 16): LyricSegment[] {
    const rawWords = text.trim().split(/\s+/); // Split by whitespace?

    if (rawWords.length === 0 || (rawWords.length === 1 && !rawWords[0])) return [];

    const segments: LyricSegment[] = [];
    const availableSteps = patternLength - startStep;

    // Simple distribution: Evenly space them
    // Step interval = availableSteps / words.length
    const interval = Math.floor(availableSteps / rawWords.length);

    rawWords.forEach((word, idx) => {
        // Clean punctuation? Keep it.
        segments.push({
            step: startStep + (idx * interval),
            text: word + (idx < rawWords.length - 1 ? ' ' : '') // Add space back if not last
        });
    });

    return segments;
}
