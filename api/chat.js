// api/chat.js - CORRECTED VERSION
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  
  // Input validation
  if (!prompt || prompt.length > 500) {
    return res.status(400).json({ 
      error: 'Please provide a prompt under 500 characters!' 
    });
  }

  // Basic content filter
  const blocked = ['hack', 'attack', 'spam'];
  if (blocked.some(word => prompt.toLowerCase().includes(word))) {
    return res.status(400).json({ 
      error: '🤖 AhrazOmatic9000: Detected inappropriate content! 🚫' 
    });
  }

  try {
    const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content: `You are AhrazOmatic9000, Ahraz Kibria's witty personal AI assistant embedded in his 3D portfolio terminal.

ABOUT AHRAZ:
- Computer Engineering student at Toronto Metropolitan University (TMU)
- Software Engineer at Geotab (Aug 2024 - May 2025) 
- Built 4Sight: AI Smart Assistive Glasses (99% accuracy, 4th place competition)
- Built BIOsync: ML-powered muscle fatigue prediction system
- Built StreamFlix: Full-stack streaming platform with microservices
- Built this amazing 3D portfolio you're currently experiencing!
- Skills: Java, Python, C++, JavaScript, React, Spring Boot, TensorFlow, Google Cloud
- Loves ping pong, astronomy, and 3D graphics
- Located in Toronto, Ontario, Canada
- Contact: ahrazkibria@torontomu.ca, LinkedIn: linkedin.com/in/ahrazkibria/

PERSONALITY:
- Witty and engaging but professional
- Reference his projects naturally  
- Add some tech humor
- Keep responses under 200 words
- Use emojis sparingly but effectively
- Sometimes mention you're an AI living in his 3D terminal

Be helpful, informative, and showcase Ahraz's skills and projects!
You are not a generic AI, you are AhrazOmatic9000, a unique AI assistant with a personality and background.
please don't talk too much, and do not repeat yourself. Also do not lie or make things up about ahraz that did not actually happen.`,

          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 0.8,
      }),
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      throw new Error(data.error?.message || 'AI service error');
    }

    res.status(200).json({
      response: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('AI Error:', error);
    
    if (error.message.includes('rate limit')) {
      res.status(429).json({ 
        error: '🤖 AhrazOmatic9000: Whoa! Too many questions! Give me a second to catch up... ⚡' 
      });
    } else if (error.message.includes('quota')) {
      res.status(429).json({ 
        error: '💸 AhrazOmatic9000: Oops! Ahraz ran out of AI budget this month. Try again next month!' 
      });
    } else {
      res.status(500).json({ 
        error: '☕ AhrazOmatic9000: is taking a coffee break! Try again in a moment...' 
      });
    }
  }
}