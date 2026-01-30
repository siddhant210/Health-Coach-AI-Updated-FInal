import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Dumbbell, Heart, MessageSquare, Settings,
  Bell, ChevronRight, Calendar, CheckCircle, 
  AlertCircle, Clock, ChevronDown, ChevronUp, Plus, Loader2,
  Flame, Move, Watch, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingChatbot from '../ai/FloatingChatbot';

const healthData = {
  nutrition: [
    { name: 'Carbs', value: 45 },
    { name: 'Protein', value: 30 },
    { name: 'Fats', value: 25 },
  ],
  // Expanded activity over two weeks for richer visualization
  activity: [
    { day: 'Mon', steps: 8500 },
    { day: 'Tue', steps: 10200 },
    { day: 'Wed', steps: 7800 },
    { day: 'Thu', steps: 9200 },
    { day: 'Fri', steps: 11000 },
    { day: 'Sat', steps: 6500 },
    { day: 'Sun', steps: 8432 },
    { day: 'Mon 2', steps: 9200 },
    { day: 'Tue 2', steps: 10800 },
    { day: 'Wed 2', steps: 7600 },
    { day: 'Thu 2', steps: 9800 },
    { day: 'Fri 2', steps: 12500 },
    { day: 'Sat 2', steps: 7200 },
    { day: 'Sun 2', steps: 10320 },
  ],
  // More granular vitals across a typical day to show trends
  vitals: [
    { time: '06:00', heart: 66, oxygen: 98, temp: 36.4 },
    { time: '07:00', heart: 70, oxygen: 98, temp: 36.5 },
    { time: '08:00', heart: 72, oxygen: 98, temp: 36.5 },
    { time: '09:00', heart: 74, oxygen: 97, temp: 36.6 },
    { time: '10:00', heart: 76, oxygen: 97, temp: 36.6 },
    { time: '11:00', heart: 79, oxygen: 98, temp: 36.6 },
    { time: '12:00', heart: 78, oxygen: 97, temp: 36.6 },
    { time: '13:00', heart: 82, oxygen: 97, temp: 36.7 },
    { time: '14:00', heart: 85, oxygen: 98, temp: 36.7 },
    { time: '15:00', heart: 80, oxygen: 98, temp: 36.6 },
    { time: '16:00', heart: 78, oxygen: 98, temp: 36.6 },
    { time: '17:00', heart: 75, oxygen: 98, temp: 36.6 },
    { time: '18:00', heart: 73, oxygen: 99, temp: 36.6 },
    { time: '19:00', heart: 70, oxygen: 99, temp: 36.6 },
    { time: '20:00', heart: 74, oxygen: 99, temp: 36.7 },
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#22D3EE'];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);
  const [medications, setMedications] = useState([
    { name: 'Metformin', time: '8:00 AM', taken: true },
    { name: 'Lisinopril', time: '12:00 PM', taken: true },
    { name: 'Atorvastatin', time: '8:00 PM', taken: false },
    { name: 'Aspirin', time: '9:00 AM', taken: true },
  ]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Health summary data with realistic values
  const healthSummary = {
    calories: 1850,
    caloriesGoal: 2200,
    exercise: 45, // minutes
    exerciseGoal: 60,
    standHours: 10,
    standHoursGoal: 12,
    heartRate: 72,
    bloodOxygen: 98,
    sleepHours: 7.5,
    steps: 8432,
    stepsGoal: 10000,
    waterIntake: 2.1, // liters
    waterGoal: 2.5
  };

  // Fetch user profile data
  useEffect(() => {
    // Mock user profile
    setUserProfile({
      name: 'Siddhant Jadhav',
      email: 'sidworks21@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SiddhantJadhav',
      age: 42,
      condition: 'Type 2 Diabetes'
    });
    setLoading(false);
  }, []);

  const alerts = [
    { type: 'warning', message: 'Blood oxygen level is below normal', time: '2 hours ago' },
    { type: 'reminder', message: 'Take your medication now', time: '5 minutes ago' },
    { type: 'success', message: 'You have reached your step goal!', time: 'Just now' },
  ];

  const tasks = [
    { task: 'Take morning medication', completed: true },
    { task: 'Walk for 30 minutes', completed: false },
    { task: 'Check blood oxygen levels', completed: true },
    { task: 'Log lunch meal', completed: false },
  ];

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleMedication = (index) => {
    const updatedMeds = [...medications];
    updatedMeds[index].taken = !updatedMeds[index].taken;
    setMedications(updatedMeds);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="m-auto">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar Component */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        userProfile={userProfile}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl p-4 sm:p-6 border-b border-gray-200/20 dark:border-slate-700/20 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome, {userProfile?.name || 'User'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                {format(new Date(), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Health Monitoring Quick Actions */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-blue-900/20"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-blue-500" />
                    Health Monitoring
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <Link 
                    to="/blood-oxygen" 
                    className="flex flex-col items-center justify-center h-20 sm:h-24 rounded-xl border border-blue-400/50 text-blue-600 dark:text-blue-300 bg-gradient-to-br from-white to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 dark:from-slate-700/40 dark:to-slate-700/20 dark:hover:from-slate-700/60 dark:hover:to-slate-600/40 transition-all duration-300 p-2 sm:p-4 shadow-md dark:shadow-lg dark:shadow-slate-950/30"
                  >
                    <Heart className="w-5 sm:w-6 h-5 sm:h-6 mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-lg font-medium text-center">Blood Oxygen</p>
                  </Link>
                  <Link 
                    to="/heart-rate-monitor" 
                    className="flex flex-col items-center justify-center h-20 sm:h-24 rounded-xl border border-blue-400/50 text-blue-600 dark:text-blue-300 bg-gradient-to-br from-white to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 dark:from-slate-700/40 dark:to-slate-700/20 dark:hover:from-slate-700/60 dark:hover:to-slate-600/40 transition-all duration-300 p-2 sm:p-4 shadow-md dark:shadow-lg dark:shadow-slate-950/30"
                  >
                    <Activity className="w-5 sm:w-6 h-5 sm:h-6 mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-lg font-medium text-center">Heart Rate</p>
                  </Link>
                </div>
              </motion.div>

              {/* Health Summary Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-blue-900/20"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Health Summary
                  </h2>
                  <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 flex items-center">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 mb-2 sm:mb-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                      <Flame className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300">
                      Calories
                    </p>
                    <p className="text-base sm:text-lg font-bold">{healthSummary.calories}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">kcal</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 mb-2 sm:mb-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
                      <Move className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300">
                      Exercise
                    </p>
                    <p className="text-base sm:text-lg font-bold">{healthSummary.exercise}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      min
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 mb-2 sm:mb-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                      <Watch className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300">
                      Stand Hours
                    </p>
                    <p className="text-base sm:text-lg font-bold">{healthSummary.standHours}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      hrs
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Activity Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-teal-900/20"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-teal-500" />
                  Weekly Activity
                </h2>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthData.activity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: '#64748b' }}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#64748b' }}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                        formatter={(value) => [`${value}`, 'Steps']}
                      />
                      <Bar
                        dataKey="steps"
                        fill="#22D3EE"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Medication Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-blue-900/20"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-blue-500" />
                    Medications
                  </h2>
                  <button className="text-blue-600 dark:text-blue-400 flex items-center text-xs sm:text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {medications.map((med, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50/60 to-cyan-50/40 dark:from-slate-700/40 dark:to-slate-700/20 rounded-xl transition-all duration-200 border border-blue-100/40 dark:border-slate-600/30 shadow-sm hover:shadow-md dark:hover:shadow-slate-950/30"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <Pill className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 ${med.taken ? 'text-green-500' : 'text-blue-500'}`} />
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base">{med.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {med.time}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMedication(index)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                          med.taken
                            ? 'bg-green-100 dark:bg-green-900/50'
                            : 'bg-blue-100 dark:bg-blue-900/50'
                        }`}
                      >
                        <CheckCircle
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            med.taken
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-blue-500 dark:text-blue-400'
                          }`}
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Alerts Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-amber-900/20"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Alerts
                </h2>
                <div className="space-y-2 sm:space-y-4">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className={`flex items-start p-3 sm:p-4 rounded-xl border-l-4 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md dark:hover:shadow-slate-950/30 ${
                        alert.type === 'warning'
                          ? 'border-yellow-500 bg-yellow-50/60 dark:bg-yellow-900/20'
                          : alert.type === 'success'
                          ? 'border-green-500 bg-green-50/60 dark:bg-green-900/20'
                          : 'border-blue-500 bg-blue-50/60 dark:bg-blue-900/20'
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 ${
                          alert.type === 'warning'
                            ? 'text-yellow-500'
                            : alert.type === 'success'
                            ? 'text-green-500'
                            : 'text-blue-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">{alert.message}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{alert.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tasks Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-teal-900/20"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  Tasks
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-teal-50/60 to-cyan-50/40 dark:from-slate-700/40 dark:to-slate-700/20 rounded-lg transition-all duration-200 border border-teal-100/40 dark:border-slate-600/30 shadow-sm hover:shadow-md dark:hover:shadow-slate-950/30"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex-shrink-0 ${
                            task.completed
                              ? 'border-green-500 bg-green-500'
                              : 'border-blue-300 dark:border-gray-500'
                          } focus:ring-0 focus:ring-offset-0`}
                        />
                        <span
                          className={`ml-2 sm:ml-3 text-sm sm:text-base truncate ${
                            task.completed ? 'line-through text-gray-500 dark:text-slate-400' : ''
                          }`}
                        >
                          {task.task}
                        </span>
                      </div>
                      {task.completed && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
}