# Study Buddy - AI Coding Assistant

**Study Buddy** is a Chrome Extension I built to act as an intelligent coding tutor while practicing on competitive programming platforms.

Unlike basic chat tools, this extension can **read the problem statement and your current code directly from the screen**. It uses the Groq API (Llama-3 model) to provide hints, debug errors, or explain time complexity without you having to copy-paste back and forth.

## Features

- **Context-Aware:** Automatically detects if you are on LeetCode, Codeforces, HackerRank, or GeeksforGeeks.
- **Privacy-First:** Your API key is stored locally on your machine, never on an external server.
- **Smart Assistance:** Ask questions like *"Why is my code failing test case 2?"* or *"Give me a hint for the approach"* and it answers based on your specific code.
- **Custom UI:** A clean side panel that sits right next to your coding workspace.

## Installation & Setup

Since I use a secure API key for the AI model, you will need to set up a configuration file locally to run this project.

### 1. Clone the repository
```bash
git clone [https://github.com/Tvisha-Jaiswal/Study-Buddy-Extension.git](https://github.com/Tvisha-Jaiswal/Study-Buddy-Extension.git)
```

### 2. Create the Config File (Important!)

For security reasons, the API key is not uploaded to GitHub. You need to create a file named `config.js` in the `src` folder (or root, depending on where your `manifest.json` is).

Create `config.js` and paste this inside:

```js
const CONFIG = {
    API_KEY: "YOUR_GROQ_API_KEY_HERE"
};
```
(You can get a free API key from the Groq Console)


### 3. Load into Chrome

1. Open Chrome and go to:
    `chrome://extensions/`
2. Toggle **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the project folder.
5. Pin the extension icon to your toolbar for easy access.


## Tech Stack

**Frontend:**
- Vanilla JavaScript  
- HTML  
- Tailwind CSS  

**Backend:**
- Chrome Extension Manifest V3  
- Service Workers  

**AI Integration:**
- Groq API (Llama-3-70B)


## Supported Platforms

- LeetCode  
- Codeforces  
- HackerRank  
- GeeksforGeeks  
