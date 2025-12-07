import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import LoginPage from './components/LoginPage';
import { initializeGemini } from './services/geminiService';

const App: React.FC = () => {
  
  useEffect(() => {
    initializeGemini();
  }, []);

  // Simple "Auth" state simulation - in a real app this would be more complex
  // For this demo, we allow access to the app directly from landing
  const [initialPrompt, setInitialPrompt] = useState<string>("");

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage setInitialPrompt={setInitialPrompt} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<ChatInterface initialPrompt={initialPrompt} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;