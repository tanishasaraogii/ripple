import React, { useState, useEffect } from 'react';
import ScreenLanding from './components/ScreenLanding';
import ScreenDashboard from './components/ScreenDashboard';
import ScreenSummary from './components/ScreenSummary';

export type ScreenType = 'landing' | 'dashboard' | 'summary';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');

  return (
    <div className="w-full h-full text-white flex flex-col relative bg-[#0a0a0a]">
      {currentScreen === 'landing' && <ScreenLanding onNext={() => setCurrentScreen('dashboard')} />}
      {currentScreen === 'dashboard' && <ScreenDashboard onNext={() => setCurrentScreen('summary')} />}
      {currentScreen === 'summary' && <ScreenSummary onRestart={() => setCurrentScreen('landing')} />}
    </div>
  );
}

export default App;
