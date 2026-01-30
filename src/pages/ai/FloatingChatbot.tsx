import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Mic, Volume2 } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get configuration from environment variables
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = 'YOUR_API_KEY';
  const FULL_API_URL = `${API_URL}?key=${API_KEY}`;

  const toggleChat = () => setIsOpen(!isOpen);

  // Prebuilt quick questions and canned answers to improve UX and enable offline demos
  const prebuiltQA: { question: string; answer: string }[] = [
    {
      question: 'How often should I check my blood sugar?',
      answer:
        'If you have diabetes, check fasting blood sugar in the morning and before meals. Your care team may recommend additional checks after meals or at bedtime. Aim to follow your personalized plan.'
    },
    {
      question: 'What does a normal resting heart rate look like?',
      answer:
        'A typical resting heart rate for adults ranges from 60 to 100 bpm. Athletes may have lower resting rates. If you consistently see values outside this range, consult a clinician.'
    },
    {
      question: 'How many hours of sleep do I need?',
      answer:
        'Most adults need 7–9 hours of sleep per night. Consistent sleep schedule, reduced screen time before bed, and a relaxing routine can improve sleep quality.'
    },
    {
      question: 'How much water should I drink daily?',
      answer:
        'A common guideline is about 2–3 liters (8–12 cups) per day depending on activity, climate, and body size. Listen to thirst and consult your provider for personalized guidance.'
    },
    {
      question: 'What are common side effects of this prescription?',
      answer:
        'Common side effects vary by medication. Look for nausea, dizziness, headache, or GI upset. If you experience severe allergic reactions or unexpected symptoms, seek immediate care.'
    },
    {
      question: 'How can I lower my blood pressure naturally?',
      answer:
        'Lifestyle measures: reduce sodium, increase potassium-rich foods, exercise regularly, maintain healthy weight, limit alcohol, manage stress, and follow your provider’s advice.'
    },
    {
      question: 'What is a healthy weekly exercise goal?',
      answer:
        'Aim for 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week, plus strength training 2 days a week, as recommended by WHO.'
    },
    {
      question: 'How do I store my medication safely?',
      answer:
        'Store in original packaging in a cool, dry place unless refrigerated. Keep out of reach of children and follow any special storage instructions from the pharmacist.'
    },
  ];

  // Build a quick lookup to serve canned answers instantly
  const prebuiltLookup = prebuiltQA.reduce<Record<string, string>>((acc, item) => {
    acc[item.question] = item.answer;
    return acc;
  }, {});

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    const newMessages = [
      ...messages,
      { sender: 'user', text: inputText },
    ];
    setMessages(newMessages);
    setInputText('');

    try {
      if (!API_KEY) throw new Error('Gemini API key is not configured');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: inputText }],
            role: "user"
          }],
          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
          ]
        }),
      });
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I couldn't generate a response. Please try again.";
      
      const updatedMessages = [...newMessages, { sender: 'bot', text: botResponse }];
      setMessages(updatedMessages);
      speakText(botResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { 
        sender: 'bot', 
        text: error instanceof Error ? error.message : 'Sorry, there was an error processing your message.' 
      }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // When a quick question is chosen, insert the question and respond with a canned answer when available
  const handleQuickQuestion = (q: string) => {
    const userMsg = { sender: 'user', text: q };
    if (prebuiltLookup[q]) {
      const botMsg = { sender: 'bot', text: prebuiltLookup[q] };
      setMessages((prev) => [...prev, userMsg, botMsg]);
      speakText(prebuiltLookup[q]);
      setTimeout(scrollToBottom, 100);
      return;
    }

    // Fallback: populate input and let user send to AI
    setInputText(q);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis?.cancel();
      }
    };
  }, [isOpen, messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white flex justify-between items-center">
              <h3 className="font-medium">Health Assistant</h3>
              <button 
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-64 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                  <MessageSquare className="w-8 h-8 mb-2" />
                  <p className="mb-3">Ask me anything about your health or medications</p>
                  <div className="flex flex-col gap-2 w-full">
                    {prebuiltQA.slice(0, 6).map((p) => (
                      <button
                        key={p.question}
                        onClick={() => handleQuickQuestion(p.question)}
                        className="text-sm text-left px-3 py-2 rounded-md bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/70 border border-gray-200/30 dark:border-gray-700/30"
                      >
                        {p.question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-2 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}
                  >
                    <div className={`inline-block p-2 px-3 rounded-lg max-w-[90%] ${
                      message.sender === 'bot' 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {message.text}
                      {message.sender === 'bot' && (
                        <button 
                          onClick={() => speakText(message.text)}
                          className="ml-2 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          disabled={isSpeaking}
                          aria-label="Speak response"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="text-left">
                  <div className="inline-block p-2 px-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <Loader2 className="animate-spin w-4 h-4" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {/* Suggested questions while chatting */}
              {messages.length > 0 && (
                <div className="px-3 pb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try a quick question:</div>
                  <div className="flex gap-2 overflow-x-auto">
                    {prebuiltQA.map((p) => (
                      <button
                        key={p.question}
                        onClick={() => handleQuickQuestion(p.question)}
                        type="button"
                        className="whitespace-nowrap text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:opacity-90"
                      >
                        {p.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type your message..."
                  disabled={loading}
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-700"
                  disabled={loading || !inputText.trim()}
                  aria-label="Send message"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    aria-label="Stop speaking"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
