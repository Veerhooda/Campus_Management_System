import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation is handled by App.tsx based on role
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Left Branding Panel */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-7/12 xl:w-3/5 bg-primary/10 flex-col justify-between overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            alt="Modern university campus building" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80" 
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content on top of image */}
        <div className="relative z-10 p-12 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>school</span>
            </div>
            <span className="text-white text-lg font-bold tracking-wide uppercase opacity-90">AIT Portal</span>
          </div>

          <div className="max-w-[540px] mb-12">
            <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight">AIT Smart Campus</h1>
            <p className="text-white/90 text-xl font-medium leading-relaxed">
              Empowering the future of education with seamless digital integration for students, faculty, and administration.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="h-1.5 w-12 bg-white rounded-full" />
              <div className="h-1.5 w-3 bg-white/40 rounded-full" />
              <div className="h-1.5 w-3 bg-white/40 rounded-full" />
            </div>
          </div>

          <div className="text-white/60 text-sm font-medium flex justify-between items-end">
            <p>© 2024 AIT Education Group. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-white transition-colors" href="#">Privacy</a>
              <a className="hover:text-white transition-colors" href="#">Terms</a>
              <a className="hover:text-white transition-colors" href="#">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-white dark:bg-background-dark relative w-full md:w-1/2 lg:w-5/12 xl:w-2/5 animate-fade-in">
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 md:hidden flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>school</span>
          <span className="text-primary font-bold text-lg">AIT Smart Campus</span>
        </div>

        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined">lock_person</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Enter your credentials to access the portal.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold">Email or Roll Number</span>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>badge</span>
                </div>
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder:text-slate-400 pl-10 pr-4 h-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder="e.g. student@ait.edu or 210456" 
                  type="text"
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
              className="mt-2 w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-md shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70" 
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

          {/* Role Detection Hint */}
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: '18px' }}>info</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              System automatically detects <strong className="text-primary font-medium">Student</strong>, <strong className="text-primary font-medium">Faculty</strong>, or <strong className="text-primary font-medium">Admin</strong> access based on your credentials. 
              <br/><span className="text-slate-400 text-[11px]">(Hint: Use "admin" or "faculty" in email for different roles)</span>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-auto pt-6 flex justify-center gap-6">
            <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Help Center</a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">System Status</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
