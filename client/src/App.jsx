import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import SymptomChecker from './components/SymptomChecker';
import PrescriptionScanner from './components/PrescriptionScanner';
import DoctorRecommendation from './components/DoctorRecommendation';
import RiskPrediction from './components/RiskPrediction';
import EmergencyAssistant from './components/EmergencyAssistant';
import Booking from './components/Booking';
<<<<<<< Updated upstream
import MedicineReminders from './components/MedicineReminders';
=======
import Dashboard from './components/dashboard/Dashboard';
>>>>>>> Stashed changes
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ChatbotButton from './components/ChatbotButton';

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="page-enter">
      <Navigation />
      <Hero />
      <Services />
      <SymptomChecker />
      <PrescriptionScanner />
      <DoctorRecommendation />
      <RiskPrediction />
      <EmergencyAssistant />
      <Booking />
<<<<<<< Updated upstream
      <MedicineReminders />
=======
      <Dashboard />
>>>>>>> Stashed changes
      <Footer />
      <ChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}

export default App;
