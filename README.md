Rathkeale College Song Portal
Welcome to the Rathkeale College Song Portal, a centralized digital hub for our school’s musical traditions, hymns, and anthems. This repository allows students to browse our complete catalogue, stream high-quality audio, and use integrated learning modules to master lyrics for chapel services and house singing.

🚀 Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Before you begin, ensure you have the following installed on your computer:

Node.js: (LTS version recommended). This includes npm, the package manager we use to run the project.

Git: To clone the repository to your local machine.

Installation
Follow these steps to set up the development environment:

Clone the repository:

Bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
Install project dependencies:
Open your terminal in the root project folder and run:

Bash
npm install
This command reads your package.json file and downloads all the necessary React libraries and tools.

Setup Audio Assets:
Ensure your audio files are placed in the public/audio/ directory. The filenames must match the audioUrl paths defined in your public/database.json file.

Launch the development server:
Start the React development environment:

Bash
npm start
Access the Portal:
Once the command finishes, your browser should automatically open to:
http://localhost:3000

🛠 Project Structure
public/: Contains your static assets, including database.json (the source of truth for all song data) and the audio/ folder.

src/: Contains your React components and core JavaScript logic (App.js) that powers the rendering engine and audio playback.

package.json: Manages the project dependencies and scripts.

🎶 How it Works
This application uses a direct-fetch architecture. When the app loads, it reads the database.json file directly from the public/ folder. The React logic then dynamically generates the song catalogue and handles the state for the HTML5 audio player, lyrics flashcards, and filtering system.

💡 Troubleshooting
"Songs not showing up?": If you recently updated the JSON file, ensure you perform a Hard Refresh in your browser (Ctrl + F5 or Cmd + Shift + R) to clear the cached version of the data.

"API Errors": Ensure your App.js fetch request is pointed to /database.json and not an external API endpoint.

"Missing Dependencies": If you see errors regarding missing packages, delete your node_modules folder and package-lock.json file, then run npm install again.

This project is built for the Rathkeale College community to preserve our musical heritage.