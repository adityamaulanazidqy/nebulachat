# NebulaChat

NebulaChat is a futuristic, real-time messaging interface designed with an immersive "Space/Galaxy" aesthetic. It combines modern web technologies with a distinct Glassmorphism UI style to create a unique user experience.

The application is built to simulate a high-tech communication relay, currently integrated with Google's Gemini API to provide an intelligent AI chat partner ("Nova") capable of analyzing text and attachments. It includes a complete database schema designed for a Golang + PostgreSQL backend implementation.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Author](#author)

## Features

**User Interface (UI/UX)**
- **Immersive Design:** Deep space background with interactive particle effects (starfield) and glassmorphism components.
- **Responsive Layout:** Fully adaptive sidebar and chat interface that works on desktop and mobile devices.
- **Visual Feedback:** Animated typing indicators, smooth transitions, and dynamic cursor effects.

**Functionality**
- **AI Integration:** Chat directly with "Nova", an AI assistant powered by Google Gemini (Flash model), capable of understanding context and analyzing image attachments.
- **File Attachments:** Support for uploading and previewing images and files within the chat interface.
- **User Presence:** Management of user statuses (Online, Busy, Offline).
- **Settings Management:** Comprehensive modal for managing user profile, sound preferences, and chat history.
- **Data Persistence:** SQL schemas provided for user, channel, and message storage.

## Technology Stack

**Frontend**
- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

**Backend & Data (Architecture)**
- **Database:** PostgreSQL
- **Planned Backend:** Golang (WebSockets)

## Project Structure

The project follows a component-based architecture:

- **components/**: Contains all UI elements (ChatInterface, Sidebar, Login, SettingsModal, StarBackground).
- **services/**: Handles external API integrations (Gemini API).
- **types.ts**: TypeScript interfaces for type safety across the application.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adityamaulanazidqy/nebulachat.git
   cd nebulachat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm start
   ```

Open http://localhost:3000 to view the application.

## Database Schema

This project includes SQL files to set up a PostgreSQL database.

**Entities:**
- **Users:** Stores username, avatar, and status.
- **Channels:** Manages public chat rooms (e.g., General, Tech).
- **Messages:** Stores text content, sender ID, and timestamps.
- **Attachments:** Handles file metadata linked to messages.

To apply the schema, run the contents of `database/schema.up.sql` in your PostgreSQL client.

## Author

**Aditya Maulana Zidqy**

- GitHub: [adityamaulanazidqy](https://github.com/adityamaulanazidqy)

---

&copy; 2024 NebulaChat. All Rights Reserved.
