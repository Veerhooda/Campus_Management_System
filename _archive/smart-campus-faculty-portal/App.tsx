
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { NavItem, User } from './types';

const MOCK_USER: User = {
  name: "Mr. Anderson",
  role: "Head of Science",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQKUDC0oECIRzj279h6VtCG4p4Rt280Lh5hZy1wPcBeOUwhO0BQrIMMReUtuDRiAqUegdHPqwQc387V747hpsh48ia-Ak6_yBcT3ZT5QQ5MhNtqjZNAoytQ6lVUlHrg0xmbv0PLKTbLD6pe4PDG7zdPphNb-apjp-9UcklCkPAPECeAC0PycySQVgqhc3Nh3W7_O9xMLflDteITRWcUgTT-qMU70zDfNkm2IcT5AS2TOnmheqBLQkQBoqH3X8aht7_hU_3_fIugfly"
};

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>(NavItem.Dashboard);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <Sidebar 
        activeNav={activeNav} 
        onNavChange={setActiveNav} 
        user={MOCK_USER} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {activeNav === NavItem.Dashboard ? (
              <Dashboard user={MOCK_USER} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4">construction</span>
                <h2 className="text-2xl font-bold">{activeNav} is under construction</h2>
                <p>Check back later for updates!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
