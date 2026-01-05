# Guitar Chords Viewer

A modern, responsive web application for viewing guitar chords and lyrics with adaptive rhythm patterns and verified chord diagrams. Designed for seamless practice and quick reference.

**LIVE DEMO**: [https://vallmond.github.io/guitar/](https://vallmond.github.io/guitar/)

## Features

-   **Song Viewer**: Displays lyrics and chords with rhythmic spacing.
    -   **Adaptive Patterns**: Songs can define 4-step or 8-step rhythm patterns.
    -   **Block Structure**: Songs are organized into Verses and Choruses.
    -   **Play Mode**: Highlights current measure (visual only).
-   **Chord Library**: Comprehensive database of chord diagrams.
    -   **Variations**: Supports multiple voicings (e.g., Open vs. Barre).
    -   **Selection**: Songs can specify preferred voicings.
    -   **Hover Support**: Hover over any chord in a song to see its diagram.
-   **Deep Linking**:
    -   Open specific songs via `?song=id`.
    -   Open library views via `?view=chords`.
    -   Full browser history support (Back/Forward).
-   **GitHub Pages Ready**: Builds to `docs/` for easy hosting.

## Tech Stack

-   **Framework**: React + TypeScript + Vite
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **State**: React Hooks + URL Sync

## Project Structure

```
public/
├── chords.json        # Chord database (Record<string, ChordShape[]>)
└── songs/
    ├── index.json     # Registry of all available songs
    └── [id].json      # Individual song data files
src/
├── components/        # UI Components (SongViewer, ChordLibrary, etc.)
├── data/              # TypeScript interfaces (ChordShape)
├── utils/             # Logic for parsing and loading
└── App.tsx            # Main router and state manager
```

## Data Formats

### Song Data (`public/songs/*.json`)
```json
{
  "id": "song_id",
  "title": "Song Title",
  "artist": "Artist Name",
  "bpm": 120,
  "patterns": {
    "V": { "name": "Verse", "len": 8, "accent": [0, 4] }
  },
  "blocks": [
    {
      "type": "V",
      "text": [
        "Lyrics with <Am>chords <$>",
        "More lyrics..."
      ]
    }
  ],
  "preferredVoicings": {
    "F#m": 1  // Use the 2nd variant (index 1) for F#m
  }
}
```

### Chord Database (`public/chords.json`)
```json
{
  "A": [
    {
      "name": "A",
      "variant": "Open",
      "startingFret": 1,
      "strings": [-1, 0, 2, 2, 2, 0],
      "fingers": [0, 0, 2, 1, 3, 0],
      "barres": []
    }
  ]
}
```

## Setup & Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    Output will be generated in the `docs/` folder, ready for GitHub Pages.

## Deployment

This project is configured to deploy to **GitHub Pages** using the `/docs` folder strategy.
1.  Push code to GitHub.
2.  Go to Repository Settings -> Pages.
3.  Source: `Deploy from a branch`.
4.  Branch: `main` / Folder: `/docs`.
