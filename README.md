# 📋 Apni Disha Memo

A modern, feature-rich web application designed to help students and professionals organize, manage, and visualize their academic and career information.

---

## 🎯 Project Overview

**Apni Disha Memo** is a comprehensive platform that provides tools for:
- Managing academic notices and exam schedules
- Tracking college course information
- Creating and exporting professional documents
- Visualizing career paths and workflows
- Secure authentication and user management

---

## ✨ Features

- 📄 **Document Management**: Upload, view, and download PDF notices and documents
- 📚 **Course Tracking**: Organize and manage college courses with structured data
- 📊 **Data Visualization**: Interactive charts and diagrams using React Flow
- 🎨 **Responsive Design**: Beautiful, accessible UI with Tailwind CSS
- 🔐 **Secure Authentication**: Powered by Clerk for user authentication
- 🌙 **Dark Mode Support**: Seamless theme switching with Next Themes
- 🌍 **Internationalization**: Multi-language support with i18n
- 📥 **Export Functionality**: Convert documents to PDF and image formats
- 🚀 **Real-time Updates**: Redux state management with persistence
- ♿ **Accessible Components**: Built with Radix UI for accessibility

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.13
- **State Management**: Redux Toolkit 2.8.2 & React Redux 9.2.0
- **Routing**: React Router DOM 6.30.1

### UI & Components
- **Component Library**: Radix UI (multiple packages)
- **Icons**: Lucide React 0.544.0 & Radix UI Icons
- **Animations**: Framer Motion 11.18.2
- **Toast Notifications**: Sonner 1.7.4 & React Hot Toast 2.6.0

### Data & Visualization
- **Data Flow**: React Flow 11.11.4
- **Charts**: Recharts 3.2.0
- **Graph Layout**: Dagre 0.8.5
- **API**: Axios 1.11.0

### Document Export
- **PDF Generation**: jsPDF 2.5.2 & jsPDF Autotable 5.0.2
- **Image Export**: html-to-image 1.11.13, html2canvas 1.4.1, dom-to-image-more 3.7.2
- **SVG Export**: svg2pdf.js 2.6.0 & save-svg-as-png 1.4.17

### Other Libraries
- **Authentication**: Clerk React 5.55.0
- **i18n**: react-i18next 15.7.3
- **Utilities**: Lodash Debounce, Class Variance Authority, CLSX
- **Date Handling**: date-fns 4.1.0
- **Markdown Parsing**: Unified, Remark Parse, Remark GFM
- **Storage**: Redux Persist 6.0.0
- **Celebration Effects**: React DOM Confetti 0.2.0

### Language Composition
- **JavaScript**: 77% (977,104 bytes)
- **Python**: 15.5% (196,994 bytes)
- **TypeScript**: 2.5% (31,434 bytes)
- **HTML**: 0.6% (8,182 bytes)
- **CSS**: 0.4% (6,139 bytes)

---

## 📁 Project Structure

```
Apni_Disha-memo/
├── src/                      # Source code directory
├── Backend/                   # Backend services
├── public/                    # Static assets
├── index.html                # Entry HTML file
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── jsconfig.json             # JavaScript configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
└── college_courses_output.json # Sample course data
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Atharv1patil/Apni_Disha-memo.git
   cd Apni_Disha-memo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (Clerk API keys, backend URLs, etc.)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (Vite default)

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

Checks code quality using ESLint.

---

## 📖 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🔐 Authentication

This project uses **Clerk** for secure user authentication:
- Sign up and login functionality
- Multi-factor authentication support
- Session management
- User profile management

Make sure to configure your Clerk API keys in the `.env` file.

---

## 📊 State Management

The application uses **Redux Toolkit** with Redux Persist for:
- Global state management
- Persistent storage across sessions
- Predictable state updates

---

## 🎨 Styling & UI

- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessible, unstyled component primitives
- **Custom theme system** with light/dark mode support
- **Responsive design** for all screen sizes

---

## 🌐 Internationalization

Multi-language support is implemented using **react-i18next**. Translations can be configured in the i18n configuration files.

---

## 📱 Features Highlights

### 📄 Document Handling
- View PDF notices and schedules
- Download and export documents
- Convert to multiple formats (PDF, PNG, SVG)

### 📚 Course Management
- Organize courses with structured data
- Track course information
- Export course lists

### 📊 Visualization
- Interactive workflow diagrams with React Flow
- Data visualization with Recharts
- Real-time diagram updates

### 🎯 User Experience
- Clean, intuitive interface
- Smooth animations with Framer Motion
- Toast notifications for feedback
- Accessibility-first component design

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License. See the LICENSE file for more details.

---

## 👤 Author

**Atharv Patil**
- GitHub: [@Atharv1patil](https://github.com/Atharv1patil)
- Repository: [Apni_Disha-memo](https://github.com/Atharv1patil/Apni_Disha-memo)

---

## 📞 Support & Contact

For issues, suggestions, or questions:
- Open an [Issue](https://github.com/Atharv1patil/Apni_Disha-memo/issues)
- Check existing [Discussions](https://github.com/Atharv1patil/Apni_Disha-memo/discussions)
- Review the [Wiki](https://github.com/Atharv1patil/Apni_Disha-memo/wiki)

---

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://react.dev/) - JavaScript library for building UIs
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Clerk](https://clerk.com/) - Authentication and user management
- All other amazing open-source contributors

---

**Made with ❤️ by Atharv Patil**

**Last Updated**: December 2025
