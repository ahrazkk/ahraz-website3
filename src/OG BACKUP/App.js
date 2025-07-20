import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Spline3D from './components/Spline3D';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('portfolio');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        setCurrentView('portfolio');
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="App">
      {/* View Switcher - Only for Desktop */}
      {!isMobile && (
        <div className="view-switcher">
          <button 
            className={currentView === 'portfolio' ? 'active' : ''}
            onClick={() => setCurrentView('portfolio')}
          >
            📱 Portfolio
          </button>
          <button 
            className={currentView === 'spline3d' ? 'active' : ''}
            onClick={() => setCurrentView('spline3d')}
          >
            🖥️ 3D Terminal
          </button>
        </div>
      )}

      {/* Render Current View */}
      {currentView === 'portfolio' && <Portfolio />}
      {currentView === 'spline3d' && <Spline3D />}
    </div>
  );
}

export default App;