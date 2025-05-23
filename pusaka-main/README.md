# PusakaPro

PusakaPro is a Next.js starter project designed to assist users with small estate legal processes in Malaysia.

## Core Features

- **Roadmap & Timeline**: Get AI-powered timeline estimations, follow a step-by-step guide for Malaysian small estate administration, and manage your document checklist. The checklist is for local progress tracking (saved in your browser if logged in), with links encouraging manual document management in your personal Google Drive.
- **Legal & Financial Hub**: Access comprehensive legal guides on various aspects of estate law, estimate potential administration fees with an AI-powered calculator, and find links to search for legal professionals via Google Maps.
- **Integrated Chatbot**: An AI assistant to help users with queries related to the small estate process, drawing information from PusakaPro's legal guides, roadmap, and document checklist.
- **Help Center**: Find answers to frequently asked questions (FAQs) and support information.
- **Settings**: View user profile information (if logged in with Google) and manage application preferences (future feature).

## Getting Started

To get started, take a look at the main page component located at `src/app/page.tsx` (assuming this README is within the context of the Next.js application root directory also named 'pusaka-main').

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository (if this `pusaka-main` directory is the root of that repository):
   ```
   git clone https://github.com/fisapool/pusaka.git 
   cd pusaka 
   ```
   (Adjust the `cd` command if `pusaka-main` is a subdirectory of the cloned repo).
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your `.env` file with Firebase and other necessary API keys.
4. Run the development servers:
   * Next.js app:
     ```
     npm run dev
     ```
   * Genkit AI backend (in a separate terminal):
     ```
     npm run genkit:dev
     ```

## Usage

- Access the app at `http://localhost:9002` (or your configured port) after running the development servers.
- Explore the various features such as the Roadmap & Timeline, Legal & Financial Hub, and interact with the Chatbot.
- Log in with Google to save your document checklist progress locally in your browser.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.
