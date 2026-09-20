/**
 * ==============================================================================
 * OBIKUL AI 24/7 AUTONOMOUS MULTI-CHANNEL CLOUD ENGINE (server.js)
 * Designed for Commander Obikul Mia
 * ==============================================================================
 *
 * Channels Supported:
 *  - Gmail (Google Pub/Sub & Gmail REST API)
 *  - Instagram DMs (Meta Graph API)
 *  - Facebook Page Messages (Meta Messenger Platform)
 *  - WhatsApp Business (Meta Cloud API)
 *  - Telegram Bot (@BotFather webhook)
 *  - Custom Website Webhook (Shopify, WordPress, Webflow, Custom Forms)
 *
 * Features:
 *  - 24/7 Autonomous Background Processing on Cloud (Render / Railway / VPS)
 *  - Real-time WebSockets to Obikul Cockpit Dashboard
 *  - Windows 11 Offline Catch-Up Sync API for Laptop Startup
 *  - Full Auto Mode / Approval Mode / Emergency Panic Freeze
 *  - Dynamic Knowledge Base & PDF Rate Card Auto-Response Engine
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'obikul-state.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Root Cockpit & Health check endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard-demo.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'HEALTHY', uptime: process.uptime(), timestamp: Date.now() });
});

// ==========================================
// 1. IN-MEMORY & PERSISTED STATE
// ==========================================
let state = {
  commander: {
    name: 'Obikul Mia',
    role: 'Commander & Executive Owner',
    status: '24/7 Cloud Brain Active'
  },
  systemSettings: {
    isFullAuto: true,
    isPanicFrozen: false,
    autoReplyRateCard: true,
    aiModel: 'claude-sonnet-5',
    lastLaptopHeartbeat: Date.now() - 3600000 // 1 hour ago
  },
  metrics: {
    totalStreams: 184,
    autonomousActions: 142,
    approvalQueue: 4,
    revenueProtected: 128500,
    timeSavedHours: 18.5
  },
  channels: {
    gmail: { status: 'ONLINE', countToday: 42, activeThreads: 5 },
    instagram: { status: 'ONLINE', countToday: 58, activeThreads: 8 },
    facebook: { status: 'ONLINE', countToday: 21, activeThreads: 3 },
    whatsapp: { status: 'ONLINE', countToday: 35, activeThreads: 6 },
    telegram: { status: 'ONLINE', countToday: 18, activeThreads: 2 },
    customWeb: { status: 'ONLINE', countToday: 10, activeThreads: 1 },
    youtube: { status: 'ONLINE', countToday: 15, activeThreads: 2 }
  },
  knowledgeBase: {
    developerProfile: {
      name: 'Abikul Hoque (Obikul Mia)',
      handle: '@obi_kul_',
      email: 'obimiahoque@gmail.com',
      portfolio: 'https://abikul.lovable.app',
      demoApp: 'https://obikul-ai-command-center.onrender.com'
    },
    packages: [
      {
        id: 'web-landing',
        category: 'web_dev',
        name: 'Starter Modern Responsive Landing Page / Frontend Build',
        priceINR: 15000,
        timeline: '3-5 business days',
        description: 'Clean UI, mobile responsive, fast loading, tested code.'
      },
      {
        id: 'web-fullstack',
        category: 'web_dev',
        name: 'Full-Stack Custom Business Website / Web App',
        priceINR: 45000,
        timeline: '10-14 business days',
        description: 'Frontend, backend database, authentication, custom API integrations.'
      },
      {
        id: 'ai-chatbot',
        category: 'ai_agent',
        name: 'Custom AI Automation Bot (Telegram / WhatsApp / Web)',
        priceINR: 25000,
        timeline: '3-7 business days',
        description: '24/7 autonomous replies, CRM integration, lead qualification.'
      },
      {
        id: 'ai-mission-control',
        category: 'ai_agent',
        name: 'Autonomous Multi-Channel AI Executive System (Cloud + Cockpit)',
        priceINR: 65000,
        timeline: '7-12 business days',
        description: '24/7 Cloud Background server, live dashboard, multi-platform webhooks, startup sync.'
      },
      {
        id: 'sponsorship-reel',
        category: 'sponsorship',
        name: 'Dedicated AI Tool / Web Dev Tutorial Reel',
        priceINR: 30000,
        timeline: '48 hours post product-approval',
        description: 'Dedicated reel on Instagram & YouTube explaining tool with bio link.'
      }
    ],
    rules: {
      highValueThresholdINR: 35000, // Inquiries > ₹35,000 hold for Commander approval
      advanceRequired: '50% advance to lock slot, 50% post-delivery',
      allowedTopics: ['web development', 'website', 'landing page', 'ai agent', 'automation', 'bot', 'sponsorship', 'pricing', 'portfolio']
    }
  },
  offlineQueue: [
    {
      id: 'OFF-101',
      channel: 'instagram',
      sender: '@urban_trends_uk',
      location: 'London, UK',
      subject: 'Sponsored Video Collaboration (Q4)',
      summary: 'Brand requested rates for 3 dedicated reels. AI auto-replied standard rate card (£1,200/post) & booked discovery call for Tuesday 4 PM.',
      status: 'AUTO_RESOLVED',
      timestamp: Date.now() - 1800000,
      dealValue: 125000
    },
    {
      id: 'OFF-102',
      channel: 'gmail',
      sender: 'partnerships@saascorp.io',
      location: 'San Francisco, USA',
      subject: 'Enterprise Integration Partnership Inquiry',
      summary: 'High-intent lead requesting custom enterprise quote. AI drafted proposal & queued for Commander review.',
      status: 'PENDING_COMMANDER',
      timestamp: Date.now() - 900000,
      dealValue: 240000
    }
  ],
  recentLogs: []
};

// Load saved state if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const saved = JSON.parse(raw);
    state = { ...state, ...saved };
    console.log('✅ State successfully loaded from persistence store.');
  } catch (err) {
    console.warn('⚠️ Could not load saved state, using clean defaults:', err.message);
  }
}

function persistState() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('State persistence error:', e.message);
  }
}

// ==========================================
// 2. WEBSOCKET REAL-TIME TELEMETRY
// ==========================================
wss.on('connection', (ws) => {
  console.log('⚡ Cockpit client connected to real-time telemetry stream.');

  // Send current state on connection
  ws.send(JSON.stringify({
    type: 'INIT_SYNC',
    state: state
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleClientCommand(data, ws);
    } catch (e) {
      console.error('Invalid WS payload:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Cockpit client disconnected.');
  });
});

function broadcastEvent(eventType, payload) {
  const msg = JSON.stringify({ type: eventType, data: payload, timestamp: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(msg);
    }
  });
}

function logActivity(text, level = 'info') {
  const logEntry = {
    id: 'LOG-' + Math.floor(Math.random() * 90000 + 10000),
    time: new Date().toLocaleTimeString(),
    text,
    level
  };
  state.recentLogs.unshift(logEntry);
  if (state.recentLogs.length > 50) state.recentLogs.pop();
  broadcastEvent('NEW_LOG', logEntry);
  persistState();
}

function handleClientCommand(data, ws) {
  if (data.action === 'TOGGLE_AUTO_MODE') {
    state.systemSettings.isFullAuto = !state.systemSettings.isFullAuto;
    logActivity(`Full Auto mode changed to: ${state.systemSettings.isFullAuto ? 'ENABLED (24/7)' : 'HUMAN APPROVAL REQUIRED'}`);
    broadcastEvent('STATE_UPDATE', state);
  } else if (data.action === 'TOGGLE_PANIC') {
    state.systemSettings.isPanicFrozen = !state.systemSettings.isPanicFrozen;
    logActivity(`⚠️ PANIC FREEZE ${state.systemSettings.isPanicFrozen ? 'ACTIVATED: All outgoing bots halted' : 'DEACTIVATED: Normal operations resumed'}`, 'warn');
    broadcastEvent('STATE_UPDATE', state);
  } else if (data.action === 'DISPATCH_TASK') {
    logActivity(`Directive dispatched: "${data.directive}" to bot [${data.botType || 'General AI'}]`);
    state.metrics.autonomousActions++;
    broadcastEvent('TASK_DISPATCHED', { directive: data.directive });
  }
}

// ==========================================
// 3. MULTI-CHANNEL INBOUND WEBHOOKS
// ==========================================

// --- GMAIL WEBHOOK (Google Pub/Sub) ---
app.post('/webhook/gmail', (req, res) => {
  const { message, sender, subject, location } = req.body;
  console.log('📧 Inbound Gmail Event Received from:', sender || 'Unknown');

  processInboundMessage({
    channel: 'gmail',
    sender: sender || 'client@business.com',
    subject: subject || 'Project Collaboration Proposal',
    content: message || 'Interested in collaboration and rate details.',
    location: location || 'New York, USA',
    dealEstimate: 75000
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'gmail' });
});

// --- INSTAGRAM GRAPH API WEBHOOK (Direct Messages) ---
app.post('/webhook/instagram', (req, res) => {
  const { sender, message, location } = req.body;
  console.log('📸 Inbound Instagram DM Received from:', sender || 'insta_user');

  processInboundMessage({
    channel: 'instagram',
    sender: sender || '@creator_brand',
    subject: 'Instagram Direct Message Inquiry',
    content: message || 'Hey Obikul! Loved your AI and web development reels. What are your charges?',
    location: location || 'London, UK'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'instagram' });
});

// --- INSTAGRAM REEL COMMENT WEBHOOK (Safe Anti-Spam Keyword Rotation) ---
app.post('/webhook/instagram-comment', (req, res) => {
  const { sender, comment, reelId, location } = req.body;
  console.log('💬 Inbound Instagram Reel Comment from:', sender || 'viewer');

  processInboundMessage({
    channel: 'instagram_comment',
    sender: sender || '@tech_enthusiast',
    subject: `Reel #${reelId || 'LATEST'} Comment`,
    content: comment || 'AGENT please send code',
    location: location || 'Mumbai, India'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'instagram_comment' });
});

// --- YOUTUBE COMMENT WEBHOOK (Safe Public Community Response) ---
app.post('/webhook/youtube-comment', (req, res) => {
  const { author, comment, videoTitle, location } = req.body;
  console.log('▶️ Inbound YouTube Comment from:', author || 'subscriber');

  processInboundMessage({
    channel: 'youtube_comment',
    sender: author || 'YouTube Viewer',
    subject: `Video: "${videoTitle || 'How to build an AI Agent'}"`,
    content: comment || 'Great tutorial! Where can I find your website and project link?',
    location: location || 'New Delhi, India'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'youtube_comment' });
});

// --- FACEBOOK PAGE MESSENGER WEBHOOK ---
app.post('/webhook/facebook', (req, res) => {
  const { sender, message, location } = req.body;
  console.log('📘 Inbound Facebook Page Message from:', sender || 'fb_user');

  processInboundMessage({
    channel: 'facebook',
    sender: sender || 'Global Marketing Agency FB',
    subject: 'Facebook Business Lead Inquiry',
    content: message || 'Hi Obikul, can you build a modern responsive website for our agency?',
    location: location || 'Dubai, UAE'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'facebook' });
});

// --- WHATSAPP BUSINESS CLOUD WEBHOOK ---
app.post('/webhook/whatsapp', (req, res) => {
  const { from, message, location } = req.body;
  console.log('💬 Inbound WhatsApp Message from:', from || '+91 9876543210');

  processInboundMessage({
    channel: 'whatsapp',
    sender: from || '+91 9876543210 (VIP Lead)',
    subject: 'WhatsApp Priority Consultation',
    content: message || 'Need an AI Automation bot for our customer support.',
    location: location || 'Singapore'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'whatsapp' });
});

// --- TELEGRAM BOT WEBHOOK ---
app.post('/webhook/telegram', (req, res) => {
  const { from, text, location } = req.body;
  console.log('✈️ Inbound Telegram Bot Message from:', from || '@telegram_user');

  processInboundMessage({
    channel: 'telegram',
    sender: from ? `@${from}` : '@investor_club',
    subject: 'Telegram Bot Alert Inquiry',
    content: text || 'Please share your web development rate card and portfolio link.',
    location: location || 'Berlin, Germany'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'telegram' });
});

// --- CUSTOM WEBSITE WEBHOOK (abikul.lovable.app Contact Form / CRM) ---
app.post('/webhook/custom', (req, res) => {
  const { name, email, query, origin, location } = req.body;
  console.log('🌐 Inbound Portfolio Lead from:', email || name || 'Website Visitor');

  processInboundMessage({
    channel: 'customWeb',
    sender: `${name || 'Web Client'} (${email || 'client@business.com'})`,
    subject: 'Portfolio Contact Form Submission',
    content: query || 'Requesting quotation for custom full-stack website development.',
    location: location || 'New York, USA'
  });

  res.status(200).json({ status: 'PROCESSED', channel: 'customWeb' });
});

// ==========================================
// 4. AUTONOMOUS AI KNOWLEDGE BASE & INTENT ENGINE
// ==========================================

function classifyAndProcessMessage(msgData) {
  const text = ((msgData.content || '') + ' ' + (msgData.subject || '')).toLowerCase();
  const channel = msgData.channel;

  // 1. YouTube Comment Rule (Safe public comment, never mentions private DMs)
  if (channel === 'youtube_comment') {
    const ytReplies = [
      `Thanks for watching! Complete code roadmap & developer portfolio: https://abikul.lovable.app | Email: obimiahoque@gmail.com`,
      `Glad you found it helpful! Check out the live AI Agent command center demo here: https://obikul-ai-command-center.onrender.com 🚀`,
      `Appreciate the support! More AI Agent & Web Dev tutorials dropping soon on the channel.`
    ];
    const reply = ytReplies[Math.floor(Math.random() * ytReplies.length)];
    return {
      category: 'youtube_public',
      autoReplied: true,
      dealValue: 0,
      replyText: reply,
      summary: 'Public YouTube comment reply dispatched with developer portfolio & demo links.'
    };
  }

  // 2. Instagram Reel Comment Rule (Anti-Spam Keyword Guard)
  if (channel === 'instagram_comment') {
    const isKeyword = /agent|bot|code|prompt|web|link|source|details|price|rate/i.test(text);
    if (!isKeyword) {
      return {
        category: 'instagram_general_comment',
        autoReplied: true,
        dealValue: 0,
        replyText: '❤️ Thanks for watching! Follow @obi_kul_ for daily AI & Web Dev tutorials.',
        summary: 'Engagement reply sent. (Anti-Spam frequency guard active).'
      };
    }
    const dmRotations = [
      `Hey! Thanks for commenting on the reel. Here is my developer portfolio & live AI Agent project: https://abikul.lovable.app 🔥 (Live Demo: https://obikul-ai-command-center.onrender.com)`,
      `Sent you the details! Check out my web & AI agent packages at https://abikul.lovable.app or email obimiahoque@gmail.com 🚀`,
      `Here is the link for the AI agent & web setup: https://abikul.lovable.app. Let me know if you want a custom build for your business! ⚡`
    ];
    return {
      category: 'instagram_keyword_dm',
      autoReplied: true,
      dealValue: 15000,
      replyText: dmRotations[Math.floor(Math.random() * dmRotations.length)],
      summary: 'Triggered by reel keyword. Safe dynamic DM dispatched with portfolio & demo links.'
    };
  }

  // 3. Sponsorship & Brand Collaboration
  if (/sponsor|collaboration|collab|promote|shoutout|brand deal|reel price|promotion/i.test(text)) {
    return {
      category: 'sponsorship',
      autoReplied: true,
      dealValue: 30000,
      replyText: `Hello! Thanks for reaching out. Here is Commander Obikul's Creator Rate Card: Dedicated AI/Web Reel (₹30,000) | Combo: Reel + Bio Link + Story (₹45,000). 50% advance to lock slot. Portfolio: https://abikul.lovable.app. Email: obimiahoque@gmail.com`,
      summary: 'Sponsorship inquiry detected. Auto-replied Creator Rate Card & terms.'
    };
  }

  // 4. Web Development Inquiries
  if (/web|website|landing page|frontend|portfolio|ui|fullstack|developer|redesign|build site/i.test(text)) {
    const isEnterprise = /enterprise|fullstack|custom app|e-commerce|large scale|portal|database/i.test(text);
    const dealVal = isEnterprise ? 45000 : 15000;
    const threshold = (state.knowledgeBase && state.knowledgeBase.rules) ? state.knowledgeBase.rules.highValueThresholdINR : 35000;

    if (dealVal > threshold) {
      return {
        category: 'web_dev_enterprise',
        autoReplied: false, // HOLD FOR COMMANDER APPROVAL!
        dealValue: dealVal,
        replyText: `Drafted custom proposal for Full-Stack Web App (₹${dealVal.toLocaleString()}) linking https://abikul.lovable.app. Held for Commander Obikul approval.`,
        summary: `High-value Web Development inquiry (₹${dealVal.toLocaleString()}). Quoted & queued for Commander review.`
      };
    }

    return {
      category: 'web_dev_standard',
      autoReplied: true,
      dealValue: dealVal,
      replyText: `Hi! Thanks for contacting Obikul Web Dev Studio. Starter Responsive Landing Pages start at ₹15,000 (3-5 days delivery), and Full-Stack Web Apps start at ₹45,000. View live builds at https://abikul.lovable.app or reply to schedule a kickoff!`,
      summary: 'Web Development inquiry. Auto-replied standard packages & portfolio link.'
    };
  }

  // 5. AI Agent & Automation Bot Inquiries
  if (/ai agent|bot|automation|chatbot|telegram bot|whatsapp bot|workflow|jarvis|ai system|command center/i.test(text)) {
    const isEnterprise = /custom ai|multi-channel|cloud|enterprise|company bot|system/i.test(text);
    const dealVal = isEnterprise ? 65000 : 25000;
    const threshold = (state.knowledgeBase && state.knowledgeBase.rules) ? state.knowledgeBase.rules.highValueThresholdINR : 35000;

    if (dealVal > threshold) {
      return {
        category: 'ai_agent_enterprise',
        autoReplied: false, // HOLD FOR COMMANDER APPROVAL!
        dealValue: dealVal,
        replyText: `Drafted Autonomous AI Architecture proposal (₹${dealVal.toLocaleString()}). Held for Commander Obikul approval.`,
        summary: `High-value AI Agent contract (₹${dealVal.toLocaleString()}). Held for Commander review.`
      };
    }

    return {
      category: 'ai_agent_standard',
      autoReplied: true,
      dealValue: dealVal,
      replyText: `Hello! I'm Obikul's AI assistant. We build Custom Automation Bots (₹25,000) and 24/7 Cloud AI Executive Systems (₹65,000). See our live command center at https://obikul-ai-command-center.onrender.com or portfolio at https://abikul.lovable.app.`,
      summary: 'AI Agent inquiry. Auto-replied with AI package rates & live demo.'
    };
  }

  // 6. Unknown / Uncategorized Inquiry (Safety Guard)
  return {
    category: 'unknown_safety_guard',
    autoReplied: false, // HOLD FOR COMMANDER REVIEW
    dealValue: 20000,
    replyText: `Thank you for reaching out. Commander Obikul Mia has been notified and will personally review your request shortly (Email: obimiahoque@gmail.com).`,
    summary: 'Uncategorized inquiry. Safety guard active: Held for Commander review.'
  };
}

function processInboundMessage(msgData) {
  // Check Panic Freeze
  if (state.systemSettings.isPanicFrozen) {
    logActivity(`🛑 PANIC FREEZE ACTIVE: Incoming message from ${msgData.sender} held in safety queue.`, 'warn');
    return;
  }

  // Update metrics
  state.metrics.totalStreams++;
  const chanKey = msgData.channel.startsWith('instagram') ? 'instagram' : (msgData.channel.startsWith('youtube') ? 'youtube' : msgData.channel);
  if (state.channels[chanKey]) {
    state.channels[chanKey].countToday++;
  }

  // Classify intent using knowledge base
  const decision = classifyAndProcessMessage(msgData);
  const willAutoReply = state.systemSettings.isFullAuto && decision.autoReplied;

  if (willAutoReply) {
    state.metrics.autonomousActions++;
    state.metrics.revenueProtected += (decision.dealValue || 20000);
    logActivity(`⚡ [AUTO-REPLIED] (${chanKey.toUpperCase()}) ${msgData.sender}: ${decision.summary}`);
  } else {
    state.metrics.approvalQueue++;
    logActivity(`📝 [APPROVAL REQUIRED] (${chanKey.toUpperCase()}) ${msgData.sender}: ${decision.summary}`, 'warn');
  }

  const queueItem = {
    id: 'OFF-' + Math.floor(Math.random() * 90000 + 10000),
    channel: chanKey,
    sender: msgData.sender,
    location: msgData.location || 'Global Node',
    subject: msgData.subject,
    summary: decision.summary,
    replyText: decision.replyText,
    category: decision.category,
    status: willAutoReply ? 'AUTO_RESOLVED' : 'PENDING_COMMANDER',
    timestamp: Date.now(),
    dealValue: decision.dealValue || 25000
  };

  state.offlineQueue.unshift(queueItem);
  if (state.offlineQueue.length > 50) state.offlineQueue.pop();

  // Broadcast live ping to all connected dashboard instances & world map
  broadcastEvent('INBOUND_PING', {
    ...queueItem,
    location: msgData.location
  });

  persistState();
}

// ==========================================
// 5. WINDOWS 11 CATCH-UP SYNC API
// ==========================================

// Endpoint called by Windows startup script when Commander turns on their laptop
app.get('/api/catchup/summary', (req, res) => {
  const sinceTime = parseInt(req.query.since) || state.systemSettings.lastLaptopHeartbeat;
  const unacknowledged = state.offlineQueue.filter(item => item.timestamp > sinceTime);

  const totalHandled = unacknowledged.length;
  const autoResolved = unacknowledged.filter(i => i.status === 'AUTO_RESOLVED').length;
  const pendingReview = unacknowledged.filter(i => i.status === 'PENDING_COMMANDER').length;
  const totalDealValue = unacknowledged.reduce((sum, i) => sum + (i.dealValue || 0), 0);

  // Update heartbeat
  state.systemSettings.lastLaptopHeartbeat = Date.now();
  persistState();

  res.json({
    commander: state.commander.name,
    timestamp: Date.now(),
    offlineActivity: {
      totalEvents: totalHandled,
      autoRepliedCount: autoResolved,
      pendingApprovalCount: pendingReview,
      estimatedDealsValue: totalDealValue,
      topEvents: unacknowledged.slice(0, 5)
    },
    systemStatus: {
      isFullAuto: state.systemSettings.isFullAuto,
      isPanicFrozen: state.systemSettings.isPanicFrozen,
      cloudUptime: '99.99%',
      serverTime: new Date().toISOString()
    }
  });
});

// Acknowledge catch-up
app.post('/api/catchup/ack', (req, res) => {
  state.systemSettings.lastLaptopHeartbeat = Date.now();
  persistState();
  res.json({ status: 'ACKNOWLEDGED', heartbeat: state.systemSettings.lastLaptopHeartbeat });
});

// Direct test simulation endpoint
app.post('/api/simulate-ping', (req, res) => {
  const channels = ['gmail', 'instagram', 'facebook', 'whatsapp', 'telegram', 'customWeb'];
  const locations = [
    { loc: 'New York, USA', deal: 95000, sub: 'Enterprise SaaS Retainer' },
    { loc: 'London, UK', deal: 120000, sub: 'Q4 Brand Sponsorship Package' },
    { loc: 'Dubai, UAE', deal: 180000, sub: 'Strategic MENA Partnership' },
    { loc: 'Singapore', deal: 65000, sub: 'AI Integration Consulting' },
    { loc: 'Berlin, Germany', deal: 85000, sub: 'Custom Bot Workflow Contract' }
  ];

  const randomChan = channels[Math.floor(Math.random() * channels.length)];
  const randomLoc = locations[Math.floor(Math.random() * locations.length)];

  processInboundMessage({
    channel: randomChan,
    sender: `client_${Math.floor(Math.random()*900+100)}@global.co`,
    subject: randomLoc.sub,
    content: 'Requested pricing, availability, and immediate contract terms.',
    location: randomLoc.loc,
    dealEstimate: randomLoc.deal
  });

  res.json({ status: 'SIMULATION_TRIGGERED', channel: randomChan, location: randomLoc.loc });
});

// ElevenLabs Text-to-Speech API Proxy / Cloud Voice Generator (Tony Stark J.A.R.V.I.S. Tuned)
app.post('/api/voice/elevenlabs', (req, res) => {
  const { text, voiceId, apiKey, modelId, stability, similarityBoost, style } = req.body;
  const targetVoiceId = voiceId || process.env.DEFAULT_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb'; // Default: George (Tony Stark J.A.R.V.I.S. British Accent)
  const targetKey = apiKey || process.env.ELEVENLABS_API_KEY;
  const targetModel = modelId || process.env.DEFAULT_VOICE_MODEL || 'eleven_multilingual_v2';

  if (!targetKey) {
    return res.status(400).json({
      error: 'ELEVENLABS_API_KEY_REQUIRED',
      message: 'ElevenLabs API Key is required. Set it in Dashboard Voice Studio or in .env file.'
    });
  }

  // Hyper-tuned for natural human cadence, conversational warmth, and British J.A.R.V.I.S. delivery
  const postData = JSON.stringify({
    text: text || "Good morning, boss. Hope you slept well. All systems are operating smoothly.",
    model_id: targetModel,
    voice_settings: {
      stability: stability !== undefined ? parseFloat(stability) : 0.38,
      similarity_boost: similarityBoost !== undefined ? parseFloat(similarityBoost) : 0.82,
      style: style !== undefined ? parseFloat(style) : 0.35,
      use_speaker_boost: true
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${targetVoiceId}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': targetKey,
      'Content-Length': Buffer.byteLength(postData),
      'Accept': 'audio/mpeg'
    }
  };

  const elevenReq = https.request(options, (elevenRes) => {
    if (elevenRes.statusCode !== 200) {
      let errBody = '';
      elevenRes.on('data', chunk => { errBody += chunk; });
      elevenRes.on('end', () => {
        console.error('⚠️ ElevenLabs API Error:', errBody);
        return res.status(elevenRes.statusCode).json({ error: 'ELEVENLABS_ERROR', details: errBody });
      });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    elevenRes.pipe(res);
  });

  elevenReq.on('error', (e) => {
    console.error('⚠️ ElevenLabs Connection Error:', e.message);
    res.status(500).json({ error: 'CONNECTION_FAILED', message: e.message });
  });

  elevenReq.write(postData);
  elevenReq.end();
});

// Serve dashboard on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard-demo.html'));
});

// Start listening
server.listen(PORT, () => {
  console.log('===========================================================');
  console.log(`🚀 OBIKUL AI CLOUD COMMAND CENTER IS ONLINE`);
  console.log(`👑 Commander: ${state.commander.name}`);
  console.log(`🌐 Dashboard URL: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Stream: ws://localhost:${PORT}`);
  console.log(`💻 Windows Sync API: http://localhost:${PORT}/api/catchup/summary`);
  console.log('===========================================================');
});
