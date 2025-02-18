# Meet App

**Meet App** is a mobile chat application built with **React Native** and **Expo**. It provides users with a seamless chat experience where they can send messages, share images, and their location. The app uses **Google Firebase** for real-time data storage and authentication.

## Features

- **Chat Functionality**: Send real-time text messages.
- **Image Sharing**: Share images from your device's gallery or capture new ones.
- **Location Sharing**: Send your current location displayed in a map view.
- **Offline Support**: Messages are available locally even without an internet connection.
- **Anonymous Authentication**: Users are authenticated via Firebase anonymously.
- **Accessibility**: Compatible with screen readers for enhanced usability.

## Technologies Used

- **React Native**: Core framework for building native mobile apps.
- **Expo**: Simplified development and deployment process.
- **Google Firestore**: Cloud-based NoSQL database for real-time data storage.
- **Firebase Storage**: Secure storage for user-uploaded images.
- **Firebase Authentication**: Secure user authentication and authorization.
- **Gifted Chat**: Pre-built chat UI component library for rapid development.
- **AsyncStorage**: Local storage for caching messages offline.
- **React Native Maps**: For displaying shared location data.
- **ImagePicker**: To upload and share images.

## Project Structure

- **Components**: Reusable UI components for the chat interface, message bubbles, input fields, etc.
- **Screens**: Individual screens for the app's various views (start screen, chat screen, etc.).
- **Assets**: Images, icons, and other static assets used in the app.

## Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

`git clone https://github.com/your-username/chat-demo.git`

`cd chat-demo`

### 2. Use Node.js Version 16.19.0 

Ensure you have Node.js v16.19.0 installed. If you use nvm, switch to Node 16.19.0 with:

`nvm use 16.19.0`

If you don't have nvm, install Node.js v16.19.0 from [Node.js website](https://nodejs.org).

### 3. Install Dependencies

Install necessary dependencies by running:

`npm install`

### 4. Install Expo CLI

If you don't already have the Expo CLI globally, install it using:

`npm install -g expo-cli`

### 5. Configure Firebase

1. Go to the Firebase console.
2. Create a new Firebase project.
3. Enable Firestore and Firebase Storage:
   - In Firestore and Storage, set the rules from 'false' to 'true' as follows during development:

            {* existing code *}
            allow read, write: if true;

4. Add a web app to your project and copy the config.
5. Add the Firebase config to your project in the `firebaseConfig` object in `App.js`:

'const firebaseConfig = { apiKey: "YOUR_API_KEY", authDomain: "YOUR_AUTH_DOMAIN", projectId: "YOUR_PROJECT_ID", storageBucket: "YOUR_STORAGE_BUCKET", messagingSenderId: "YOUR_MESSAGING_SENDER_ID", appId: "YOUR_APP_ID" };'


### 6. Run the App

Start the development server using:

`npx expo start`

After starting:

- Open the app on your physical device using the Expo Go app.
- Or run it on an Emulator (Android Studio).

## Contribute

We welcome contributions to improve this project. Please follow these guidelines:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them.
- Push your changes to your forked repository.
- Submit a pull request to the main repository.
