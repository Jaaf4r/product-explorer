# Product Explorer

Product Explorer is a responsive web application for searching, filtering, sorting, and saving favorite products.

## Features

- Search products by name
- Filter products by category
- Sort products by name or price
- Add and remove favorite products
- Display favorites only
- Persist favorites with `localStorage`
- Synchronize search and filter options with URL parameters
- Display result counts and empty states
- Responsive light and dark interface

## Built With

- HTML
- CSS
- Vanilla JavaScript
- Vite
- npm

## Getting Started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Installation

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Available Scripts

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

The optimized files will be generated inside `dist/`.

### Preview production build

```bash
npm run preview
```

## Project Structure

```text
frontend-06/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js
│   ├── products.js
│   ├── storage.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## How It Works

The application keeps the current search, category, sorting, and favorite settings inside a central state object. Whenever that state changes, the product list is filtered, sorted, and rendered again.

Favorite product IDs are saved in `localStorage`, while search, category, and sorting options are reflected in the page URL.
