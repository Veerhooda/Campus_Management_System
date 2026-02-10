import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CAMPUS_IMAGES = [
  { src: '/assets/ait-campus-aerial.jpg', caption: 'AIT Campus — Dighi Hills, Pune' },
  { src: '/assets/ait-main-gate.jpg', caption: 'Army Institute of Technology — Main Gate' },
  { src: '/assets/ait-campus-2.jpg', caption: 'IEI Industry Excellence Award 2025' },
];

// CSS filter to subtly enhance low-res images
const imageEnhanceStyle: React.CSSProperties = {
  filter: 'contrast(1.05) saturate(1.08) brightness(1.02)',
  imageRendering: 'auto' as const,
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % CAMPUS_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Left Panel — Campus Image Slideshow */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-7/12 xl:w-3/5 flex-col justify-between overflow-hidden">
        {/* Slideshow Images */}
        {CAMPUS_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentSlide === idx ? 1 : 0, zIndex: currentSlide === idx ? 1 : 0 }}
          >
            <img
              alt={img.caption}
              className="w-full h-full object-cover"
              src={img.src}
              style={imageEnhanceStyle}
            />
          </div>
        ))}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-slate-900/30 to-transparent" />

        {/* Content on top of slideshow */}
        <div className="relative z-10 p-10 lg:p-12 flex flex-col h-full justify-between">
          {/* Top — Logo & Title */}
          <div className="flex items-center gap-3">
            <img src="/assets/ait-logo.png" alt="AIT Logo" className="w-12 h-12 rounded-lg bg-white p-1 shadow-lg backdrop-blur-sm" />
            <div>
              <span className="text-white text-lg font-bold tracking-wide block leading-tight">Army Institute of Technology</span>
              <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Pune • Est. 1994</span>
            </div>
          </div>

          {/* Bottom — Headline + Slide Controls */}
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-medium">Smart Campus Portal • Live</span>
            </div>
            <h1 className="text-white text-4xl lg:text-5xl font-black leading-[1.1] mb-4 tracking-tight">
              AIT Smart<br />
              Campus Portal
            </h1>
            <p className="text-white/80 text-base lg:text-lg font-medium leading-relaxed max-w-md">
              Empowering the future of education with seamless digital integration for students, faculty, and administration.
            </p>

            {/* Slide caption */}
            <p className="text-white/50 text-sm font-medium mt-6 mb-4 transition-opacity duration-500">
              {CAMPUS_IMAGES[currentSlide].caption}
            </p>

            {/* Slide indicators */}
            <div className="flex gap-2 items-center">
              {CAMPUS_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-500 rounded-full ${
                    currentSlide === idx
                      ? 'h-2 w-8 bg-white'
                      : 'h-2 w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
              <span className="ml-3 text-white/40 text-xs font-medium">{currentSlide + 1}/{CAMPUS_IMAGES.length}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-white/40 text-xs font-medium flex justify-between items-end">
            <p>© 2026 AIT Pune. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-white/70 transition-colors" href="#">Privacy</a>
              <a className="hover:text-white/70 transition-colors" href="#">Terms</a>
              <a className="hover:text-white/70 transition-colors" href="#">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-white dark:bg-background-dark relative w-full md:w-1/2 lg:w-5/12 xl:w-2/5 animate-fade-in">
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 md:hidden flex items-center gap-2">
          <img src="/assets/ait-logo.png" alt="AIT Logo" className="w-8 h-8 rounded-lg bg-white dark:bg-white p-0.5" />
          <span className="text-primary font-bold text-lg">AIT Smart Campus</span>
        </div>

        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Heading with logo */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-3">
              <img src="/assets/ait-logo.png" alt="AIT Logo" className="w-11 h-11 rounded-xl shadow-sm hidden md:block bg-white dark:bg-slate-100 p-0.5" />
              <div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to AIT Smart Campus Portal</p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">Email</span>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                </div>
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 pl-10 pr-4 h-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder="e.g. admin@ait.edu" 
                  type="email"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">Password</span>
                <a className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                </div>
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 pl-10 pr-12 h-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder="Enter your password" 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            <button 
              disabled={isLoading}
              className="mt-2 w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-md shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
              type="submit"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-400 text-center">Quick login for demo:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin', email: 'admin@ait.edu', color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
                { label: 'Faculty', email: 'faculty@ait.edu', color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
                { label: 'Student', email: 'student@ait.edu', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
                { label: 'Organizer', email: 'organizer@ait.edu', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
              ].map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => handleQuickLogin(demo.email)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${demo.color} hover:opacity-80 transition-opacity`}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-auto pt-6 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 italic">"Onward to Glory"</p>
            <div className="flex gap-6">
              <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Help Center</a>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">System Status</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
