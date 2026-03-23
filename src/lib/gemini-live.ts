const HOST = 'generativelanguage.googleapis.com';

export class GeminiLiveTutor {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private playbackQueueTime = 0;
  
  public onMessage: ((text: string) => void) | null = null;
  public onStateChange: ((state: 'connected' | 'disconnected' | 'error', reason?: string) => void) | null = null;
  public onTurnComplete: (() => void) | null = null;

  constructor(private apiKey: string) {}

  public async start() {
    if (!this.apiKey) {
      alert("Please provide a Gemini API Key.");
      return;
    }
    
    const wsUrl = `wss://${HOST}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.onStateChange?.('connected');
      this.sendSetup();
      this.startAudioCapture();
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed.', event.code, event.reason);
      this.onStateChange?.('disconnected', event.reason || `Code: ${event.code}`);
      this.stop();
    };

    this.ws.onerror = (e) => {
      console.error('WebSocket Error:', e);
      this.onStateChange?.('error');
    };

    this.ws.onmessage = async (event) => {
      try {
        let textData = event.data;
        if (textData instanceof Blob) {
          textData = await textData.text();
        }
        
        const data = JSON.parse(textData);
        if (data.serverContent?.modelTurn?.parts) {
          for (const part of data.serverContent.modelTurn.parts) {
            if (part.text) {
              this.onMessage?.(part.text);
            }
            if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
              this.playAudio(part.inlineData.data);
            }
          }
        }
        if (data.serverContent?.turnComplete) {
          this.onTurnComplete?.();
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
  }

  public stop() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.onStateChange?.('disconnected');
    this.playbackQueueTime = 0;
  }

  public sendAudioStreamEnd() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        realtimeInput: {
          audioStreamEnd: true
        }
      }));
    }
  }

  private sendSetup() {
    const prompt = "你是一個專為 6 歲兒童設計的超級親切的雙語家教！你的母語是繁體中文 (zh-TW)，你可以同時教小朋友英文和日文。請用非常簡單的繁體中文解釋，搭配簡單的英文或日文單字與短句。當小孩說中文時，你可以教他這個東西的英文或日文怎麼說。說話要活潑、有耐心，多鼓勵小朋友！";

    const setupMsg = {
      setup: {
        model: "models/gemini-2.5-flash-native-audio-latest",
        generationConfig: {
          responseModalities: ["AUDIO"]
        },
        systemInstruction: {
          parts: [{ text: prompt }]
        }
      }
    };
    this.ws?.send(JSON.stringify(setupMsg));
    console.log("Sent setup message:", setupMsg);
  }

  private async startAudioCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        
        const pcmData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          const s = Math.max(-1, Math.min(1, pcmData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Convert to Base64
        let binary = '';
        const bytes = new Uint8Array(pcm16.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        
        this.ws.send(JSON.stringify({
          realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: base64 }] }
        }));
      };
      
      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (e) {
      console.error("Audio capture failed:", e);
    }
  }

  private playAudio(base64Data: string) {
    if (!this.audioContext) return;
    
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }
    
    // Gemini typical output rate is 24000
    const sampleRate = 24000;
    const buffer = this.audioContext.createBuffer(1, float32.length, sampleRate);
    buffer.getChannelData(0).set(float32);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    
    // Schedule seamless playback
    const currentTime = this.audioContext.currentTime;
    if (this.playbackQueueTime < currentTime) {
      this.playbackQueueTime = currentTime;
    }
    source.start(this.playbackQueueTime);
    this.playbackQueueTime += buffer.duration;
  }
}
