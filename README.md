# 🍅 Pomodoro Timer App

A beautiful, fully-featured Pomodoro Timer application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

- ⏱️ **Customizable Timer**: Work sessions, short breaks, and long breaks with adjustable durations
- 📊 **Task Management**: Create, organize, and track tasks with pomodoro estimates
- 📈 **Statistics Dashboard**: View your productivity with detailed stats and charts
- 🔔 **Smart Notifications**: Browser and audio notifications when sessions complete
- 🎨 **Beautiful UI**: Clean, calming design with smooth animations
- 🌙 **Dark Mode**: Light and dark theme support
- 💾 **Offline Support**: Works entirely in the browser with LocalStorage persistence
- ⌨️ **Keyboard Shortcuts**: Control timer with Space (start/pause) and R (reset)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jzakowski/pomodoro-timer.git
cd pomodoro-timer
```

2. Run the setup script:
```bash
./init.sh
```

Or manually install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
pomodoro-timer/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and helpers
│   └── styles/           # Global styles
├── tests/
│   ├── scripts/          # Test automation scripts
│   ├── screenshots/      # Test screenshots
│   └── verification/     # Test artifacts and evidence
├── docs/                 # Project documentation
├── public/               # Static assets
└── logs/                 # Application logs
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type check

## 🎯 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + hooks
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Storage**: LocalStorage + IndexedDB
- **Audio**: Web Audio API
- **Notifications**: Notification API

## 📝 Development Notes

This project uses an autonomous development approach where features are implemented based on GitHub Issues created from `feature_list.json`.

Each feature includes:
- Detailed implementation requirements
- UI/UX specifications
- Test steps for verification
- Acceptance criteria

## 🤝 Contributing

This project is part of an autonomous coding demonstration. Check out the [Issues](https://github.com/jzakowski/pomodoro-timer/issues) to see what's being worked on.

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

Built as an autonomous coding project demonstrating the power of AI-assisted development.
