import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    
    // Simulate backend connection with realistic delay
    toast.loading("Connecting to backend...", { id: "backend" });
    
    setTimeout(() => {
      toast.dismiss("backend");
      toast.success(`Logged in as ${email}`, { duration: 3000 });
      
      // Store email in localStorage for dashboard display
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", "Siddhant Jadhav");
      
      setTimeout(() => {
        navigate("/dashboard");
        setIsLoading(false);
      }, 500);
    }, 2000); // 2 second backend delay
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    toast.loading("Connecting to Google & backend...", { id: "google" });
    
    setTimeout(() => {
      toast.dismiss("google");
      toast.success("Signed in with Google!", { duration: 3000 });
      localStorage.setItem("userEmail", "sidworks21@gmail.com");
      localStorage.setItem("userName", "Siddhant Jadhav");
      
      setTimeout(() => {
        navigate("/dashboard");
        setIsLoading(false);
      }, 500);
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary-from to-primary-to bg-clip-text text-transparent mb-6">
                Login
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                Welcome back! Please log in to your account.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-slate-950/50 border border-gray-200/40 dark:border-slate-700/50"
          >
            {/* Demo credentials hint */}
            <div className="mb-6 p-4 bg-blue-50/70 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Demo Credentials:</strong><br/>
                Email: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">sidworks21@gmail.com</code><br/>
                Password: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">123456</code><br/>
                (Or use any email/password — no validation)
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-slate-300 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="flex border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden focus-within:border-primary-from focus-within:ring-1 focus-within:ring-primary-from/50 dark:focus-within:ring-blue-400/30 transition-all">
                  <Mail className="w-6 h-6 p-2 text-gray-500 dark:text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow p-2 focus:outline-none bg-transparent dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-slate-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="flex border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden focus-within:border-primary-from focus-within:ring-1 focus-within:ring-primary-from/50 dark:focus-within:ring-blue-400/30 transition-all">
                  <Lock className="w-6 h-6 p-2 text-gray-500 dark:text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-grow p-2 focus:outline-none bg-transparent dark:text-slate-100"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-from to-primary-to text-white rounded-lg font-medium transition-colors hover:opacity-90"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-slate-300">
                Don't have an account?{" "}
                <span className="text-primary-from cursor-pointer hover:underline font-medium" onClick={() => navigate("/signup")}>
                  Sign Up
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
