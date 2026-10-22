# Productivity Tracker

A clean, responsive to-do app built with plain **HTML, CSS and JavaScript**. No frameworks, no build step. Tasks and theme choice are saved in the browser, so everything is still there after a refresh.

<!-- Add a screenshot or GIF here, e.g. ![App preview](screenshot.png) -->

## Features

- **Add tasks** with the input form (empty tasks are ignored)
- **Mark as done / undo**, completed tasks get a strikethrough
- **Edit tasks inline** (press Enter or click the save icon to confirm)
- **Delete tasks**
- **Filter tasks** by All, Active or Completed
- **Clear completed** tasks in one click
- **Live counter** showing how many tasks are left
- **Empty states** with a different message for each filter
- **Light / dark theme** toggle (moon / sun icon)
- **Saved in localStorage**: tasks and theme choice survive a page reload
- **Responsive layout** that works on desktop, tablet and phone

## Tech Stack

- HTML5
- CSS3 (custom properties for theming, Flexbox, media queries)
- Vanilla JavaScript (ES6+)
- [Font Awesome](https://fontawesome.com/) for icons
- [Inter](https://fonts.google.com/specimen/Inter) font from Google Fonts

## Getting Started

No installation needed.

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   ```
2. Open the project folder
   ```bash
   cd <your-repo-name>
   ```
3. Open `index.html` in your browser (or use a tool like the VS Code Live Server extension)

> An internet connection is needed the first time to load the icons and the font from their CDNs.

## Project Structure

```
.
├── index.html   # page structure and the task item <template>
├── style.css    # styling, light/dark theme variables, responsive rules
├── app.js       # app logic: state, rendering, events, localStorage
└── README.md
```

## How It Works

- **Single source of truth:** all tasks live in one `tasks` array (`{ id, text, completed }`). Every change updates the array, saves it to localStorage, then re-renders the list.
- **Rendering:** each task is created from an HTML `<template>` and added to the page through a `DocumentFragment`. Text is inserted with `textContent`, so user input is never treated as HTML.
- **Event delegation:** one click listener on the list handles the Done, Delete and Edit buttons for every task, including ones added later.
- **Theming:** colors are CSS variables. Switching to dark mode only adds a `dark-theme` class on `<body>`, which overrides the variables.

## Possible Improvements

- Drag and drop to reorder tasks
- Due dates and priorities
- Press Escape to cancel editing
- Follow the system theme (`prefers-color-scheme`) on first visit

## License

This project is open source and available under the [MIT License](LICENSE).
