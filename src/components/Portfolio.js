import React, { useState, useEffect, useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import './Portfolio.css';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          let startTime;
          
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            setCount(Math.floor(progress * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return <span ref={counterRef}>{count}{suffix}</span>;
};

// Particle System Component
const ParticleSystem = () => {
  const canvasRef = useRef();
  const particles = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '139, 92, 246' : '59, 130, 246'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        ctx.fill();
        
        // Connect nearby particles
        particles.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(${particle.color}, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};



// Interactive Background Component
const InteractiveBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="interactive-background"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
          rgba(139, 92, 246, 0.15) 0%, 
          rgba(59, 130, 246, 0.1) 30%, 
          transparent 70%)`
      }}
    />
  );
};

// Experience Timeline Component
const ExperienceTimeline = ({ experiences }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="timeline-container">
      <div className="timeline-line">
        <div className="timeline-progress" style={{ height: `${(activeIndex + 1) * 33.33}%` }}></div>
      </div>
      {experiences.map((exp, index) => (
        <div 
          key={index}
          className={`timeline-item ${index <= activeIndex ? 'active' : ''}`}
          onMouseEnter={() => setActiveIndex(index)}
        >
          <div className="timeline-dot">
            <div className="timeline-ring"></div>
          </div>
          <div className="timeline-content">
            <div className="timeline-date">{exp.period}</div>
            <h4>{exp.title}</h4>
            <p>{exp.company}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced Quantum Terminal Component
const QuantumTerminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [matrixEffect, setMatrixEffect] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/home/ahraz');
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const fileSystem = {
    '/home/ahraz': {
      'projects.txt': 'List of all my amazing projects...',
      'resume.pdf': 'My professional resume (PDF format)',
      'portfolio': {},
      'secret': {
        'matrix.exe': 'Execute the matrix...',
        'hack.sh': 'Initiate hacking sequence...',
        'quantum.dat': 'Quantum state data...'
      }
    },
    '/home/ahraz/portfolio': {
      'index.html': 'Portfolio website source',
      'styles.css': 'Beautiful glassmorphism styles',
      'app.js': 'React application logic'
    }
  };

  const commands = {
    help: {
      description: 'Display available commands',
      execute: () => `
QUANTUM TERMINAL v3.0 - Available Commands:
╭─────────────────────────────────────────────────────────────╮
│ NAVIGATION & SYSTEM                                         │
├─────────────────────────────────────────────────────────────┤
│ help           - Show this help menu                        │
│ clear          - Clear terminal screen                      │
│ pwd            - Show current directory                     │
│ ls [dir]       - List directory contents                    │
│ cd <dir>       - Change directory                           │
│ cat <file>     - Display file contents                      │
│ whoami         - Display current user info                  │
│ date           - Show current date and time                 │
│ uptime         - Show system uptime                         │
├─────────────────────────────────────────────────────────────┤
│ PORTFOLIO COMMANDS                                          │
├─────────────────────────────────────────────────────────────┤
│ about          - About Ahraz Kibria                         │
│ experience     - Show work experience                       │
│ projects       - List featured projects                     │
│ skills         - Display technical skills                   │
│ education      - Show educational background                │
│ contact        - Show contact information                   │
│ achievements   - List awards and achievements               │
├─────────────────────────────────────────────────────────────┤
│ FUN COMMANDS                                                │
├─────────────────────────────────────────────────────────────┤
│ matrix         - Enter the Matrix                           │
│ hack           - Initiate hacking sequence                  │
│ fortune        - Get a random quote                         │
│ weather        - Check current weather                      │
│ music          - Play terminal music                        │
│ snake          - Play retro snake game                      │
│ calc <expr>    - Calculator (e.g., calc 2+2)               │
│ cowsay <text>  - Make a cow say something                   │
│ history        - Show command history                       │
│ exit           - Return to normal portfolio mode            │
╰─────────────────────────────────────────────────────────────╯

💡 Tip: Use ↑↓ arrows to navigate command history
      Use Tab for command auto-completion
      `
    },

    clear: {
      description: 'Clear the terminal',
      execute: () => 'CLEAR_SCREEN'
    },

    about: {
      description: 'About Ahraz Kibria',
      execute: () => `
╭─────────────────────────────────────────╮
│           ABOUT AHRAZ KIBRIA            │
├─────────────────────────────────────────┤
│ Computer Engineering Student @ TMU      │
│ Software Integration Engineer @ Geotab  │
│ Specialization: Software Engineering    │
│ Minor: Mathematics & Computer Science   │
├─────────────────────────────────────────┤
│ Current Focus:                          │
│ • AI & Machine Learning                 │
│ • Cloud Computing (GCP/AWS)            │
│ • Enterprise Software Development      │
│ • Assistive Technology Innovation      │
├─────────────────────────────────────────┤
│ Interests: Ping Pong, Tennis,          │
│ Astronomy, Engineering Competitions    │
╰─────────────────────────────────────────╯`
    },

    projects: {
      description: 'List featured projects',
      execute: () => `
FEATURED PROJECTS:
══════════════════════════════════════════════════════════════

👓 4Sight - AI Smart Assistive Glasses
   • YOLOv8 neural network implementation
   • 99% detection accuracy achieved
   • OpenAI GPT API integration
   • 3D audio processing system
   📦 GitHub: ahrazkk/4Sight--AI-Powered-Vision-Assistance

💪 BIOsync - Muscle Fatigue Prediction
   • MLP neural networks for EMG processing
   • Real-time muscle fatigue analysis
   • OpenAI GPT coaching integration
   • Digital signal processing algorithms
   📦 GitHub: ahrazkk/BIOsync--Advanced-Fitness-AI

🎬 StreamFlix - Full-Stack Streaming Platform
   • Microservices architecture (Spring Boot)
   • Docker & Kubernetes orchestration
   • Google Cloud Platform deployment
   • OAuth2 security implementation
   📦 GitHub: ahrazkk/StreamFlix--FullStack-Movie-Website

🏥 SQL Patient Database Management System
   • Oracle APEX & JavaFX integration
   • BCNF compliance & normalization
   • Comprehensive patient data management
   📦 GitHub: ahrazkk/Patient-DBMS-Website

🌐 Quantum Portfolio Website
   • React with Spline 3D integration
   • Glassmorphism design system
   • Interactive terminal easter egg
   📦 GitHub: ahrazkk/blast-off-portfolio-site`
    },

    matrix: {
      description: 'Enter the Matrix',
      execute: () => {
        setMatrixEffect(true);
        setTimeout(() => setMatrixEffect(false), 5000);
        return `
████████████████████████████████████████████████████████████████
█ INITIATING MATRIX PROTOCOL...                               █
█ Scanning neural pathways...                    [████████] █
█ Quantum entanglement established...            [████████] █
█ Reality.exe has stopped working...             [████████] █
█ Welcome to the MATRIX, Neo... I mean, User.               █
████████████████████████████████████████████████████████████████

🔴 Red pill: Stay in wonderland
🔵 Blue pill: Return to normal mode

Choose wisely...`;
      }
    },

    cowsay: {
      description: 'Make a cow say something',
      execute: (args) => {
        const message = args.join(' ') || 'Moo! Hello from Quantum Terminal!';
        const messageLength = message.length;
        const topBorder = ' ' + '_'.repeat(messageLength + 2);
        const bottomBorder = ' ' + '-'.repeat(messageLength + 2);
        
        return `${topBorder}
< ${message} >
${bottomBorder}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
      }
    },

    exit: {
      description: 'Return to normal portfolio mode',
      execute: () => {
        return 'Exiting Quantum Terminal... Returning to normal portfolio mode...';
      }
    }
  };

  // Welcome message with ASCII art
  useEffect(() => {
    const welcomeMessage = {
      type: 'welcome',
      text: `⚛️ QUANTUM TERMINAL MODE ACTIVATED ⚛️

 ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗
██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║
██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║
██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║
╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝

════════════════════════════════════════════════════════════════════════════════
QUANTUM TERMINAL v3.0.25 - Ahraz Kibria Portfolio System
Copyright (c) 2025 Quantum Computing Division. All rights reserved.
════════════════════════════════════════════════════════════════════════════════

🚀 System Status: ONLINE | 🔋 Power Level: MAXIMUM | 🔒 Security: QUANTUM ENCRYPTED

Welcome to the enhanced Quantum Terminal Interface!
Type 'help' to see all available commands.
Use ↑↓ arrows for command history, Tab for auto-completion.

Press Konami Code again to return to normal portfolio mode.
════════════════════════════════════════════════════════════════════════════════`
    };
    setOutput([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    const commandNames = Object.keys(commands);
    const matches = commandNames.filter(cmd => cmd.startsWith(input));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      const newOutput = [...output, 
        { type: 'command', text: `> ${input}` },
        { type: 'output', text: matches.join('  ') }
      ];
      setOutput(newOutput);
    }
  };

  const handleCommand = () => {
    const cmd = input.trim();
    if (!cmd) return;

    const [command, ...args] = cmd.toLowerCase().split(' ');
    const newOutput = [...output];

    newOutput.push({ type: 'command', text: `${currentDirectory}$ ${cmd}` });

    if (command in commands) {
      if (command === 'clear') {
        setOutput([]);
        setInput('');
        return;
      }
      
      const result = commands[command].execute(args);
      if (result === 'CLEAR_SCREEN') {
        setOutput([]);
      } else {
        newOutput.push({ type: 'output', text: result });
      }
    } else {
      newOutput.push({ 
        type: 'error', 
        text: `quantum-terminal: command not found: ${command}
Did you mean one of these?
${Object.keys(commands).filter(c => c.includes(command.charAt(0))).slice(0, 3).join(', ')}

Type 'help' for a complete list of commands.` 
      });
    }

    setOutput(newOutput);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
  };

  return (
    <div className={`quantum-terminal ${matrixEffect ? 'matrix-active' : ''}`}>
      <div ref={outputRef} className="quantum-terminal-output">
        {output.map((item, index) => (
          <div key={index} className={`quantum-output ${item.type}`}>
            <pre>{item.text}</pre>
          </div>
        ))}
      </div>
      
      <div className="quantum-input-line">
        <span className="quantum-prompt">{currentDirectory}$</span>
        <input
          ref={inputRef}
          className="quantum-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
        />
        <span className="quantum-cursor"></span>
      </div>
      
      {matrixEffect && (
        <div className="matrix-overlay">
          <div className="matrix-rain"></div>
        </div>
      )}
    </div>
  );
};

// Quantum Konami Code Easter Egg Hook
const useQuantumKonami = () => {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === konamiCode[konamiIndex]) {
        setKonamiIndex(prev => prev + 1);
        if (konamiIndex === konamiCode.length - 1) {
          setIsQuantumMode(prev => !prev);
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, konamiCode]);

  useEffect(() => {
    if (isQuantumMode) {
      document.body.classList.add('quantum-mode');
    } else {
      document.body.classList.remove('quantum-mode');
    }
  }, [isQuantumMode]);

  return isQuantumMode;
};

// Custom hook for scroll reveal animations
const useScrollReveal = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [ref, isVisible];
};

// Section Transition Hook
const useSectionTransition = () => {
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      const scrollPos = window.scrollY + window.innerHeight / 2;
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          if (currentSection !== section) {
            setCurrentSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  return { currentSection };
};

// Typing animation component
const TypingText = ({ text, speed = 100, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return (
    <span className={`typing-text ${isTyping ? 'typing' : ''}`}>
      {displayText}
      {isTyping && <span className="cursor-blink">|</span>}
    </span>
  );
};

// Enhanced Spline Hero with fallback handling
const SplineHero = ({ onSplineLoad }) => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  const handleSplineLoad = () => {
    setSplineLoaded(true);
    onSplineLoad();
  };

  const handleSplineError = () => {
    setSplineError(true);
    setSplineLoaded(true);
    onSplineLoad();
  };

  return (
    <div className={`spline-container ${splineLoaded ? 'spline-loaded' : ''} ${splineError ? 'spline-fallback' : ''}`}>
      {!splineError && (
        <Spline 
          scene="https://prod.spline.design/X-xfeLCBB2Ae2FrZ/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      )}
      <div className="hero-overlay">
        <h1 className="hero-name">
          <TypingText text="Ahraz Kibria" speed={150} delay={1000} />
        </h1>
        <p className="hero-title">
          <TypingText text="Computer/Software Engineer" speed={80} delay={2500} />
        </p>
      </div>
    </div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className = '', onClick, ...props }) => {
  const buttonRef = useRef();

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    
    if (distance < maxDistance) {
      const factor = (maxDistance - distance) / maxDistance;
      const moveX = x * factor * 0.3;
      const moveY = y * factor * 0.3;
      
      button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    }
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    button.style.transform = 'translate(0px, 0px) scale(1)';
  };

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Scroll reveal wrapper component
const ScrollReveal = ({ children, animation = 'fadeInUp', delay = 0, className = '' }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${animation} ${isVisible ? 'revealed' : ''} ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        '--reveal-delay': `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Parallax wrapper component
const ParallaxElement = ({ children, speed = 0.5, className = '' }) => {
  const elementRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current;
      if (element) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * speed;
        element.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={elementRef} className={`parallax-element ${className}`}>
      {children}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = ({ isDark, setIsDark }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle theme"
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-icon">
            {isDark ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
    </button>
  );
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const { currentSection } = useSectionTransition();
  
  // Quantum easter eggs
  const isQuantumMode = useQuantumKonami();

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Scroll progress tracking and section detection
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);

      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  const experienceData = [
    {
      title: "Software Integration Engineer - Intern",
      company: "Geotab Headquarters",
      period: "Aug. 2024 – May 2025",
      description: "Engineered and optimized Python-based ETL pipelines for critical data integration, reducing processing times by 95% for operations involving 500,000+ active vehicles. Developed enterprise-grade C# WPF applications and implemented advanced system resilience mechanisms across 53 diverse databases.",
      skills: ["Python", "C#", "ETL Pipelines", "Google Cloud Platform", "API Integration", "WPF", "MVVM"]
    },
    {
      title: "Engineering Competitions Competitor",
      company: "Toronto Metropolitan University",
      period: "Dec. 2023 – Jan. 2024",
      description: "Developed and implemented innovative AI Smart Assistive Glasses utilizing YOLOv8, Python, and Arduino, securing 4th place among 14 teams in the Innovative Design Competition. Demonstrated exceptional proficiency in articulating complex technological concepts to judges.",
      skills: ["YOLOv8", "Python", "Arduino", "AI", "Computer Vision", "Project Management"]
    },
    {
      title: "Casual Ping Pong Player",
      company: "Self-Employed",
      period: "Aug. 2021 – EOL",
      description: "Play Ping Pong and Tennis while also doing some astronomy. Developing hand-eye coordination and strategic thinking skills. Currently working on improving serve technique and backhand consistency.",
      skills: ["Hand-eye Coordination", "Strategic Thinking", "Persistence", "Sportsmanship", "Astronomy", "Tennis"]
    }
  ];

  return (
    <div className={`portfolio ${isQuantumMode ? 'quantum-active' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Quantum Terminal Mode */}
      {isQuantumMode && (
        <QuantumTerminal />
      )}
      
      {/* Normal Portfolio Mode */}
      {!isQuantumMode && (
        <>
          {/* Particle System */}
          <ParticleSystem />
          
          {/* Interactive Background */}
          <InteractiveBackground />
          
          {/* Scroll progress indicator */}
          <div 
            className="scroll-progress" 
            style={{ transform: `scaleX(${scrollProgress})` }}
          />

          {/* Navigation */}
          <nav className="navbar glass-card">
            <div className="nav-content">
              <div className="nav-logo">AK</div>
              <div className="nav-center">
                <div className="nav-links">
                  {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
                    <MagneticButton
                      key={item}
                      className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                      onClick={() => scrollToSection(item.toLowerCase())}
                    >
                      {item}
                    </MagneticButton>
                  ))}
                </div>
              </div>
              <ThemeToggle isDark={isDarkMode} setIsDark={setIsDarkMode} />
            </div>
          </nav>

          {/* Hero Section */}
          <section id="home" className="hero-section">
            <SplineHero onSplineLoad={handleSplineLoad} />
            <div className="scroll-indicator">
              <span className="scroll-text">Scroll Down</span>
              <div className="scroll-arrow">
                <div className="arrow-down"></div>
              </div>
            </div>
            <ParallaxElement speed={0.3} className="bg-element bg-element-1" />
            <ParallaxElement speed={0.2} className="bg-element bg-element-2" />
          </section>

          {/* About Section */}
          <section id="about" className="section">
            <div className="container">
              <ScrollReveal animation="fadeInDown">
                <h2 className="section-title">About Me</h2>
              </ScrollReveal>
              <ScrollReveal animation="fadeInUp" delay={200}>
                <div className="glass-card section-card">
                  <div className="about-content">
                    <div className="about-text">
                      <ScrollReveal animation="fadeInLeft" delay={400}>
                        <p>
                          I'm a passionate Computer Engineering student at Toronto Metropolitan University 
                          (formerly Ryerson University) with a specialization in Software Engineering. 
                          Currently pursuing a minor in Mathematics & Computer Science, I'm driven by 
                          innovation and creating technology solutions that make a real impact.
                        </p>
                      </ScrollReveal>
                      <ScrollReveal animation="fadeInLeft" delay={600}>
                        <p>
                          Currently working as a Software Integration Engineer Intern at Geotab, where I've 
                          engineered Python-based ETL pipelines, developed enterprise-grade applications, 
                          and implemented cloud solutions on Google Cloud Platform. My experience spans 
                          from optimizing data processing times by 95% to building AI-driven assistive technologies.
                        </p>
                      </ScrollReveal>
                      <ScrollReveal animation="fadeInLeft" delay={800}>
                        <p>
                          When I'm not coding, you'll find me competing in engineering competitions, 
                          playing ping pong, tennis, astronomy, or exploring the latest developments 
                          in AI and machine learning. I believe in using technology to create inclusive 
                          solutions that benefit everyone.
                        </p>
                      </ScrollReveal>
                    </div>
                    <div className="about-stats">
                      {[
                        { number: 2, label: "Years of Experience", suffix: "+" },
                        { number: 15, label: "Projects Completed", suffix: "+" },
                        { number: 12, label: "Technologies Mastered", suffix: "+" }
                      ].map((stat, index) => (
                        <ScrollReveal key={index} animation="fadeInRight" delay={400 + index * 200}>
                          <div className="glass-item stat micro-interact" style={{ '--index': index }}>
                            <h3><AnimatedCounter end={stat.number} suffix={stat.suffix} /></h3>
                            <p>{stat.label}</p>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="section">
            <div className="container">
              <ScrollReveal animation="fadeInDown">
                <h2 className="section-title">Experience</h2>
              </ScrollReveal>
              
              <div className="experience-layout">
                <ScrollReveal animation="slideInLeft" delay={200}>
                  <ExperienceTimeline experiences={experienceData} />
                </ScrollReveal>
                
                <div className="experience-grid">
                  {experienceData.map((exp, index) => (
                    <ScrollReveal key={index} animation="slideInUp" delay={index * 200}>
                      <div className="glass-card experience-card micro-interact" style={{ '--index': index }}>
                        <div className="experience-header">
                          <div className="experience-title">
                            <h3>{exp.title}</h3>
                            <h4>{exp.company}</h4>
                          </div>
                          <div className="experience-period">{exp.period}</div>
                        </div>
                        <div className="experience-description">
                          {exp.description}
                        </div>
                        <div className="experience-skills">
                          {exp.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="experience-skill micro-interact">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="section">
            <div className="container">
              <ScrollReveal animation="fadeInDown">
                <h2 className="section-title">Featured Projects</h2>
              </ScrollReveal>
              <div className="projects-grid">
                {[
                  {
                    title: "4Sight - AI Smart Assistive Glasses",
                    description: "Neural network-driven wearable device leveraging YOLOv8 and ultrasonic sensors for real-time environmental awareness. Achieved 99% detection accuracy and won 4th place out of 17 teams, promoting social inclusivity for individuals with visual impairments.",
                    tech: ["YOLOv8", "Python", "Arduino", "OpenAI GPT API", "Neural Networks", "3D Audio Processing"],
                    icon: "👓",
                    github: "https://github.com/ahrazkk/4Sight--AI-Powered-Vision-Assistance",
                    hasLearnMore: true
                  },
                  {
                    title: "BIOsync - Muscle Fatigue Prediction",
                    description: "Advanced AI-driven fitness tracking system using EMG signal processing and MLP neural networks for real-time muscle fatigue prediction. Integrated OpenAI GPT for natural language coaching and personalized training feedback.",
                    tech: ["Python", "MLP Neural Networks", "EMG Processing", "DSP", "OpenAI GPT", "Machine Learning"],
                    icon: "💪",
                    github: "https://github.com/ahrazkk/BIOsync--Advanced-Fitness-AI",
                    hasLearnMore: true
                  },
                  {
                    title: "StreamFlix - Full-Stack Streaming Platform",
                    description: "Scalable movie streaming platform using microservices architecture with Spring Boot, Docker, and Kubernetes. Deployed on Google Cloud with CI/CD pipelines, OAuth2 security, and supports user management and subscriptions.",
                    tech: ["Spring Boot", "Docker", "Kubernetes", "Google Cloud", "MySQL", "OAuth2", "CI/CD"],
                    icon: "🎬",
                    github: "https://github.com/ahrazkk/StreamFlix--FullStack-Movie-Website",
                    hasLearnMore: true
                  },
                  {
                    title: "SQL Patient Database Management System",
                    description: "Sophisticated patient database management system leveraging SQL, Oracle, and Oracle APEX technologies. Features a visually engaging website with JavaFX integration, providing users with a user-friendly interface for accessing and managing patient data with BCNF compliance.",
                    tech: ["SQL", "Oracle", "Oracle APEX", "JavaFX", "Database Design", "BCNF Normalization"],
                    icon: "🏥",
                    github: "https://github.com/ahrazkk/Patient-DBMS-Website",
                    hasLearnMore: true
                  },
                  {
                    title: "Personal Portfolio Website",
                    description: "Modern, responsive portfolio website built with React and featuring interactive 3D elements using Spline. Implements glassmorphism design, smooth animations, and dynamic navigation with optimized performance.",
                    tech: ["React", "JavaScript", "CSS3", "Spline", "Responsive Design", "Animation"],
                    icon: "🌐",
                    github: "https://github.com/ahrazkk/blast-off-portfolio-site",
                    hasLearnMore: false
                  }
                ].map((project, index) => (
                  <ScrollReveal key={index} animation="zoomIn" delay={index * 150}>
                    <div className="glass-card project-card micro-interact" style={{ '--index': index }}>
                      <div className="project-header">
                        <div className="project-icon">
                          <span style={{ fontSize: '2rem' }}>{project.icon}</span>
                        </div>
                      </div>
                      <div className="project-content">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="project-tech">
                          {project.tech.map((tech, techIndex) => (
                            <span key={techIndex} className="tech-tag micro-interact" style={{ '--index': techIndex }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="project-links">
                          <MagneticButton 
                            className="glass-button-small"
                            onClick={() => window.open(project.github, '_blank')}
                          >
                            GitHub
                          </MagneticButton>
                          {project.hasLearnMore && (
                            <MagneticButton 
                              className="glass-button-small"
                              onClick={() => {
                                console.log(`Learn more about ${project.title}`);
                              }}
                            >
                              Learn More
                            </MagneticButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="section">
            <div className="container">
              <ScrollReveal animation="fadeInDown">
                <h2 className="section-title">Technical Skills</h2>
              </ScrollReveal>
              <div className="skills-grid">
                {[
                  {
                    category: "Programming Languages",
                    skills: ["Java", "Python", "C/C++", "JavaScript", "SQL", "HTML/CSS", "Unix/Linux Shell Scripting"]
                  },
                  {
                    category: "Frameworks & Libraries", 
                    skills: ["React", "Spring Boot", "YOLOv8", "TensorFlow", "OpenAI API", "Flask", "Express.js"]
                  },
                  {
                    category: "Cloud & DevOps",
                    skills: ["Google Cloud Platform", "AWS", "Docker", "Kubernetes", "CI/CD", "Cloud Storage", "Cloud Run"]
                  },
                  {
                    category: "Developer Tools & Technologies",
                    skills: ["Git", "VS Code", "PyCharm", "IntelliJ", "Eclipse", "Jira", "GitLab", "Oracle APEX", "MySQL"]
                  },
                  {
                    category: "Specialized Skills",
                    skills: ["ETL Pipelines", "API Integration", "Neural Networks", "Computer Vision", "Signal Processing", "Microservices", "MVVM Architecture"]
                  },
                  {
                    category: "Certifications",
                    skills: ["Software Engineer Role Certification", "Python (Basic) Certification", "SQL (Basic) Skills Certification"]
                  }
                ].map((skillGroup, index) => (
                  <ScrollReveal key={index} animation="fadeInUp" delay={index * 100}>
                    <div className="glass-card skill-category micro-interact" style={{ '--index': index }}>
                      <h3>{skillGroup.category}</h3>
                      <div className="skills-list">
                        {skillGroup.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="skill-tag micro-interact" style={{ '--index': skillIndex }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="section">
            <div className="container">
              <ScrollReveal animation="fadeInDown">
                <h2 className="section-title">Get In Touch</h2>
              </ScrollReveal>
              <ScrollReveal animation="fadeInUp" delay={200}>
                <div className="glass-card section-card">
                  <div className="contact-content">
                    <div className="contact-text">
                      <h3>Let's Connect!</h3>
                      <p>
                        I'm always open to discussing new opportunities, innovative projects, or just having 
                        a chat about technology and engineering! Whether you're looking for a software engineer, 
                        want to collaborate on an AI project, or need consultation on technical solutions, 
                        I'd love to hear from you.
                      </p>
                      <p>
                        Currently pursuing my Computer Engineering degree while gaining real-world experience 
                        at Geotab. Feel free to reach out through any of the channels below, and I'll get back 
                        to you as soon as possible. Let's build something innovative together!
                      </p>
                    </div>
                    <div className="contact-links">
                      {[
                        { 
                          icon: "📧", 
                          title: "Email", 
                          subtitle: "ahrazkibria@torontomu.ca", 
                          href: "mailto:ahrazkibria@torontomu.ca" 
                        },
                        { 
                          icon: "💼", 
                          title: "LinkedIn", 
                          subtitle: "Connect with me", 
                          href: "https://www.linkedin.com/in/ahrazkibria/" 
                        },
                        { 
                          icon: "💻", 
                          title: "GitHub", 
                          subtitle: "Check out my code", 
                          href: "https://github.com/ahrazkk" 
                        },
                        { 
                          icon: "🏫", 
                          title: "University", 
                          subtitle: "Toronto Metropolitan", 
                          href: "https://www.torontomu.ca/" 
                        }
                      ].map((contact, index) => (
                        <ScrollReveal key={index} animation="slideInRight" delay={index * 100}>
                          <a href={contact.href} target="_blank" rel="noopener noreferrer" className="glass-item contact-link micro-interact" style={{ '--index': index }}>
                            <span>{contact.icon}</span>
                            <div>
                              <strong>{contact.title}</strong>
                              <p>{contact.subtitle}</p>
                            </div>
                          </a>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Portfolio;