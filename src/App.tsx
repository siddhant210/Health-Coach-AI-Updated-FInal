import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/profile/Profile";
import ProfileSetup from "./pages/profile/ProfileSetup";
import Dashboard from "./pages/dashboard/Dashboard";
import MonitoringDashboard from "./pages/dashboard/MonitoringDashboard";
import ActivitySummaryPage from "./pages/health-data/ActivitySummaryPage";
import BloodOxygenPage from "./pages/health-data/BloodOxygenPage";
import BodyTemperaturePage from "./pages/health-data/BodyTemperaturePage";
import Exercise from "./pages/health-data/Exercise";
import HeartRatePage from "./pages/health-data/HeartRatePage";
import SleepPage from "./pages/health-data/SleepPage";
import WeightPage from "./pages/health-data/WeightPage";
import DietRecommendations from "./pages/Other/DietRecommendations";
import Documents from "./pages/Other/Documents";
import Medication from './pages/Other/Medication';
import HeartRateMonitor from './pages/Other/HearRateMonitor';
import AIBotsPage from './pages/ai/AIBotsPage'; 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>

          <main className="pt-16">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exercise" element={<Exercise />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/diet" element={<DietRecommendations />} />
                <Route path="/monitoring" element={<MonitoringDashboard />} />
                <Route path="/monitoring/heart-rate" element={<HeartRatePage />} />
                <Route path="/monitoring/sleep" element={<SleepPage />} />
                <Route path="/monitoring/blood-oxygen" element={<BloodOxygenPage />} />
                <Route path="/monitoring/temperature" element={<BodyTemperaturePage />} />
                <Route path="/monitoring/weight" element={<WeightPage />} />
                <Route path="/monitoring/exercise" element={<Exercise />} />
                <Route path="/medication" element={<Medication />} />
                <Route path="/activity-summary" element={<ActivitySummaryPage />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/heart-rate-monitor" element={<HeartRateMonitor />} />
                <Route path="/ai" element={<AIBotsPage />} />
              </Routes>
            </AnimatePresence>
          </main>

          <Toaster position="bottom-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;