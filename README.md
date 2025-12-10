# Accessible Combobox Component

A production-ready React combobox with full keyboard navigation, screen reader support, and zero axe-core violations. Built with TypeScript and comprehensive testing.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4-729B1B)](https://vitest.dev/)

[![CI](https://github.com/oscarpinzon/accessible-combobox-react/actions/workflows/ci.yml/badge.svg)](https://github.com/oscarpinzon/accessible-combobox-react/actions/workflows/ci.yml)
[![Deploy](https://github.com/oscarpinzon/accessible-combobox-react/actions/workflows/deploy.yml/badge.svg)](https://github.com/oscarpinzon/accessible-combobox-react/actions/workflows/deploy.yml)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](https://github.com/oscarpinzon/accessible-combobox-react)

## ✨ Highlights

- 🎯 **Generic & Reusable** - Works with any data source, not just cities
- ♿ **Accessibility First** - Full keyboard navigation and screen reader support
- 🧪 **Zero axe-core Violations** - Automated accessibility testing on all states
- 🔒 **Type-Safe** - Built with TypeScript strict mode
- 📦 **Production Ready** - Comprehensive tests, error handling, loading states
- 🚀 **Modern Stack** - React 19, Vite 7, Vitest 4

## 📸 Demo

### Live Demo

👉 **[View Live Demo](https://oscarpinzon.github.io/accessible-combobox-react/)**

### Component Documentation

📚 **[View Storybook](https://oscarpinzon.github.io/accessible-combobox-react/storybook/)**

Or run locally:

```bash
npm run storybook
# Opens at http://localhost:6006
```

### Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/oscarpinzon/accessible-combobox-react.git
cd accessible-combobox-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

#### Using the Generic Combobox Component

```tsx
import { Combobox } from '@/components/Combobox';
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState('');

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];

  return (
    <Combobox
      id="fruit-picker"
      label="Choose a fruit"
      value={value}
      options={options}
      onChange={setValue}
      helperText="Start typing to search"
    />
  );
}
```

#### Using the City Search Component

```tsx
import { CityField } from '@/components/CityField';
import { useState } from 'react';

function MyForm() {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');

  return (
    <>
      <CityField
        label="Canadian City"
        onCityChange={setCity}
        onStatusChange={setStatus}
      />
      <p>Selected: {city}</p>
      <p>Status: {status}</p>
    </>
  );
}
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run all tests
npm run test:a11y        # Run accessibility tests only
npm run test:integration # Run integration tests
npm run test:coverage    # Generate coverage report
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
```

## 🏗️ Architecture & Design Decisions

### Component Structure

```
src/
├── components/
│   ├── Combobox/          # Generic, reusable combobox
│   │   ├── Combobox.tsx   # Main component logic
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── *.test.tsx     # Unit tests
│   │   └── *.a11y.test.tsx # Accessibility tests
│   ├── CityField/         # Domain-specific implementation
│   │   ├── CityField.tsx
│   │   ├── *.test.tsx
│   │   └── *.a11y.test.tsx
│   └── StatusBar/         # Screen reader announcements
│       ├── StatusBar.tsx
│       ├── *.test.tsx
│       └── *.a11y.test.tsx
├── hooks/
│   ├── useCities.ts       # Data fetching logic
│   └── useCities.test.ts
└── __tests__/
    └── integration/       # User workflow tests
```

### Key Design Patterns

#### 1. Separation of Concerns

- **`<Combobox>`**: Generic, presentational component
- **`<CityField>`**: Business logic wrapper
- **`useCities`**: Data fetching hook

**Why?** Enables reusability, easier testing, and clear boundaries.

#### 2. Controlled Component Pattern

```tsx
// Parent controls state
<Combobox value={value} onChange={setValue} />
```

**Why?** Predictable state management, easier testing, better integration.

#### 3. Progressive Enhancement Data Fetching

```tsx
// useCities.ts - Try API first, fallback to static data
const res = await fetch(`/cities?q=${query}`);
if (res.ok) return await res.json();

// Fallback to preloaded static data
const filtered = allCities.filter((c) => c.includes(query));
```

**Why?** Works in development (with API) and production (static hosting like GitHub Pages).

#### 4. Request Cancellation

```tsx
useEffect(() => {
  let cancelled = false;

  fetch(url).then((data) => {
    if (!cancelled) setCities(data);
  });

  return () => {
    cancelled = true;
  };
}, [query]);
```

**Why?** Prevents race conditions and stale data when typing quickly.

#### 5. Minimum Query Length

```tsx
if (query.length < 2) {
  setCities([]);
  return;
}
```

**Why?** Reduces unnecessary API calls and improves UX (single character = too many results).

### Performance Considerations

#### Minimum Query Length

```tsx
if (query.length < 2) return;
```

**Impact:** Prevents ~26 unnecessary API calls (one per letter a-z)

#### Request Cancellation

```tsx
return () => {
  cancelled = true;
};
```

**Impact:** Prevents race conditions and wasted network requests

#### Result Limiting

- API returns max 20 results
- UI displays max 10 suggestions

**Impact:** Faster rendering, reduced DOM nodes, better UX

#### Static Data Preloading

```tsx
useEffect(() => {
  fetch('/cities.json').then(setAll);
}, []);
```

**Impact:** Instant fallback when API unavailable, works offline

### Trade-offs & Decisions

| Decision                           | Why                                               | Trade-off                      |
| ---------------------------------- | ------------------------------------------------- | ------------------------------ |
| CSS Modules over styled-components | Better performance, simpler setup                 | Less dynamic styling           |
| Client-side filtering fallback     | Faster UX, works offline                          | Limited to preloaded data      |
| Min 2 chars for search             | Reduces API load, better UX                       | Slight delay to see results    |
| Mock API in dev                    | Easier development, no backend needed             | Different from production      |
| No debouncing                      | Dataset is small, request cancellation sufficient | More API calls for fast typers |

## ♿ Accessibility Features

### Keyboard Navigation

| Key        | Action                                |
| ---------- | ------------------------------------- |
| `Tab`      | Move focus to/from input              |
| `↑/↓`      | Navigate suggestions                  |
| `Enter`    | Select highlighted suggestion         |
| `Escape`   | Close suggestions and clear selection |
| `Home/End` | Jump to first/last suggestion         |

### Screen Reader Support

- **ARIA Roles**: Proper `combobox`, `listbox`, `option` roles
- **Live Region Announcements**:
  - Number of suggestions available
  - Loading states
  - Error messages
  - Selected values
- **Descriptive Labels**: All inputs have associated labels
- **Error Linking**: Error messages linked with `aria-describedby`
- **Status Updates**: Real-time feedback via `role="status"` and `role="alert"`

### Visual Accessibility

- ✅ Clear focus indicators on all interactive elements
- ✅ Color is not the only indicator of state
- ✅ Sufficient color contrast (verified with axe-core)
- ✅ Loading spinner with accessible label
- ✅ Error states with icon + text
- ✅ Disabled states clearly indicated

### Automated Testing

- **Zero axe-core violations** across all component states
- Tests cover: default, loading, error, disabled, and valid states

### Manual Testing

Tested with:

- ✅ VoiceOver (macOS)
- ✅ Keyboard-only navigation
- ✅ High contrast mode
- ✅ 200% browser zoom

## 🧪 Testing Strategy

### Layered Testing Approach

1. **Unit Tests** (`*.test.tsx`): Component behavior, props, edge cases
2. **Accessibility Tests** (`*.a11y.test.tsx`): Zero violations with axe-core
3. **Integration Tests** (`integration/*.test.tsx`): Complete user workflows

**Why This Approach?**

- **Fast feedback**: Unit tests run in milliseconds
- **Compliance confidence**: Automated a11y checks catch common issues
- **User confidence**: Integration tests validate real scenarios

### Test Coverage

```bash
npm run test:coverage
```

**Coverage Targets**: ~95% lines, functions, branches

### Running Tests

```bash
# All tests
npm test

# Watch mode (during development)
npm run test:watch

# Specific test types
npm run test:a11y        # Accessibility tests only
npm run test:integration # Integration tests only

# With UI (browser-based test runner)
npm run test:ui

# Coverage report
npm run test:coverage
```

### What's Tested

#### Combobox Component

- ✅ Rendering with different props
- ✅ Keyboard navigation (all keys)
- ✅ Mouse interactions
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Loading states
- ✅ Error states
- ✅ Validation
- ✅ Edge cases (empty, disabled, etc.)

#### CityField Component

- ✅ City search functionality
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Validation logic

#### StatusBar Component

- ✅ Different status messages
- ✅ Screen reader announcements
- ✅ Conditional rendering

#### Integration Tests

- ✅ Complete search → select → validate flow
- ✅ Error recovery
- ✅ Multi-component interactions

## 🔮 Future Improvements

### Performance

- [ ] Add debouncing (300ms) to reduce API calls for fast typers
- [ ] Implement virtual scrolling for lists >100 items with `react-window`
- [ ] Add caching layer with SWR or React Query
- [ ] Memoize filtered results with `useMemo`

### Features

- [ ] Recent searches saved to localStorage
- [ ] Geolocation to suggest nearby cities first
- [ ] Multi-select mode for selecting multiple cities
- [ ] Custom option rendering with templates
- [ ] Fuzzy matching for typos (e.g., "Vancover" → "Vancouver")

### Accessibility

- [ ] Announce result count on every keystroke
- [ ] Configurable ARIA labels for internationalization
- [ ] High contrast mode detection with `prefers-contrast`
- [ ] Reduced motion support with `prefers-reduced-motion`

### Developer Experience

- [ ] Publish to npm as standalone package
- [ ] E2E tests with Playwright
- [ ] Visual regression tests

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 📧 Contact

Created by [Oscar Pinzon](https://github.com/oscarpinzon)

<div align="center">
  Built with ❤️ and accessibility in mind
</div>
