# My Friendly Tutor 🌟 (Tony's 美日語小老師)

English | [繁體中文](./README.md)

A fun, interactive, and bilingual (English & Japanese) voice tutor application for children, powered by the **Gemini Live API**.

Using the cutting-edge `gemini-2.5-flash-native-audio-latest` model via WebSocket, this app provides a real-time conversational experience. Kids can speak in traditional Chinese, and the AI tutor will respond verbally, teaching them English and Japanese words in an encouraging and playful way.

## ✨ Features

- **🎙️ Real-time Voice Interaction:** Talk directly to the AI tutor and hear spoken responses instantly using WebSockets and the Web Audio API. 
- **🌍 Bilingual Education:** Specially prompted for 6-year-old children to learn English and Japanese through a friendly, traditional Chinese interface.
- **🔒 Secure API Key Storage:** Your Gemini API key is stored securely in your browser's local storage—never sent to any middleman server.
- **🎨 Child-friendly UI:** A colorful, playful interface with pulsing animations that indicate when the microphone is active.

## 🛠️ Technology Stack

- **Frontend Framework:** React 18, Vite, TypeScript
- **AI Integration:** Google Gemini Live API (`GenerativeService.BidiGenerateContent`)
- **Audio Processing:** Native Web Audio API (`AudioContext`, `MediaStream`, `ScriptProcessorNode`)
- **Real-time Communication:** WebSockets

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- A [Google Gemini API Key](https://aistudio.google.com/). You need access to the `gemini-2.5-flash-native-audio-latest` model.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd synthetic-meteor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 💡 How to Use

1. **Set API Key:** When you first load the app, paste your Gemini API Key into the setting box. Click **儲存並開始！🚀**. The key will save to your browser's `localStorage`.
2. **Start the Session:** Click the large pulsing microphone button (🎤) to connect to the Gemini Live service. Make sure to allow microphone permissions if prompted by your browser.
3. **Talk & Learn:** Once connected (🛑), speak into your microphone! Ask the tutor how to say words in English or Japanese.
4. **End Session:** Click the stop button (🛑) to disconnect the WebSocket session.

*Note: You can clear or change your API key at any time by clicking "清除/更換 API 金鑰" on the main screen when disconnected.*

## 📄 License

This project is created for educational and demonstration purposes.
