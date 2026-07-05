import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, Volume2, User, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function VoiceConversation() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string>('Disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // PCM to Base64 utility
  const pcmToBase64 = (pcmData: Float32Array) => {
    const buffer = new ArrayBuffer(pcmData.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < pcmData.length; i++) {
      let s = Math.max(-1, Math.min(1, pcmData[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const nextStartTimeRef = useRef<number>(0);

  const playAudioChunk = (audioCtx: AudioContext, base64Audio: string) => {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const buffer = bytes.buffer;

      // The live API returns 24kHz PCM 16-bit
      const view = new DataView(buffer);
      const float32Array = new Float32Array(view.byteLength / 2);
      for (let i = 0; i < float32Array.length; i++) {
        float32Array[i] = view.getInt16(i * 2, true) / 32768;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }
      
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
    } catch (err) {
      console.error("Audio playback error", err);
    }
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = async () => {
        setStatus('Connected');
        setIsRecording(true);

        const Stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = Stream;

        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputCtx;
        
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        outputAudioCtxRef.current = outputCtx;
        nextStartTimeRef.current = outputCtx.currentTime;

        const source = inputCtx.createMediaStreamSource(Stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
            wsRef.current.send(JSON.stringify({ audio: base64 }));
          }
        };
      };

      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio && outputAudioCtxRef.current) {
          playAudioChunk(outputAudioCtxRef.current, msg.audio);
        }
        if (msg.interrupted) {
          // Reset audio queue
          if (outputAudioCtxRef.current) {
            nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
          }
        }
      };

      wsRef.current.onclose = () => {
        stopSession();
      };
      
      wsRef.current.onerror = () => {
        stopSession();
        setStatus('Error connecting');
      };

    } catch (err) {
      console.error(err);
      setStatus('Failed to access microphone');
    }
  };

  const stopSession = () => {
    setIsRecording(false);
    setStatus('Disconnected');
    
    if (processorRef.current && inputAudioCtxRef.current) {
      processorRef.current.disconnect();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 relative bg-slate-50">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Voice Coach</h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
          Practice your speaking skills in real-time. The AI will listen, respond, and gently correct your pronunciation and grammar.
        </p>
      </div>

      <div className="relative">
        {/* Animated rings when recording */}
        {isRecording && (
          <>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-indigo-200 rounded-full blur-xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 bg-indigo-300 rounded-full blur-2xl -z-10"
            />
          </>
        )}

        <button
          onClick={isRecording ? stopSession : startSession}
          className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-sm ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/50' 
              : 'bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 shadow-indigo-500/10'
          }`}
        >
          {isRecording ? <MicOff size={48} /> : <Mic size={48} />}
          <span className="font-medium tracking-wide">
            {isRecording ? 'End Practice' : 'Start Practice'}
          </span>
        </button>
      </div>

      <div className="mt-12 flex items-center gap-3 text-slate-600 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
        <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
        <span className="font-mono text-sm">{status}</span>
      </div>

      {/* Suggested Topics */}
      {!isRecording && (
        <div className="mt-16 w-full max-w-3xl">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 text-center">Suggested Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TopicCard title="Job Interview" desc="Practice common HR and technical questions." />
            <TopicCard title="Coffee Shop" desc="Order drinks and make small talk." />
            <TopicCard title="Performance Review" desc="Discuss achievements and goals with a manager." />
          </div>
        </div>
      )}
    </div>
  );
}

function TopicCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
      <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}
