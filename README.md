# MUTANT Admin Panel

A modern, responsive admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Dark Theme**: Modern dark UI with purple accent colors
- **Responsive Design**: Mobile-first approach with CSS variables
- **Component-Based**: Modular React components
- **TypeScript**: Full type safety
- **Modern Icons**: Lucide React icons

## Layout Structure

The dashboard consists of three main layout sections:

1. **Sidebar**: Core navigation with collapsible mobile menu
2. **Header**: Top navigation with user profile and actions
3. **Main Content**: Dashboard with statistics, missions, affiliates, and inbox

## Components

- `Sidebar`: Left navigation panel with core menu items
- `Header`: Top header with search, notifications, and user profile
- `StatsCards`: Statistics overview cards
- `TopMissions`: Top performing missions list
- `TopAffiliates`: Top performing affiliates list
- `Inbox`: Recent activity and notifications

## CSS Variables

The project uses CSS custom properties for consistent theming:

```css
:root {
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-card: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --accent-purple: #8b5cf6;
  /* ... and more */
}
```

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- CSS Custom Properties

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── Sidebar.tsx
    ├── Header.tsx
    ├── StatsCards.tsx
    ├── TopMissions.tsx
    ├── TopAffiliates.tsx
    ├── Inbox.tsx
    └── index.ts
```
