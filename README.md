# GitHub Commit Explorer

A Vue 3 + TypeScript application for exploring GitHub repositories and commits.

## Features

- Browse GitHub user repositories
- View commit history with pagination
- Favorite commits with local storage
- Detailed commit view with file diffs

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Pinia (state management)
- Tailwind CSS
- Vitest (testing)

## Setup

```bash
npm install
npm run dev
```

## Usage

1. Enter a GitHub username (try: `octocat`)
2. Select a repository
3. Browse commits and view details

## Testing

```bash
npm run test
```

**Note**: Uses GitHub's public API (60 requests/hour limit)
