# My Friendly Tutor 🌟 (Tony's 美日語小老師)

[English](./README.md) | 繁體中文

一個專為兒童設計、有趣且互動的雙語（英文與日文）語音家教應用程式，由 **Gemini Live API** 驅動。

使用最先進的 `gemini-2.5-flash-native-audio-latest` 模型與 WebSocket 雙向語音連線技術，這個應用程式提供了即時的對話體驗。小朋友可以使用繁體中文與 AI 老師說話，AI 老師會以語音回覆，用鼓勵、活潑的方式教導他們英文和日文單字。

## ✨ 特色

- **🎙️ 即時語音互動：** 直接對著 AI 老師說話，透過 WebSocket 和 Web Audio API 即時聽到語音回覆。
- **🌍 雙語教育：** 特別為 6 歲兒童設計的 Prompt，透過友善的繁體中文介面學習英文和日文。
- **🔒 安全的金鑰儲存：** 您的 Gemini API 金鑰會安全地儲存在您瀏覽器的 `localStorage` 中——不會傳送到任何第三方伺服器。
- **🎨 兒童友善介面：** 色彩鮮豔、充滿趣味的介面，當麥克風啟用時會有呼吸燈動畫提示。

## 🛠️ 技術棧

- **前端框架：** React 18, Vite, TypeScript
- **AI 整合：** Google Gemini Live API (`GenerativeService.BidiGenerateContent`)
- **音訊處理：** 瀏覽器原生 Web Audio API (`AudioContext`, `MediaStream`, `ScriptProcessorNode`)
- **即時通訊：** WebSockets

## 🚀 快速開始

### 系統需求

- 電腦已安裝 [Node.js](https://nodejs.org/)。
- 擁有一個 [Google Gemini API Key](https://aistudio.google.com/)。您需要有權限存取 `gemini-2.5-flash-native-audio-latest` 模型。

### 安裝步驟

1. 複製此專案到您的電腦並進入專案目錄：
   ```bash
   cd synthetic-meteor
   ```

2. 安裝必要的套件：
   ```bash
   npm install
   ```

3. 啟動 Vite 開發伺服器：
   ```bash
   npm run dev
   ```

4. 打開瀏覽器並前往 `http://localhost:5173`（或 Vite 顯示的網址）。

## 💡 使用說明

1. **設定 API 金鑰：** 當您第一次開啟應用程式時，請將您的 Gemini API 金鑰貼到設定框中，然後點擊 **儲存並開始！🚀**。金鑰會保存在您瀏覽器的本機儲存空間中。
2. **開始課程：** 點擊畫面上閃爍的麥克風按鈕（🎤）來連接 Gemini Live 服務。如果瀏覽器要求麥克風權限，請選擇允許。
3. **說話與學習：** 當連接成功後（圖示變成 🛑），請對著麥克風說話！您可以問老師某個東西的英文或日文怎麼說。
4. **結束課程：** 點擊停止按鈕（🛑）即可斷開 WebSocket 連線並結束課程。

*註：當處於未連線狀態時，您可以隨時點擊主畫面下方的「清除/更換 API 金鑰」來修改您的金鑰設定。*

## 📄 授權

本專案僅供教育與展示用途。
