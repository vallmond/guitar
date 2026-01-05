import type { SongData } from '../types';
import { parseSongText } from './textParser';

export async function loadSong(url: string = '/gruppa_krovi.json'): Promise<SongData> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load song: ${response.statusText}`);
    }
    const data = await response.json() as SongData;

    // If rawText is present (global), parse it into blocks (Legacy support or single block)
    if (data.rawText && (!data.blocks || data.blocks.length === 0)) {
        const textToParse = Array.isArray(data.rawText) ? data.rawText.join('\n') : data.rawText;
        const defaultPatternKey = Object.keys(data.patterns)[0] || 'kino_strum';
        const defaultLen = data.patterns[defaultPatternKey]?.len || 16;
        data.blocks = parseSongText(textToParse, defaultPatternKey, defaultLen);
    }

    // Process block-level text keys
    if (data.blocks) {
        data.blocks.forEach(block => {
            // Check for 'text' field (we added it to type definition as optional)
            // We need to cast or access it if TypeScript complains, but we added it to the interface.
            if ((block as any).text && (!block.lines || block.lines.length === 0)) {
                // Determine pattern for this block
                const patternKey = (block as any).pattern || Object.keys(data.patterns)[0];
                const patternLen = data.patterns[patternKey]?.len || 16;
                const textArr = (block as any).text as string[];
                const textStr = Array.isArray(textArr) ? textArr.join('\n') : textArr;

                // Parse
                // We need parseSongText to return just the lines, or we use a new helper.
                // parseSongText returns SongBlock[]. We want lines.
                // Actually parseSongText returns SongBlock[], which has lines.
                // Let's rely on parseSongText treating the input as one block.
                const parsedBlocks = parseSongText(textStr, patternKey, patternLen);
                // Flatten lines from the result
                block.lines = parsedBlocks.flatMap(b => b.lines);
            }
        });
    }

    return data;
}
