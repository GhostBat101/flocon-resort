# Flocon Resort

A modern, interactive 3D resort visualization built with cutting-edge web technologies. Experience an immersive digital representation of a resort environment with stunning visual effects and smooth animations.

**[View Live Demo](https://ghostbat101.github.io/flocon-resort/)**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Features

✨ **3D Visualization**
- Interactive 3D graphics powered by Three.js
- Immersive resort environment rendering

🎨 **Modern UI Design**
- Responsive design built with Tailwind CSS
- Smooth animations with GSAP
- Beautiful icon system with Lucide React

🎉 **Interactive Elements**
- Confetti animations for celebratory moments
- Canvas-based effects and visualizations
- Optimized performance with React Three Fiber

⚡ **Fast & Optimized**
- Built with Next.js 14 for optimal performance
- Server-side rendering capabilities
- Production-ready deployment

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | ^14.2.24 | React framework for production |
| **React** | ^18.3.1 | UI library |
| **Three.js** | ^0.169.0 | 3D graphics library |
| **React Three Fiber** | ^8.17.10 | React renderer for Three.js |
| **React Three Drei** | ^9.114.0 | Useful helpers for Three.js |
| **GSAP** | ^3.15.0 | Animation library |
| **Tailwind CSS** | ^3.4.14 | Utility-first CSS framework |
| **Canvas Confetti** | ^1.9.4 | Confetti animation effects |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn** (v3 or higher)
- Git (for version control)

Verify your installations:
```bash
node --version
npm --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GhostBat101/flocon-resort.git
cd flocon-resort
```

### 2. Install Dependencies

```bash
npm install
```

Or if you're using yarn:
```bash
yarn install
```

---

## Usage

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Check and fix code quality issues:

```bash
npm run lint
```

---

## Development

### Local Development Workflow

1. Start the dev server with hot reload:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Edit files and see changes instantly with Next.js fast refresh

4. Check your code with the linter:
   ```bash
   npm run lint
   ```

### Building for Deployment

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm start
```

---

## Project Structure

```
flocon-resort/
├── pages/              # Next.js pages and API routes
├── public/             # Static assets (images, fonts, etc.)
├── styles/             # Global styles
├── components/         # Reusable React components
├── lib/                # Utility functions and helpers
├── package.json        # Project dependencies and scripts
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload on port 3000 |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## Performance Considerations

- **3D Rendering**: Optimized with React Three Fiber for efficient rendering
- **CSS**: Tailwind CSS provides minimal CSS bundles
- **Animations**: GSAP handles smooth, GPU-accelerated animations
- **Assets**: Static assets cached and optimized by Next.js

---

## Browser Support

This project works best on modern browsers that support:
- WebGL for 3D graphics
- ES2020+ JavaScript features
- CSS Grid and Flexbox

Recommended browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

**GitHub Pages:**
```bash
npm run build
# Configure GitHub Actions or use gh-pages package
```

**Docker:**
Create a `Dockerfile` for containerized deployment

**Traditional Server:**
Build the project and serve with Node.js or a reverse proxy like Nginx

---

## Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run lint` before committing
- Write meaningful commit messages

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

- 📖 **Documentation**: Check the [Next.js docs](https://nextjs.org/docs)
- 🐛 **Issues**: [Report bugs on GitHub](https://github.com/GhostBat101/flocon-resort/issues)
- 💬 **Discussions**: Join the conversation on [GitHub Discussions](https://github.com/GhostBat101/flocon-resort/discussions)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework used
- [Three.js](https://threejs.org/) - 3D graphics library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [GSAP](https://gsap.com/) - Animation library

---

**Made with ❤️ by [GhostBat101](https://github.com/GhostBat101)**

*Last updated: September 2026*
