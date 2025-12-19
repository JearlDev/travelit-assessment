# GitHub Commit Explorer

A modern Vue 3 application for exploring GitHub repositories and their commit history. Built with TypeScript, Pinia, Vue Router, and styled with Tailwind CSS.

## 🚀 Features

### Core Functionality

- **Repository Explorer**: Browse any GitHub user's public repositories
- **Commit Viewer**: View commit history for selected repositories
- **Commit Details**: Detailed view with file changes, diffs, and statistics
- **favourites Management**: Mark commits as favourites and manage them
- **Smart Sorting**: Sort commits by date (newest/oldest first)
- **Pagination**: Load more commits with seamless pagination

### Technical Features

- **Real-time API Integration**: Direct integration with GitHub's public API
- **Error Handling**: Comprehensive error handling for rate limits, missing users, and network issues
- **Type Safety**: Full TypeScript implementation with strict typing
- **State Management**: Robust state management with Pinia
- **Responsive Design**: Mobile-first responsive design
- **Local Storage**: Persistent favourites across browser sessions
- **Testing**: Comprehensive unit tests with Vitest

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + jsdom
- **API**: GitHub REST API v3

## 📦 Installation & Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travelit-assessment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Open Vitest UI
```

## 🎯 Usage Guide

### Getting Started

1. **Enter a GitHub username** on the home page (try: `octocat`, `torvalds`, `gaearon`)
2. **Validate and explore** - the app validates the username before proceeding
3. **Browse repositories** - select any repository to view its commits

### Exploring Commits

- **View commit details** by clicking the "📄 Details" button
- **Add to favourites** using the "💖 favourite" button
- **Sort commits** using the dropdown (newest/oldest first)
- **Load more** commits with the pagination button

### Managing favourites

- **View all favourites** in the dedicated section at the bottom
- **Remove favourites** individually or clear all at once
- **Persistent storage** - favourites are saved in your browser

### Commit Details Modal

- **File changes**: See which files were modified, added, or removed
- **Statistics**: View additions, deletions, and total changes
- **Code diffs**: See the actual code changes with syntax highlighting
- **Metadata**: Author, date, and commit SHA information

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── Home.vue        # Landing page with username form
│   └── Repositories.vue # Main repository/commit explorer
├── stores/             # Pinia store modules
│   └── github.ts       # GitHub API state management
├── services/           # API integration
│   └── github.ts       # GitHub API service layer
├── types/              # TypeScript type definitions
│   └── index.ts        # Global type definitions
├── router/             # Vue Router configuration
│   └── index.ts        # Route definitions
├── test/               # Unit tests
│   └── github.test.ts  # Store and API tests
└── main.ts            # Application entry point
```

### Key Design Decisions

#### State Management (Pinia)

- **Centralized state** for repositories, commits, and favourites
- **Computed properties** for sorted data and derived state
- **Persistence layer** for favourites using localStorage
- **Error handling** integrated into store actions

#### API Integration

- **Service layer** abstraction for GitHub API calls
- **Error handling** for rate limits, 404s, and network issues
- **TypeScript interfaces** matching GitHub API responses
- **Pagination support** with proper Link header parsing

#### Component Design

- **Composition API** for better TypeScript integration
- **Reactive data** with proper TypeScript typing
- **Modular components** with clear responsibilities
- **Responsive design** with Tailwind CSS utilities

## 🧪 Testing

The application includes comprehensive unit tests covering:

### Store Logic Tests

- Repository fetching and error handling
- Commit management and sorting
- favourites add/remove/persistence
- State transitions and computed properties

### API Service Tests

- GitHub API integration
- Error handling scenarios
- Data transformation

### Running Tests

```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # Visual interface
```

## 🔧 Configuration

### Environment Variables

No environment variables required - uses GitHub's public API endpoints.

### API Rate Limits

- **Unauthenticated requests**: 60 requests per hour per IP
- **Rate limit handling**: Automatic detection and user-friendly error messages
- **Best practices**: Efficient API usage with pagination and caching

## 🎨 UI/UX Features

### Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Adaptive layouts** that work on all screen sizes
- **Touch-friendly** interactions for mobile devices

### User Experience

- **Loading states** with skeleton screens and spinners
- **Error boundaries** with recovery suggestions
- **Optimistic updates** for favourite management
- **Keyboard navigation** support
- **Accessibility** features with proper ARIA labels

### Visual Design

- **Clean interface** with consistent spacing and typography
- **Color-coded** file status indicators
- **Syntax highlighting** for code diffs
- **Icon usage** for intuitive interaction

## 🚦 Error Handling

### Network Errors

- **Rate limit detection** with reset time display
- **User not found** with helpful suggestions
- **Network timeouts** with retry options

### User Input Validation

- **GitHub username format** validation
- **Empty input** prevention
- **Real-time feedback** during validation

### API Errors

- **Graceful degradation** when APIs are unavailable
- **Error recovery** with manual retry options
- **Informative messages** for different error types

## 🔮 Future Enhancements

### Potential Features

- **Authentication**: GitHub OAuth for higher rate limits and private repos
- **Advanced filtering**: Filter commits by author, message, or file type
- **Commit search**: Full-text search across commit messages
- **Export functionality**: Export commit data to CSV/JSON
- **Collaboration**: Share favourite commits or repository views
- **Dark mode**: Theme switching support

### Performance Optimizations

- **Virtual scrolling** for large commit lists
- **Image lazy loading** for user avatars
- **Request deduplication** and caching
- **Service worker** for offline functionality

## 📝 Development Notes

### API Integration Approach

The application uses the GitHub REST API v3 with these key endpoints:

- `/users/:username/repos` - User repositories
- `/repos/:owner/:repo/commits` - Repository commits
- `/repos/:owner/:repo/commits/:sha` - Commit details

### Type Safety Implementation

- **Strict TypeScript** configuration with no implicit any
- **Interface definitions** matching GitHub API responses
- **Generic type utilities** for reusable patterns
- **Runtime type validation** where appropriate

### Testing Strategy

- **Unit tests** for store logic and API functions
- **Mock implementations** for external dependencies
- **Edge case coverage** for error scenarios
- **TypeScript compatibility** in test files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is created for the TravelIT interview assessment.

---

**Estimated Development Time**: 1.5-2 hours
**Created by**: [Your Name]
**Date**: December 2024
