import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ChatbotButton from './components/ChatbotButton';

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div>
      <Navigation />
      <Hero />
      <Services />
      <Booking />
      <Footer />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}

export default App;
