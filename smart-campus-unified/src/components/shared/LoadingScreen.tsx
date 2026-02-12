const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        {/* Pulsing Glow Effect */}
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        
        {/* Logo Animation */}
        <img 
          src="/assets/ait-logo.png" 
          alt="AIT Logo" 
          className="w-32 h-32 object-contain mb-8 animate-bounce-slow relative z-10"
        />
        
        {/* Loading Text */}
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-wider animate-pulse">
            ARMY INSTITUTE OF TECHNOLOGY
          </h2>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
