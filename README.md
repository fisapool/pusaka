# Firebase Studio Project: PusakaPro

This is a NextJS starter project in Firebase Studio, tailored for **PusakaPro**, an application designed to assist users with small estate legal processes in Malaysia.

## About PusakaPro

PusakaPro aims to simplify the complexities of small estate administration by providing users with clear guidance, tools, and resources. It features AI-powered assistance for timeline estimations and fee calculations, a step-by-step roadmap, integrated document tracking, legal guides, and a helpful chatbot.

## Core Features

- **Roadmap & Timeline**: Get AI-powered timeline estimations, follow a step-by-step guide for Malaysian small estate administration, and manage your document checklist. The checklist is for local progress tracking (saved in your browser if logged in), with links encouraging manual document management in your personal Google Drive.
- **Legal & Financial Hub**: Access comprehensive legal guides on various aspects of estate law, estimate potential administration fees with an AI-powered calculator, and find links to search for legal professionals via Google Maps.
- **Integrated Chatbot**: An AI assistant to help users with queries related to the small estate process, drawing information from PusakaPro's legal guides, roadmap, and document checklist.
- **Help Center**: Find answers to frequently asked questions (FAQs) and support information.
- **Settings**: View user profile information (if logged in with Google) and manage application preferences (future feature).

## Getting Started

To run the PusakaPro application:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Set up Environment Variables**:
    Copy the `.env.example` file to `.env` (if one exists) or create a `.env` file. Populate it with your Firebase project configuration details (API Key, Auth Domain, Project ID, Storage Bucket, etc.) and any other required API keys (e.g., for Genkit AI services).
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
    # Add any other environment variables (e.g., GOOGLE_API_KEY for Genkit)
    ```
3.  **Run the Development Servers**:
    You need to run two servers in separate terminals:
    *   For the Next.js frontend:
        ```bash
        npm run dev
        ```
    *   For the Genkit AI backend:
        ```bash
        npm run genkit:dev
        ```
        (Or `npm run genkit:watch` for auto-reloading on Genkit flow changes)

4.  **Access the Application**:
    Open your browser and navigate to `http://localhost:9002` (or the port specified by `npm run dev`).

The main application code is located within the `src` directory. The AI flows are in `src/ai/flows`.
