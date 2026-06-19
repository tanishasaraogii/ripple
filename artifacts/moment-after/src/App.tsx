import React, { useState } from 'react';
import ScreenLanding from './components/ScreenLanding';
import ScreenDashboard from './components/ScreenDashboard';
import ScreenSummary from './components/ScreenSummary';

export type ScreenType = 'landing' | 'dashboard' | 'summary';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');

  return (
    <div className="w-full h-full text-[#2A2A33] flex flex-col relative bg-white">
      {currentScreen === 'landing' && <ScreenLanding onNext={() => setCurrentScreen('dashboard')} />}
      {currentScreen === 'dashboard' && <ScreenDashboard onNext={() => setCurrentScreen('summary')} />}
      {currentScreen === 'summary' && <ScreenSummary onRestart={() => setCurrentScreen('landing')} />}
    </div>
  );
}

export default App;