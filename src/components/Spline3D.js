import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import './Spline3D.css';

// Enhanced Quantum Terminal Component for 3D Computer (Office Theme)
const QuantumTerminal3D = ({ onExit }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [matrixEffect, setMatrixEffect] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/home/ahraz');
  const [visibleLines, setVisibleLines] = useState({}); // For typewriter effect
  const [aiLoading, setAiLoading] = useState(false); // NEW: AI loading state
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

  // Typewriter effect function
  // Typewriter effect function with auto-scroll
const addTypewriterEffect = (outputIndex, text) => {
  const lines = text.split('\n');
  lines.forEach((line, lineIndex) => {
    setTimeout(() => {
      setVisibleLines(prev => ({
        ...prev,
        [`${outputIndex}-${lineIndex}`]: line
      }));
      
      // Auto-scroll to bottom during typewriter effect
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 10); // Small delay to ensure DOM is updated
      
    }, lineIndex * 80); // 80ms delay between lines (really fast)
  });
};

  // Enhanced output rendering with typewriter effect
 // Updated renderOutput function that handles HTML spans
const renderOutput = (item, index) => {
  const lines = item.text.split('\n');
  return lines.map((line, lineIndex) => {
    const lineKey = `${index}-${lineIndex}`;
    const isVisible = visibleLines[lineKey] !== undefined;
    const content = isVisible ? visibleLines[lineKey] : '';
    
    return (
      <div key={lineIndex} style={{ 
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.1s ease-in'
      }}>
        {/* Check if content contains HTML spans */}
        {content.includes('<span') ? (
          <span dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
    );
  });
};

  const commands = {
    help: {
      description: 'Display available commands',
      execute: () => `
🖥️ 3D TERMINAL COMMANDS:
╭─────────────────────────────────────────╮
│ SYSTEM & NAVIGATION                     │
├─────────────────────────────────────────┤
│ help     - Show this help menu          │
│ clear    - Clear terminal screen        │
│ exit     - Return to 3D desktop view    │
│ logout   - Exit terminal mode           │
│ pwd      - Show current directory       │
│ ls       - List directory contents      │
│ cd       - Change directory             │
│ cat      - Display file contents        │
│ whoami   - Display user info            │
│ date     - Show current date/time       │
│ uptime   - Show system uptime           │
├─────────────────────────────────────────┤
│ PORTFOLIO                               │
├─────────────────────────────────────────┤
│ about    - About Ahraz Kibria           │
│ projects - Featured projects            │
│ skills   - Technical skills             │
│ contact  - Contact information          │
│ education- Educational background       │
│ achievements - Awards & achievements    │
│ experience - Work experience            │
├─────────────────────────────────────────┤
│ AI ASSISTANT                            │
├─────────────────────────────────────────┤
│ ai       - Ask Ahrazbot (ai - question) │
│ ask      - Alias for ai command         │
├─────────────────────────────────────────┤
│ FUN STUFF                               │
├─────────────────────────────────────────┤
│ matrix   - Enter the Matrix             │
│ hack     - Hacking simulation           │
│ cowsay   - Make a cow talk              │
│ fortune  - Random quote                 │
│ weather  - Check weather                │
│ music    - Terminal music player        │
│ snake    - Snake game (ASCII)           │
│ calc     - Calculator                   │
│ history  - Command history              │
╰─────────────────────────────────────────╯

💡 Tip: Use ↑↓ arrows for command history
🤖 NEW: Ask AhrazOmatic9000 anything with 'ai - your question'`
    },

    clear: {
      description: 'Clear the terminal',
      execute: () => 'CLEAR_SCREEN'
    },

       exit: {
      description: 'Exit terminal and return to 3D view',
      execute: () => {
        return `❌ EXIT COMMAND DISABLED
════════════════════════════════════════
The 'exit' command has been disabled to maintain
sync between the 3D model and terminal state.

🖱️ To exit terminal mode:
   • Click anywhere on the 3D scene
   • This ensures the camera zooms out properly
   
🎯 This keeps the 3D model and terminal perfectly synced!`;
      }
    },

    logout: {
      description: 'Logout and return to 3D view',
      execute: () => {
        return `❌ LOGOUT COMMAND DISABLED
════════════════════════════════════════
The 'logout' command has been disabled to maintain
sync between the 3D model and terminal state.

🖱️ To logout and return to 3D workspace:
   • Click anywhere on the 3D scene
   • This ensures proper camera transition
   
🎯 This keeps everything perfectly synchronized!`;
      }
    },

    pwd: {
      description: 'Show current directory',
      execute: () => currentDirectory
    },

    ls: {
      description: 'List directory contents',
      execute: (args) => {
        const targetDir = args.length > 0 ? args[0] : currentDirectory;
        const dirContents = fileSystem[targetDir];
        
        if (!dirContents) {
          return `ls: cannot access '${targetDir}': No such file or directory`;
        }

        let result = `Contents of ${targetDir}:\n`;
        Object.keys(dirContents).forEach(item => {
          const isDir = typeof dirContents[item] === 'object';
          result += `${isDir ? '📁' : '📄'} ${item}\n`;
        });
        return result;
      }
    },

    cd: {
      description: 'Change directory',
      execute: (args) => {
        if (args.length === 0) {
          setCurrentDirectory('/home/ahraz');
          return 'Changed to home directory';
        }
        
        const targetDir = args[0];
        if (fileSystem[targetDir]) {
          setCurrentDirectory(targetDir);
          return `Changed directory to ${targetDir}`;
        }
        return `cd: ${targetDir}: No such file or directory`;
      }
    },

    cat: {
      description: 'Display file contents',
      execute: (args) => {
        if (args.length === 0) return 'cat: missing file operand';
        
        const fileName = args[0];
        const currentDirContents = fileSystem[currentDirectory];
        
        if (currentDirContents && currentDirContents[fileName]) {
          return currentDirContents[fileName];
        }
        return `cat: ${fileName}: No such file or directory`;
      }
    },

    whoami: {
      description: 'Display current user',
      execute: () => `ahraz@3d-terminal
User: Ahraz Kibria
Role: Software Engineer / Computer Engineering Student
Status: Currently in 3D Terminal Mode
Security Level: Maximum
System: Quantum Computing Division`
    },

    date: {
      description: 'Show current date and time',
      execute: () => new Date().toString()
    },

    uptime: {
      description: 'Show system uptime',
      execute: () => {
        const uptime = Math.floor(performance.now() / 1000);
        return `System uptime: ${uptime} seconds
3D Engine: Active
Spline renderer: Online
Terminal sessions: 1 active
Portfolio status: Deployed`;
      }
    },

    about: {
      description: 'About Ahraz Kibria',
      execute: () => `
╭─────────────────────────────────────────╮
│           ABOUT AHRAZ KIBRIA            │
├─────────────────────────────────────────┤
│ 🎓 Computer Engineering @ TMU           │
│ 💼 Software Engineer @ Geotab          │
│ 🤖 AI & Machine Learning Enthusiast    │
│ ☁️ Cloud Computing Specialist          │
│ 🌐 3D Web Development Pioneer          │
├─────────────────────────────────────────┤
│ 🏓 Ping Pong Champion                  │
│ 🌟 Engineering Competition Winner      │
│ 🔭 Astronomy Hobbyist                  │
│ 🎮 3D Graphics Enthusiast              │
╰─────────────────────────────────────────╯

Currently viewing from my 3D portfolio environment!
Built with React + Spline for an immersive experience.`
    },

    projects: {
      description: 'Featured projects',
      execute: () => `
🚀 FEATURED PROJECTS:
════════════════════════════════════════

👓 4Sight - AI Smart Assistive Glasses
   • YOLOv8 + OpenAI GPT integration
   • 99% detection accuracy achieved
   • 4th place in engineering competition
   • Real-time environmental awareness

💪 BIOsync - Muscle Fatigue Prediction  
   • EMG signal processing with ML
   • Real-time AI analysis
   • Personalized training feedback
   • OpenAI coaching integration

🎬 StreamFlix - Full-Stack Platform
   • Microservices architecture
   • Docker + Kubernetes deployment
   • Google Cloud scalability
   • OAuth2 security implementation

🏥 Patient Database Management
   • Oracle APEX + JavaFX UI
   • BCNF database normalization
   • Comprehensive data management
   • Medical record security

🌐 This 3D Portfolio Website
   • React + Spline integration
   • Interactive 3D environment
   • Quantum terminal interface
   • Currently experiencing! 😎`
    },

    skills: {
      description: 'Technical skills',
      execute: () => `
💻 TECHNICAL SKILLS MATRIX:
════════════════════════════════════════

Programming Languages:
├─ Java          ██████████ Expert
├─ Python        ████████░░ Advanced  
├─ C/C++         ███████░░░ Advanced
├─ JavaScript    ████████░░ Advanced
├─ SQL           ██████░░░░ Intermediate
└─ HTML/CSS      █████░░░░░ Intermediate

Frameworks & Libraries:
├─ React         █████████░ Expert
├─ Spring Boot   ████████░░ Advanced
├─ TensorFlow    ███████░░░ Advanced
├─ YOLOv8        ██████░░░░ Intermediate
└─ Flask         █████░░░░░ Intermediate

Cloud & DevOps:
├─ Google Cloud  ████████░░ Advanced
├─ AWS           ██████░░░░ Intermediate
├─ Docker        ███████░░░ Advanced
├─ Kubernetes    ██████░░░░ Intermediate
└─ CI/CD         █████░░░░░ Intermediate

🎯 Specialized Skills:
• ETL Pipeline Engineering  
• Computer Vision Systems
• Cloud Architecture Design
• 3D Web Development
• Neural Network Design
• API Integration & Security

🏆 Achievements:
• 95% ETL performance improvement
• 99% AI detection accuracy
• 4th place engineering competition`
    },

    contact: {
      description: 'Contact information',
      execute: () => `
📧 CONTACT INFORMATION:
════════════════════════════════════════

Primary Contact:
├─ Email:    ahrazkibria@torontomu.ca
├─ LinkedIn: linkedin.com/in/ahrazkibria/
├─ GitHub:   github.com/ahrazkk
└─ Location: Toronto, Ontario, Canada

🌐 Online Presence:
├─ Portfolio: Currently viewing in 3D! 🎮
├─ Projects:  Check GitHub for latest work
└─ Resume:    Available upon request

🤝 Open to discussing:
• Software engineering opportunities
• AI/ML collaboration projects  
• 3D web development consulting
• Cloud architecture solutions
• Cool tech innovations

📱 Response Time: Usually within 24 hours
🌍 Time Zone: EST (UTC-5)
💬 Preferred: Email or LinkedIn messages

Let's build something amazing together! 🚀`
    },

    education: {
      description: 'Educational background',
      execute: () => `
🎓 EDUCATIONAL BACKGROUND:
════════════════════════════════════════

Toronto Metropolitan University
├─ Program:  Bachelor of Engineering
├─ Major:    Computer Engineering  
├─ Focus:    Software Engineering
├─ Minor:    Mathematics & Computer Science
├─ Status:   Expected Graduation 2026
└─ GPA:      Maintaining Excellence

📚 Relevant Coursework:
├─ Data Structures & Algorithms
├─ Software Engineering Principles
├─ Computer Networks & Security
├─ Database Systems Design
├─ Artificial Intelligence
├─ Digital Signal Processing
├─ Microprocessor Systems
├─ Cloud Computing Architectures
└─ 3D Graphics Programming

🏆 Academic Achievements:
├─ Dean's List Recognition
├─ Engineering Competition Participant
├─ AI Project Innovation Award
└─ Technical Excellence Scholarship

🎯 Certifications:
├─ ✅ Software Engineer Role Certification
├─ ✅ Python (Basic) Certification
├─ ✅ SQL (Basic) Skills Certification
└─ 🔄 Cloud Architecture (In Progress)`
    },

    achievements: {
      description: 'Awards and achievements',
      execute: () => `
🏆 ACHIEVEMENTS & AWARDS:
════════════════════════════════════════

🥇 Competition Achievements:
├─ 4th Place - Innovative Design Competition (2024)
│  └─ AI Smart Assistive Glasses project
│  └─ 14 competing teams
│  └─ Recognition for social impact
└─ Engineering Excellence Award (2023)

⚡ Professional Achievements:
├─ 95% Performance Improvement @ Geotab (2024)
│  └─ ETL Pipeline optimization
│  └─ Processing 500,000+ vehicle datasets
│  └─ Enterprise-level system enhancement
└─ System Reliability Champion (2024)
   └─ 53 database integration project

🎯 Technical Achievements:
├─ 99% Detection Accuracy - 4Sight Project (2024)
│  └─ YOLOv8 neural network implementation
│  └─ Real-time object detection system
│  └─ Assistive technology innovation
└─ Cloud Architecture Excellence (2024)
   └─ Scalable microservices design

🎓 Academic Achievements:
├─ Dean's List Recognition (Multiple Terms)
│  └─ Academic excellence maintenance
│  └─ Engineering program distinction
└─ Technical Innovation Awards:
   ├─ Best AI Implementation (4Sight)
   ├─ Outstanding Code Quality (StreamFlix)
   └─ Creative Problem Solving (BIOsync)

🚀 Professional Certifications:
├─ Software Engineer Role Certification
├─ Python & SQL Proficiency Certifications
└─ Cloud Computing Specializations

🌟 Impact Metrics:
├─ 500,000+ vehicles optimized
├─ 95% performance improvements delivered
├─ 99% AI accuracy achieved
└─ 14 teams outperformed in competition`
    },

    experience: {
      description: 'Work experience',
      execute: () => `
💼 WORK EXPERIENCE:
════════════════════════════════════════

🚀 Software Integration Engineer Intern
   Company: Geotab Headquarters
   Period:  Aug 2024 – May 2025
   
   Key Achievements:
   ├─ Engineered Python ETL pipelines
   │  └─ 95% performance improvement
   │  └─ Processing 500,000+ active vehicles
   ├─ Developed enterprise C# WPF applications
   │  └─ MVVM architecture implementation
   │  └─ Advanced system resilience
   └─ Implemented GCP cloud solutions
      └─ 53 diverse databases integration
      └─ Critical data integration systems

🏆 Engineering Competitions Competitor
   Company: Toronto Metropolitan University
   Period:  Dec 2023 – Jan 2024
   
   Key Achievements:
   ├─ Developed AI Smart Assistive Glasses
   │  └─ YOLOv8, Python, Arduino integration
   │  └─ 4th place among 14 teams
   ├─ Innovative Design Competition winner
   │  └─ Complex tech concept articulation
   └─ Social impact technology focus
      └─ Accessibility and inclusion

🏓 Professional Development Specialist
   Company: Self-Employed
   Period:  Aug 2021 – Ongoing
   
   Core Competencies:
   ├─ Hand-eye coordination optimization
   ├─ Strategic thinking development  
   ├─ Astronomy observation protocols
   ├─ Tennis cross-training regimen
   └─ Persistence and sportsmanship
   
   Current Projects:
   ├─ Serve technique improvement algorithm
   ├─ Backhand consistency analysis
   └─ Multi-sport performance correlation

🎯 Technical Skills Applied:
   ├─ Python, C#, Java, JavaScript
   ├─ Google Cloud Platform, AWS
   ├─ ETL Pipelines, API Integration
   ├─ Neural Networks, Computer Vision
   └─ Microservices, Docker, Kubernetes`
    },

    // NEW AI COMMANDS!
    // Updated AI command with colored name
ai: {
  description: 'Ask AhrazOmatic9000 a question (Usage: ai - your question)',
  execute: async (args) => {
    const prompt = args.join(' ').replace(/^-\s*/, ''); // Remove leading dash
    
    if (!prompt) {
      return `🤖 <span class="ai-name">AhrazOmatic9000:</span> Hey there! I'm Ahraz's personal AI assistant living in this 3D terminal!

Ask me anything about:
• Ahraz's projects (4Sight, BIOsync, StreamFlix, etc.)
• His technical skills and experience  
• How to contact him
• Programming and tech questions
• Random fun stuff!

Usage: ai - what programming languages does Ahraz know?
       ai - tell me about 4Sight
       ai - how can I contact Ahraz?
       ai - what's the meaning of life?`;
    }

    try {
      // Detect if we're on localhost
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      // Choose API URL based on environment
      const apiUrl = isLocalhost 
        ? 'https://ahraz-website3-a03aihfs2-razas-projects-0ef26892.vercel.app/api/chat'  // Live API
        : '/api/chat';  // Relative path for production

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return `🤖 <span class="ai-name">AhrazOmatic9000:</span> ${data.error}`;
      }

      const locationNote = isLocalhost ? '\n💡 (Powered by live API from localhost)' : '';

      return `🤖 <span class="ai-name">AhrazOmatic9000:</span> ${data.response}

💡 Tokens used: ${data.tokensUsed || 'unknown'}${locationNote}`;
      
    } catch (error) {
      console.error('AI request failed:', error);
      
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        return `🤖 <span class="ai-name">AhrazOmatic9000:</span> Localhost can't reach the live API! 🔧

🌐 For full AI functionality, visit:
https://ahraz-website3-a03aihfs2-razas-projects-0ef26892.vercel.app

Or contact Ahraz directly: ahrazkibria@torontomu.ca 📧`;
      }
      
      return `🤖 <span class="ai-name">AhrazOmatic9000:</span> Oops! I'm having technical difficulties! 🔧
Maybe try again later or contact Ahraz directly at ahrazkibria@torontomu.ca 📧

Error: Network connection issue`;
    }
  }
},

// Also update the ask command alias:
ask: {
  description: 'Alias for ai command',
  execute: (args) => commands.ai.execute(args)
},

    matrix: {
      description: 'Enter the Matrix',
      execute: () => {
        setMatrixEffect(true);
        setTimeout(() => setMatrixEffect(false), 5000);
        return `
🔴 MATRIX PROTOCOL INITIATED 🔴
════════════════════════════════════════

Scanning 3D environment...     [████████]
Neural pathways mapped...      [████████]  
Reality.exe corrupted...       [████████]
Quantum entanglement active... [████████]
Spline renderer hijacked...    [████████]

   ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
   ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
   ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
   ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
   ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
   ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝

Welcome to the Matrix, Neo.
The 3D world around you is not real.
Red pill or blue pill? 💊

Choose your reality...`;
      }
    },

    hack: {
      description: 'Initiate hacking sequence',
      execute: () => {
        return `🚨 HACKING SEQUENCE INITIATED 🚨
════════════════════════════════════════

[████████████████████] Scanning 3D networks...
[████████████████████] Bypassing Spline security...
[████████████████████] Accessing render pipeline...
[████████████████████] Extracting 3D coordinates...
[████████████████████] Hijacking camera controls...

ACCESS GRANTED ✅

🎯 Compromised Systems:
├─ 3D Portfolio Server: OPTIMIZED
├─ Spline Rendering Engine: ENHANCED  
├─ Quantum Terminal: SUPERCHARGED
├─ React Component Tree: ACCELERATED
├─ CSS Animation Engine: BOOSTED
└─ Coffee Machine API: HACKED ☕

📊 System Status:
├─ Polygons rendered: 1,337,420
├─ Frames per second: 60+ FPS
├─ Memory usage: Optimized
├─ User experience: MAXIMUM
└─ Security level: Paradoxically increased

⚠️ DISCLAIMER: No actual hacking occurred.
   Just having fun with your 3D portfolio! 😄
   
🎮 Pro tip: Try moving around the 3D scene
   while this terminal is open!`;
      }
    },

    cowsay: {
      description: 'Make a cow say something',
      execute: (args) => {
        const message = args.join(' ') || 'Welcome to my 3D portfolio!';
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
                ||     ||

🐄 Moo! Thanks for visiting my 3D space!
   This cow is rendered in pure ASCII,
   unlike the fancy 3D graphics behind me! 😂`;
      }
    },

    fortune: {
      description: 'Get a random quote',
      execute: () => {
        const fortunes = [
          "The future belongs to those who code in 3D! 🚀",
          "Innovation is seeing what everybody has seen and thinking what nobody has thought. 💡",
          "Code is poetry written in logic and rendered in 3D. 📝",
          "The best way to predict the future is to create it in React and Spline. ⚛️",
          "Debugging is like being a detective in a crime movie where you're also the murderer. 🔍",
          "There are only 10 types of people: those who understand binary and those who need 3D visualizations. 🤓",
          "In 3D space, no one can hear you console.log(). 🌌",
          "May your framerate be high and your render times be low. 🎮"
        ];
        return `🔮 ${fortunes[Math.floor(Math.random() * fortunes.length)]}`;
      }
    },

    weather: {
      description: 'Check current weather',
      execute: () => `
🌤️  WEATHER REPORT - Toronto, ON
════════════════════════════════════════
Temperature: ${Math.floor(Math.random() * 30 - 10)}°C
Condition: ${['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Partly Cloudy'][Math.floor(Math.random() * 5)]}
Humidity: ${Math.floor(Math.random() * 100)}%
Wind: ${Math.floor(Math.random() * 20)} km/h

🖥️  3D Environment Status:
Lighting: Optimal for 3D rendering ✨
Visibility: Crystal clear polygons 🔍  
Atmosphere: Perfect for coding ☕
Framerate Weather: Smooth 60 FPS 🎮
GPU Temperature: Cool as ice 🧊

Perfect weather for 3D development! 🌟`
    },

    music: {
      description: 'Play terminal music',
      execute: () => `
🎵 QUANTUM 3D MUSIC PLAYER 🎵
════════════════════════════════════════
♪ Now Playing: "Spline Symphony in React Major" ♪

[████████████████████████████████████████] 3:47 / 3:47

🎼 3D Coding Playlist:
   1. ► Binary Beats in 3D Space
   2.   JavaScript Jazz (Orchestral Mix)
   3.   Python Phonk (Synthwave Remix)
   4.   React Rhapsody (Epic Version)
   5.   Algorithm Anthem (3D Audio)
   6.   Spline Serenade (Ambient)
   7.   Terminal Techno (Cyberpunk Mix)

Volume: ████████░░ 80%
3D Audio: 🎧 Spatial positioning enabled
Equalizer: 🎚️ Optimized for coding flow

🎧 Pro tip: This music makes you code 300% faster
   and renders your 3D scenes 200% smoother! 🚀`
    },

    snake: {
      description: 'Play retro snake game',
      execute: () => `
🐍 QUANTUM 3D SNAKE GAME 🐍
════════════════════════════════════════
╭─────────────────────────────────────────╮
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░🍎░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
╰─────────────────────────────────────────╯

Score: 1337 | High Score: 9001 | Length: 6

🎮 Controls: WASD or Arrow Keys
💀 Game Status: ASCII version active!
🏆 Challenge: Eat apples, avoid walls & yourself
🌟 Special: Each apple adds a 3D polygon to scene!

⚠️  Note: Full 3D snake game coming in v4.0...
    For now, enjoy this retro ASCII version! 🕹️

🐍 Fun fact: This snake is technically rendered
   on your 3D computer screen inside Spline! 🤯`
    },

    calc: {
      description: 'Calculator',
      execute: (args) => {
        if (args.length === 0) return 'Usage: calc <expression> (e.g., calc 2+2)';
        try {
          const expression = args.join(' ');
          // Simple calculator - only allow basic operations for security
          const result = Function('"use strict"; return (' + expression.replace(/[^0-9+\-*/.() ]/g, '') + ')')();
          return `🧮 QUANTUM CALCULATOR:
══════════════════════════════════════
Input:  ${expression}
Output: ${result}
Binary: ${result.toString(2)}
Hex:    0x${result.toString(16).toUpperCase()}

🎯 Rendered in 3D terminal environment!
⚡ Calculations powered by JavaScript engine.`;
        } catch (error) {
          return `❌ CALCULATION ERROR:
══════════════════════════════════════
Invalid expression: ${args.join(' ')}

💡 Tip: Use basic operators (+, -, *, /, %)
📝 Example: calc 1337 * 42 / 7`;
        }
      }
    },

    history: {
      description: 'Show command history',
      execute: () => {
        if (commandHistory.length === 0) return 'No commands in history';
        
        let result = '📜 COMMAND HISTORY:\n';
        result += '════════════════════════════════════════\n';
        commandHistory.forEach((cmd, index) => {
          result += `${String(index + 1).padStart(3)}: ${cmd}\n`;
        });
        result += '\n💡 Use ↑↓ arrows to navigate history';
        return result;
      }
    }
  };

  // Welcome message for 3D terminal with typewriter effect
  useEffect(() => {
    const welcomeMessage = {
      type: 'welcome',
      text: `🖥️ 3D TERMINAL ACTIVATED 🖥️

╔═══════════════════════════════════════════════════════════════╗
║                QUANTUM 3D TERMINAL v4.0                       ║
║          Welcome to Ahraz Kibria's 3D Portfolio!              ║
╠═══════════════════════════════════════════════════════════════╣
║ System Status: ✅ ONLINE    │ Graphics: ✅ SPLINE READY      ║
║ Terminal Mode: ✅ ACTIVE    │ Reality:  ⚠️  QUESTIONABLE     ║
║ 3D Engine:     ✅ RUNNING   │ Coffee:   ☕ REQUIRED          ║
╚═══════════════════════════════════════════════════════════════╝

🌟 You are currently inside a 3D computer terminal!
🎮 Feel free to explore the 3D environment around this screen.
💻 This terminal is rendered on a virtual computer screen using Spline.

Type 'help' to see all available commands.

🤖 NEW: Ask AhrazOmatic9000 anything with 'ai - your question'
(HEAVLY UNDER CONSTRUCTION, WEIRD PERSONALITY, AND NOT GREAT!)
(PLEASE DON'T ASK ANYTHING WIERD, IT JUST LIES ABOUT SOME DETAILS)

Ready for some 3D computing magic? Let's go! 🚀
════════════════════════════════════════════════════════════════`
    };
    setOutput([welcomeMessage]);
    // Trigger typewriter effect for welcome message
    setTimeout(() => addTypewriterEffect(0, welcomeMessage.text), 500);
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
}, [output, visibleLines]); // Also trigger on typewriter changes

  // UPDATED: Now async to handle AI commands
  const handleCommand = async () => {
    const cmd = input.trim();
    if (!cmd) return;

    const [command, ...args] = cmd.toLowerCase().split(' ');
    const newOutput = [...output];

    newOutput.push({ type: 'command', text: `${currentDirectory}$ ${cmd}` });

    if (command in commands) {
      if (command === 'clear') {
        setOutput([]);
        setVisibleLines({}); // Clear typewriter state too
        setInput('');
        return;
      }
      
      // Handle AI commands (async)
      if (command === 'ai' || command === 'ask') {
        const loadingIndex = newOutput.length;
        newOutput.push({ 
          type: 'ai-loading', 
text: '🤖 <span class="ai-name">AhrazOmatic9000:</span> Thinking...'
        });
        setOutput([...newOutput]);
        
        try {
          const result = await commands[command].execute(args);
          const finalOutput = [...newOutput];
          finalOutput[loadingIndex] = { 
            type: 'ai-response', 
            text: result 
          };
          setOutput(finalOutput);
          
          // Add typewriter effect for AI response
          setTimeout(() => addTypewriterEffect(loadingIndex, result), 100);
          
        } catch (error) {
          const finalOutput = [...newOutput];
          finalOutput[loadingIndex] = { 
            type: 'error', 
            text: '🤖 <span class="ai-name">AhrazOmatic9000:</span> Sorry, I encountered an error! 🔧' 
          };
          setOutput(finalOutput);
        }
      } else {
        // Handle sync commands normally
        const result = commands[command].execute(args);
        if (result === 'CLEAR_SCREEN') {
          setOutput([]);
          setVisibleLines({});
        } else {
          newOutput.push({ type: 'output', text: result });
          setOutput(newOutput);
          
          // Add typewriter effect
          const lastOutputIndex = newOutput.length - 1;
          setTimeout(() => addTypewriterEffect(lastOutputIndex, result), 100);
        }
      }
    } else {
      newOutput.push({ 
        type: 'error', 
        text: `❌ Command not found: ${command}

💡 Did you mean one of these?
   ${Object.keys(commands).filter(c => c.includes(command.charAt(0))).slice(0, 3).join(', ')}

📖 Type 'help' for all available commands.
🤖 Try 'ai - your question' to ask AhrazOmatic9000!` 
      });
      setOutput(newOutput);
      
      // Add typewriter effect
      const lastOutputIndex = newOutput.length - 1;
      setTimeout(() => addTypewriterEffect(lastOutputIndex, newOutput[lastOutputIndex].text), 100);
    }

    // Immediate scroll for the command line
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 50);

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
  };

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
        { type: 'output', text: `💡 Possible completions: ${matches.join(', ')}` }
      ];
      setOutput(newOutput);
    }
  };

  return (
    <div 
      className={`quantum-terminal-3d ${matrixEffect ? 'matrix-active' : ''}`}
      style={{
        color: '#90b090',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '12px',
        boxShadow: 'none',
        textShadow: 'none',
      }}
    >
      
<div ref={outputRef} className="quantum-terminal-output" style={{
      }}>
                {output.map((item, index) => (
          <div key={index} className={`quantum-output ${item.type}`} style={{
            color: item.type === 'welcome' ? '#a0c0a0' : 
                   item.type === 'command' ? '#8bb5d4' : 
                   item.type === 'error' ? '#d49999' : 
                   item.type === 'ai-loading' ? '#d4af37' :  // NEW: Dull yellow for loading
                   item.type === 'ai-response' ? '#87ceeb' :  // NEW: Light blue for AI
                   '#90b090',
            textShadow: '0 0 3px rgba(144, 176, 144, 0.6)' // Stronger glow for invisible bg
          }}>
            <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
              {item.type === 'command' ? item.text : renderOutput(item, index)}
            </pre>
          </div>
        ))}
      </div>
      
      <div className="quantum-input-line" style={{
        backgroundColor: 'transparent',
        border: '1px solid rgba(80, 120, 80, 0.4)',
        borderRadius: '4px',
        boxShadow: 'none',
      }}>
        <span className="quantum-prompt" style={{
          color: '#a0c0a0',
          textShadow: '0 0 3px rgba(160, 192, 160, 0.7)' // Stronger glow
        }}>
          {currentDirectory}$
        </span>
        <input
          ref={inputRef}
          className="quantum-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          placeholder="Type a command..."
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#c0d0c0',
            fontFamily: 'Courier New, monospace',
            outline: 'none',
            caretColor: '#90b090',
            textShadow: 'none',
          }}
        />
        <span className="quantum-cursor" style={{
          backgroundColor: '#90b090',
          boxShadow: '0 0 5px rgba(144, 176, 144, 0.8)' // Stronger cursor glow
        }}></span>
      </div>
      
      {matrixEffect && (
        <div className="matrix-overlay">
          <div className="matrix-rain"></div>
        </div>
      )}
    </div>
  );
};

// Main Spline3D Component with 3D Integration
export default function Spline3D() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isComputerZoomed, setIsComputerZoomed] = useState(false);
  const [terminalPending, setTerminalPending] = useState(false); // Track if activation is pending

  const splineRef = useRef(null);
  const terminalTimeoutRef = useRef(null); // Track the pending timeout


  // Add keyboard shortcut to open terminal
  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     // Press 'T' to open terminal
  //     if (e.key.toLowerCase() === 't' && !showTerminal) {
  //       console.log('Terminal shortcut pressed!');
  //       setIsComputerZoomed(true);
  //       setTimeout(() => setShowTerminal(true), 2000); // 2-second delay
  //     }
  //     // Press 'Escape' to close terminal
  //     if (e.key === 'Escape' && showTerminal) {
  //       setShowTerminal(false);
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyPress);
  //   return () => window.removeEventListener('keydown', handleKeyPress);
  // }, [showTerminal]);


// Add keyboard shortcut to open terminal
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Press 'T' to open terminal
      if (e.key.toLowerCase() === 't' && !showTerminal) {
        console.log('Terminal shortcut pressed!');
        setIsComputerZoomed(true);
        setTimeout(() => setShowTerminal(true), 2000); // 2-second delay
      }
      // Press 'Escape' to close terminal
      if (e.key === 'Escape' && showTerminal) {
        setShowTerminal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showTerminal]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (terminalTimeoutRef.current) {
        clearTimeout(terminalTimeoutRef.current);
      }
    };
  }, []);



  const handleSplineLoad = (splineApp) => {
    console.log('Spline scene loaded successfully!');
    setSplineLoaded(true);
    splineRef.current = splineApp;
    
    // Try to trigger physics for coffee mug and other objects
    if (splineApp) {
      try {
        // Find coffee mug and enable physics
        const coffeeMug = splineApp.findObjectByName('Coffee') || 
                          splineApp.findObjectByName('Mug') || 
                          splineApp.findObjectByName('coffee') ||
                          splineApp.findObjectByName('mug') ||
                          splineApp.findObjectByName('Cup') ||
                          splineApp.findObjectByName('cup');
        
        if (coffeeMug) {
          console.log('Coffee mug found, enabling physics...');
          // Enable physics or trigger animation
          coffeeMug.emitEvent('start');
        }
        
        // Alternative: trigger all physics objects
        splineApp.emitEventReverse('start');
        
        console.log('Available objects:', splineApp.getAllObjects?.() || 'getAllObjects not available');
      } catch (error) {
        console.log('Physics setup error (this is normal):', error);
      }
    }
  };

  const handleSplineMouseDown = (e) => {
    console.log('Spline object clicked:', e.target.name);
    
    // Check if computer screen was clicked
    const screenNames = [
      'screen', 'monitor', 'computer', 'display', 'laptop', 'pc', 
      'macbook', 'imac', 'desktop', 'notebook', 'tablet', 'ipad',
      'lcd', 'led', 'crt', 'tv', 'television', 'panel', 'surface',
      'plane', 'rectangle', 'quad', 'mesh', 'object', 'cube', 'box'
    ];
    const clickedName = e.target.name?.toLowerCase() || '';
    const isScreenClicked = screenNames.some(name => 
      clickedName.includes(name) || 
      e.target.id?.toLowerCase().includes(name) ||
      e.target.className?.toLowerCase().includes(name)
    );
    const shouldToggleTerminal = isScreenClicked || !e.target.name;
    
    if (shouldToggleTerminal) {
      // Simple toggle logic: If terminal is active OR pending, deactivate. Otherwise, activate.
      if (showTerminal || terminalPending) {
        // DEACTIVATE: Cancel any pending activation or close active terminal
        console.log('Deactivating terminal (was active or pending)...');
        
        // Cancel pending timeout if exists
        if (terminalTimeoutRef.current) {
          clearTimeout(terminalTimeoutRef.current);
          terminalTimeoutRef.current = null;
        }
        
        setShowTerminal(false);
        setIsComputerZoomed(false);
        setTerminalPending(false);
        
      } else {
        // ACTIVATE: Start zoom sequence
        console.log('Activating terminal...');
        setIsComputerZoomed(true);
        setTerminalPending(true);
        
        // Set timeout for terminal activation
        terminalTimeoutRef.current = setTimeout(() => {
          console.log('Camera zoom complete, showing terminal...');
          setShowTerminal(true);
          setTerminalPending(false);
          terminalTimeoutRef.current = null;
        }, 2000);
      }
    }
  };

  // Add double click handler as backup
//   const handleSplineDoubleClick = (e) => {
//   console.log('Double click detected!');
//   if (showTerminal) {
//     // DEACTIVATE: Instantly close terminal and zoom out
//     console.log('Deactivating terminal instantly...');
//     setShowTerminal(false);
//     setIsComputerZoomed(false);
//   } else {
//     // ACTIVATE: Zoom in and show terminal after delay
//     setIsComputerZoomed(true);
//     setTimeout(() => setShowTerminal(true), 2000);
//   }
// };

  const handleTerminalExit = () => {
    console.log('Exiting terminal mode...');
    setShowTerminal(false);
    // Keep zoomed in - don't zoom out
    // setIsComputerZoomed(false); // Commented out to prevent zoom out
  };

  return (
    <div className="spline-app-container">
      {/* 3D Spline Scene */}
      <Spline 
        scene="https://prod.spline.design/KGcgXQg8Hl4zkQvH/scene.splinecode"
        onLoad={handleSplineLoad}
        onMouseDown={handleSplineMouseDown}
        style={{ width: '100%', height: '100vh' }}
      />
      
      {/* Debug indicator */}
      {showTerminal && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'red',
          color: 'white',
          padding: '5px 10px',
          zIndex: 10000,
          fontSize: '12px',
          borderRadius: '4px'
        }}>
          TERMINAL ACTIVE
        </div>
      )}


      {/* Terminal Overlay - Perfectly aligned with screen angle */}
      {showTerminal && (
        <div className="terminal-overlay" style={{
          position: 'fixed',
          top: '43%',
          left: '49%',
          transform: 'translate(-50%, -50%) perspective(1000px) rotateX(3deg) rotateY(-1deg) rotateZ(0.5deg)', // ← ADDED ROTATION to match screen angle
          width: '680px',
          height: '540px',
          zIndex: 9999,
          backgroundColor: 'transparent', // Completely transparent
          border: 'none', // Remove all borders
          borderRadius: '0px', // ← REMOVE ROUNDING to eliminate edge background
          boxShadow: 'none', // Remove all shadows
          backdropFilter: 'none',
          animation: 'none',
          overflow: 'hidden' // ← HIDE any overflow that might show background
        }}>
<QuantumTerminal3D onExit={handleTerminalExit} />
        </div>
      )}
      
      {/* Instruction overlay when zoomed but terminal not yet shown */}
      {isComputerZoomed && !showTerminal && (
        <div className="instruction-overlay" style={{
          position: 'fixed',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.9)',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '1rem 2rem',
          borderRadius: '8px',
          border: '1px solid rgba(80, 120, 80, 0.6)', // Muted green border
          animation: 'bootSequence 2s ease-in-out'
        }}>
          <p>🖥️ Booting Office Terminal Interface...</p>
          <div className="loading-dots">
            <span style={{ background: '#90b090' }}></span>
            <span style={{ background: '#90b090' }}></span>
            <span style={{ background: '#90b090' }}></span>
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Camera zoom in progress • Professional terminal initializing
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {!splineLoaded && (
        <div className="spline-loading">
          <div className="loading-spinner"></div>
          <p>Loading 3D Portfolio Environment...</p>
          <div className="loading-tips">
            <p>💡 Click on the computer screen to access the terminal</p>
          </div>
        </div>
      )}

{/* Instructions overlay */}
      {splineLoaded && !showTerminal && (
        <div className="spline-instructions">
          <div className="instruction-card">
            <h3>🖥️ Interactive 3D Portfolio</h3>
            <p>Welcome to Ahraz Kibria's immersive 3D workspace! This portfolio combines cutting-edge web technologies to create a unique professional experience.</p>
            
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.8rem',
              background: 'rgba(0, 255, 65, 0.1)',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              borderRadius: '6px'
            }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold',
                color: '#a0c0a0',
                marginBottom: '0.5rem'
              }}>
                🎯 How to Access Terminal:
              </div>
              <div className="instruction-controls">
                <span>🖱️ Click the computer screen to zoom in</span>
                <span>⚡ Terminal loads automatically after 2s</span>
                <span>🔄 Click again anywhere to return to desk view</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.8rem', 
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.4'
            }}>
              <strong>🚀 Tech Stack:</strong><br/>
              • <strong>React</strong> - Component architecture<br/>
              • <strong>Spline</strong> - 3D graphics & animations<br/>
              • <strong>CSS3</strong> - Advanced styling & effects<br/>
              • <strong>JavaScript</strong> - Interactive functionality
            </div>

            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.8rem', 
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.4'
            }}>
              <strong>💼 Featured Work:</strong><br/>
              • <strong>4Sight</strong> - AI Assistive Glasses (99% accuracy)<br/>
              • <strong>BIOsync</strong> - ML-powered fitness tracking<br/>
              • <strong>StreamFlix</strong> - Full-stack streaming platform<br/>
              • <strong>This Portfolio</strong> - 3D web innovation
            </div>

           

            <div style={{ 
              marginTop: '0.8rem', 
              fontSize: '0.7rem', 
              color: showTerminal ? '#a0c0a0' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '0.4rem',
              background: showTerminal ? 'rgba(0, 255, 65, 0.15)' : 'rgba(100, 100, 100, 0.15)',
              borderRadius: '4px',
              border: showTerminal ? '1px solid rgba(0, 255, 65, 0.4)' : '1px solid rgba(100, 100, 100, 0.3)'
            }}>
              Status: {showTerminal ? '🟢 TERMINAL ACTIVE' : '🔴 DESKTOP VIEW'}
            </div>
          </div>
        </div>
      )}    </div>
  );
}