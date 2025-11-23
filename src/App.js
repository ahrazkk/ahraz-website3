import React, { useState, useEffect, Suspense } from 'react';
import Portfolio from './components/Portfolio';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// Lazy load the 3D Terminal component
const Spline3D = React.lazy(() => import('./components/Spline3D'));

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
      {currentView === 'spline3d' && (
        <Suspense fallback={<div className="terminal-loading">Initializing Quantum Terminal</div>}>
          <Spline3D />
        </Suspense>
      )}
      
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;