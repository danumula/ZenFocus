/* ==========================================================================
   ZenFocus — Premium Ambient Logic & Procedural Audio Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. GLOBAL STATE & UI SELECTIONS
  // ==========================================================================
  const UI = {
    overlay: document.getElementById('audio-consent-overlay'),
    btnEnter: document.getElementById('btn-enter'),
    clockTime: document.getElementById('clock-time'),
    clockDate: document.getElementById('clock-date'),
    btnMonkToggle: document.getElementById('btn-monk-toggle'),
    
    // Pomodoro Elements
    timerTime: document.getElementById('timer-time'),
    timerStatus: document.getElementById('timer-status'),
    timerProgress: document.getElementById('timer-progress'),
    btnTimerToggle: document.getElementById('btn-timer-toggle'),
    btnTimerReset: document.getElementById('btn-timer-reset'),
    iconPlay: document.getElementById('icon-play'),
    iconPause: document.getElementById('icon-pause'),
    modeTabs: document.querySelectorAll('.mode-tab'),
    
    // Sound & Mixer Elements
    soundItems: document.querySelectorAll('.sound-item'),
    presetButtons: document.querySelectorAll('.btn-preset'),
    btnMuteAll: document.querySelector('.text-preset'),
    mixSlots: document.querySelectorAll('.btn-custom'),
    btnSaveMix: document.getElementById('btn-save-mix'),
    
    // Binaural Controls
    binauralTabs: document.querySelectorAll('.wave-tab'),
    binauralSlider: document.getElementById('binaural-slider'),
    
    // Zen Breathing Coach Elements
    breathCircle: document.getElementById('breath-circle'),
    breathGlow: document.getElementById('breath-glow'),
    breathTimerVal: document.getElementById('breath-timer-val'),
    breathInstruction: document.getElementById('breath-instruction'),
    btnBreathToggle: document.getElementById('btn-breath-toggle'),
    
    // Kanban Desk Tab and Panes
    deskTabs: document.querySelectorAll('.desk-tab'),
    paneTasks: document.getElementById('pane-tasks'),
    paneInsights: document.getElementById('pane-insights'),
    taskStatsDisplay: document.getElementById('task-stats-display'),
    
    // Kanban Elements
    taskForm: document.getElementById('task-form'),
    taskInput: document.getElementById('task-input'),
    taskPriority: document.getElementById('task-priority'),
    tasksCount: document.getElementById('tasks-count'),
    dragZones: document.querySelectorAll('.drag-zone'),
    listTodo: document.getElementById('list-todo'),
    listProgress: document.getElementById('list-progress'),
    listCompleted: document.getElementById('list-completed'),
    badgeTodo: document.getElementById('badge-todo'),
    badgeProgress: document.getElementById('badge-progress'),
    badgeCompleted: document.getElementById('badge-completed'),
    
    // Insights Section
    chartBarsContainer: document.getElementById('focus-chart-bars'),
    chartLabelsContainer: document.getElementById('focus-chart-labels'),
    milestonesSessionsCount: document.getElementById('milestones-sessions-count'),
    
    // Inspiration shelf
    quoteCardInner: document.getElementById('quote-card-inner'),
    btnNewQuote: document.getElementById('btn-new-quote'),
    btnNewQuoteBack: document.getElementById('btn-new-quote-back'),
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    quoteTextBack: document.getElementById('quote-text-back'),
    quoteAuthorBack: document.getElementById('quote-author-back'),
    
    // Journal Elements
    journalInput: document.getElementById('journal-input'),
    journalSaved: document.getElementById('journal-saved')
  };

  // State Management
  const STATE = {
    audioInitialized: false,
    monkMode: false,
    selectedMixSlot: null,
    particleSpeedMultiplier: 1.0,
    timer: {
      intervalId: null,
      duration: 1500, // Default 25 minutes
      remaining: 1500,
      mode: 'focus', // focus, short, long
      isRunning: false
    },
    breathing: {
      isRunning: false,
      intervalId: null,
      phaseTimer: null,
      phase: 0, // 0: inhale, 1: hold full, 2: exhale, 3: hold empty
      timeRemaining: 4
    },
    binaural: {
      type: 'off', // off, alpha, theta
      volume: 30
    },
    tasks: [],
    stats: {
      sessions: [], // array of focus timestamps
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0] // aggregated focus minutes past 7 days
    },
    quotes: [
      { text: "Simplify your workflow, then amplify your mind.", author: "ZenFocus Wisdom" },
      { text: "Focus is a muscle, and silence is its gym.", author: "Deep Mind" },
      { text: "Deep work is not a chore; it is an act of self-respect.", author: "Cal Newport" },
      { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
      { text: "Within clutter, find simplicity. From discord, find harmony.", author: "Albert Einstein" },
      { text: "The noise of the world is quieted when the focus of the self is absolute.", author: "Marcus Aurelius" },
      { text: "Flow is the elegant alignment of intention and execution.", author: "Mihaly Csikszentmihalyi" }
    ],
    currentQuoteIndex: 0,
    mouse: { x: null, y: null }
  };

  // ==========================================================================
  // 2. INTERACTIVE PARTICLES CANVAS BACKGROUND
  // ==========================================================================
  const initCanvasBackground = () => {
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 45;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.3 + 0.1;
      }
      
      update() {
        // Particles run extremely slow in Monk Mode
        this.x += this.speedX * STATE.particleSpeedMultiplier;
        this.y += this.speedY * STATE.particleSpeedMultiplier;
        
        // Bounce on borders
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        // Mouse reaction (subtle attraction, disabled or slowed in Monk Mode)
        if (STATE.mouse.x !== null && STATE.mouse.y !== null) {
          const dx = STATE.mouse.x - this.x;
          const dy = STATE.mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180) {
            const force = (180 - distance) / 180;
            this.x += (dx / distance) * force * 0.6 * STATE.particleSpeedMultiplier;
            this.y += (dy / distance) * force * 0.6 * STATE.particleSpeedMultiplier;
          }
        }
      }
      
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Color shifts depending on Monk Mode
        if (STATE.monkMode) {
          ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha * 0.7})`; // Soft violet
          ctx.shadowBlur = this.size;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.2)';
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`; // Premium purple
          ctx.shadowBlur = this.size * 2;
          ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
        }
        
        ctx.fill();
        ctx.restore();
      }
    }
    
    const setupParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a soft glowing gradient at mouse position (only if not in Monk Mode)
      if (STATE.mouse.x !== null && STATE.mouse.y !== null && !STATE.monkMode) {
        const glowGrad = ctx.createRadialGradient(
          STATE.mouse.x, STATE.mouse.y, 10,
          STATE.mouse.x, STATE.mouse.y, 250
        );
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.05)'); // indigo glow
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', (e) => {
      STATE.mouse.x = e.clientX;
      STATE.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      STATE.mouse.x = null;
      STATE.mouse.y = null;
    });
    
    setupParticles();
    animate();
  };

  // ==========================================================================
  // 3. CLOCK WIDGET LOGIC
  // ==========================================================================
  const updateClock = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    
    UI.clockTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
    UI.clockDate.textContent = now.toLocaleDateString('en-US', dateOptions);
  };
  setInterval(updateClock, 1000);
  updateClock();

  // ==========================================================================
  // 4. PROCEDURAL AMBIENT AUDIO SYNTHESIZERS (WEB AUDIO API)
  // ==========================================================================
  const AUDIO = {
    ctx: null,
    masterGain: null,
    synths: {
      rain: null,
      waves: null,
      birds: null,
      drone: null,
      binaural: null,
      breathing: null
    },
    
    // Creates a noise buffer filled with white noise values
    createNoiseBuffer() {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      return noiseBuffer;
    },
    
    init() {
      if (STATE.audioInitialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        // Master Limiter to avoid clipping
        const limiter = this.ctx.createDynamicsCompressor();
        limiter.threshold.setValueAtTime(-1, this.ctx.currentTime);
        limiter.knee.setValueAtTime(4, this.ctx.currentTime);
        limiter.ratio.setValueAtTime(20, this.ctx.currentTime);
        limiter.attack.setValueAtTime(0.005, this.ctx.currentTime);
        limiter.release.setValueAtTime(0.05, this.ctx.currentTime);
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        
        this.masterGain.connect(limiter);
        limiter.connect(this.ctx.destination);
        
        // Build individual synth units
        this.buildRainSynth();
        this.buildWavesSynth();
        this.buildBirdsSynth();
        this.buildDroneSynth();
        
        // Build new dynamic premium synthesizers
        this.buildBinauralSynth();
        this.buildBreathingSynth();
        
        STATE.audioInitialized = true;
        console.log("Web Audio Context and procedurals initialized successfully.");
      } catch(err) {
        console.error("Failed to initialize audio: ", err);
      }
    },
    
    // A. Ambient Rain Synthesizer
    buildRainSynth() {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime); // Start silent
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start();
      
      // Crackle generator for rain drops (high pass pops)
      let crackleInterval = null;
      const playCrackle = () => {
        if (gain.gain.value === 0) return;
        
        // Occasional drops
        const dropletCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < dropletCount; i++) {
          const osc = this.ctx.createOscillator();
          const dropFilter = this.ctx.createBiquadFilter();
          const dropGain = this.ctx.createGain();
          
          osc.type = 'sine';
          // Filter drops
          dropFilter.type = 'bandpass';
          dropFilter.frequency.setValueAtTime(Math.random() * 3000 + 1500, this.ctx.currentTime);
          dropFilter.Q.setValueAtTime(10, this.ctx.currentTime);
          
          const now = this.ctx.currentTime;
          // Impulsive click envelope
          dropGain.gain.setValueAtTime(0, now);
          dropGain.gain.linearRampToValueAtTime(0.04 * gain.gain.value, now + 0.002);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.random() * 0.03 + 0.01);
          
          osc.frequency.setValueAtTime(Math.random() * 2000 + 1000, now);
          
          osc.connect(dropFilter);
          dropFilter.connect(dropGain);
          dropGain.connect(this.masterGain);
          
          osc.start(now);
          osc.stop(now + 0.1);
        }
      };
      
      crackleInterval = setInterval(playCrackle, 120);
      
      this.synths.rain = {
        gainNode: gain,
        nodes: [noise, filter, gain],
        active: false,
        interval: crackleInterval
      };
    },
    
    // B. Ocean Waves Synthesizer
    buildWavesSynth() {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      // Sweep filter cutoff up and down slowly using LFO
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12 seconds per wave period
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // Depth of sweep
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency); // Connect LFO to center frequency (250Hz - 750Hz sweep range)
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      
      // Dynamic sweep for volume as waves rise/fall
      const volLfo = this.ctx.createOscillator();
      volLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      
      const volLfoGain = this.ctx.createGain();
      volLfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      
      const waveMasterGain = this.ctx.createGain();
      waveMasterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      
      // Connect
      noise.connect(filter);
      filter.connect(waveMasterGain);
      waveMasterGain.connect(gain);
      gain.connect(this.masterGain);
      
      // Modulate waves volume slightly via LFO
      volLfo.connect(volLfoGain);
      volLfoGain.connect(waveMasterGain.gain);
      
      noise.start();
      lfo.start();
      volLfo.start();
      
      this.synths.waves = {
        gainNode: gain,
        nodes: [noise, filter, gain, lfo, lfoGain, volLfo, volLfoGain, waveMasterGain],
        active: false
      };
    },
    
    // C. Forest Birds Synthesizer (Random Tweets)
    buildBirdsSynth() {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.connect(this.masterGain);
      
      const playTweet = () => {
        if (!this.synths.birds || !this.synths.birds.active || gain.gain.value === 0) return;
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const tweetGain = this.ctx.createGain();
        
        osc.type = 'sine';
        tweetGain.connect(gain);
        osc.connect(tweetGain);
        
        // Random bird patterns (chirps)
        const mode = Math.floor(Math.random() * 3);
        if (mode === 0) {
          osc.frequency.setValueAtTime(3200, now);
          osc.frequency.exponentialRampToValueAtTime(3800, now + 0.04);
          osc.frequency.exponentialRampToValueAtTime(2800, now + 0.08);
          
          tweetGain.gain.setValueAtTime(0, now);
          tweetGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
          tweetGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
          
          setTimeout(() => {
            if (!this.synths.birds.active) return;
            const now2 = this.ctx.currentTime;
            const osc2 = this.ctx.createOscillator();
            const tweetGain2 = this.ctx.createGain();
            osc2.type = 'sine';
            tweetGain2.connect(gain);
            osc2.connect(tweetGain2);
            
            osc2.frequency.setValueAtTime(3400, now2);
            osc2.frequency.exponentialRampToValueAtTime(4000, now2 + 0.04);
            osc2.frequency.exponentialRampToValueAtTime(3000, now2 + 0.08);
            
            tweetGain2.gain.setValueAtTime(0, now2);
            tweetGain2.gain.linearRampToValueAtTime(0.08, now2 + 0.01);
            tweetGain2.gain.exponentialRampToValueAtTime(0.0001, now2 + 0.08);
            
            osc2.start(now2);
            osc2.stop(now2 + 0.1);
          }, 120);
          
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (mode === 1) {
          osc.frequency.setValueAtTime(2400, now);
          osc.frequency.exponentialRampToValueAtTime(3400, now + 0.12);
          
          tweetGain.gain.setValueAtTime(0, now);
          tweetGain.gain.linearRampToValueAtTime(0.06, now + 0.02);
          tweetGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          
          osc.start(now);
          osc.stop(now + 0.15);
        } else {
          osc.frequency.setValueAtTime(3000, now);
          osc.frequency.linearRampToValueAtTime(3300, now + 0.03);
          osc.frequency.linearRampToValueAtTime(2800, now + 0.06);
          osc.frequency.linearRampToValueAtTime(3100, now + 0.09);
          osc.frequency.linearRampToValueAtTime(2500, now + 0.12);
          
          tweetGain.gain.setValueAtTime(0, now);
          tweetGain.gain.linearRampToValueAtTime(0.05, now + 0.01);
          tweetGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          
          osc.start(now);
          osc.stop(now + 0.15);
        }
      };
      
      const birdsInterval = setInterval(() => {
        if (Math.random() > 0.45) {
          playTweet();
        }
      }, 3500);
      
      this.synths.birds = {
        gainNode: gain,
        nodes: [gain],
        active: false,
        interval: birdsInterval
      };
    },
    
    // D. Focus Drone (Detuned Analog Triangles)
    buildDroneSynth() {
      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      
      oscA.type = 'triangle';
      oscB.type = 'triangle';
      
      oscA.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      oscB.frequency.setValueAtTime(55.4, this.ctx.currentTime); // detuned by 0.4Hz
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime); // 20s cycle
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // subtle volume weave
      
      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      
      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(gain);
      gain.connect(this.masterGain);
      
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      
      oscA.start();
      oscB.start();
      lfo.start();
      
      this.synths.drone = {
        gainNode: gain,
        nodes: [oscA, oscB, filter, gain, lfo, lfoGain, droneGain],
        active: false
      };
    },
    
    // E. Premium Binaural Beats Synthesizer (With isolated Stereo Panning)
    buildBinauralSynth() {
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      
      oscL.type = 'sine';
      oscR.type = 'sine';
      
      // Standard deep meditation frequencies (detuned slightly)
      oscL.frequency.setValueAtTime(150, this.ctx.currentTime); // Left: 150Hz
      oscR.frequency.setValueAtTime(150, this.ctx.currentTime); // Right starts at 150Hz (Off)
      
      const panL = this.ctx.createStereoPanner();
      const panR = this.ctx.createStereoPanner();
      
      panL.pan.setValueAtTime(-1, this.ctx.currentTime); // 100% Left Speaker
      panR.pan.setValueAtTime(1, this.ctx.currentTime);  // 100% Right Speaker
      
      const gainL = this.ctx.createGain();
      const gainR = this.ctx.createGain();
      gainL.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gainR.gain.setValueAtTime(0.5, this.ctx.currentTime);
      
      const binMasterGain = this.ctx.createGain();
      binMasterGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start muted
      
      // Connections
      oscL.connect(gainL);
      gainL.connect(panL);
      panL.connect(binMasterGain);
      
      oscR.connect(gainR);
      gainR.connect(panR);
      panR.connect(binMasterGain);
      
      binMasterGain.connect(this.masterGain);
      
      oscL.start();
      oscR.start();
      
      this.synths.binaural = {
        gainNode: binMasterGain,
        oscR: oscR,
        active: false
      };
    },
    
    // F. Zen Breathing Coach Ambient Synthesizer (Vocal Sweep Simulator)
    buildBreathingSynth() {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime); // starting hum pitch
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime); // low starting lowpass
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime); // start silent
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start();
      
      this.synths.breathing = {
        oscNode: osc,
        filterNode: filter,
        gainNode: gain,
        active: false
      };
    },
    
    // Synthesize a beautiful Metallic Meditation Bowl chime dynamically!
    playZenBowlChime() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const frequencies = [220, 442, 663, 885, 1105, 1330];
      const gains = [0.25, 0.15, 0.12, 0.08, 0.05, 0.02];
      
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.4, now + 0.01);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 3.0);
      
      chimeGain.connect(filter);
      filter.connect(this.masterGain);
      
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        oscGain.gain.setValueAtTime(gains[idx], now);
        osc.frequency.linearRampToValueAtTime(freq + (Math.random() * 2 - 1), now + 4.0);
        
        osc.connect(oscGain);
        oscGain.connect(chimeGain);
        
        osc.start(now);
        osc.stop(now + 6.0);
      });
    },
    
    // Toggle active soundscapes
    toggleSound(name, sliderValue) {
      if (!this.ctx) this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const synth = this.synths[name];
      if (!synth) return;
      
      synth.active = !synth.active;
      
      const now = this.ctx.currentTime;
      if (synth.active) {
        const vol = sliderValue / 100 * 0.75;
        synth.gainNode.gain.setValueAtTime(0, now);
        synth.gainNode.gain.linearRampToValueAtTime(vol, now + 0.5);
      } else {
        synth.gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      }
      
      return synth.active;
    },
    
    // Update volume level dynamically
    setVolume(name, value) {
      if (!this.ctx) return;
      const synth = this.synths[name];
      if (!synth) return;
      
      const vol = value / 100 * 0.75;
      const now = this.ctx.currentTime;
      
      if (synth.active) {
        synth.gainNode.gain.linearRampToValueAtTime(vol, now + 0.1);
      }
    },
    
    // Toggle Binaural waves
    setBinauralWave(waveType, volumePercent) {
      if (!this.ctx) this.init();
      const synth = this.synths.binaural;
      if (!synth) return;
      
      const now = this.ctx.currentTime;
      
      if (waveType === 'off') {
        synth.active = false;
        synth.gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      } else {
        synth.active = true;
        
        // Detuning frequency sets the beat inside the brain
        if (waveType === 'alpha') {
          synth.oscR.frequency.linearRampToValueAtTime(160, now + 0.2); // Left 150, Right 160 = 10Hz Alpha Focus
        } else if (waveType === 'theta') {
          synth.oscR.frequency.linearRampToValueAtTime(155, now + 0.2); // Left 150, Right 155 = 5Hz Theta Zen
        }
        
        // Map volume (soothing, max Binaural volume is capped lower for safety)
        const vol = volumePercent / 100 * 0.22;
        synth.gainNode.gain.setValueAtTime(synth.gainNode.gain.value, now);
        synth.gainNode.gain.linearRampToValueAtTime(vol, now + 0.5);
      }
    },
    
    // Smooth Breathing Audio Sweep mapping (Box Breathing Ambient Synth)
    sweepBreathingAudio(phase, durationSec) {
      const synth = this.synths.breathing;
      if (!synth || !synth.active) return;
      
      const now = this.ctx.currentTime;
      
      if (phase === 0) {
        // Inhale - sweep pitch UP, open filter, ramp volume up
        synth.gainNode.gain.linearRampToValueAtTime(0.2, now + durationSec);
        synth.oscNode.frequency.linearRampToValueAtTime(250, now + durationSec);
        synth.filterNode.frequency.linearRampToValueAtTime(650, now + durationSec);
      } else if (phase === 1) {
        // Hold full - keep steady at high focus humming
        synth.gainNode.gain.linearRampToValueAtTime(0.2, now + durationSec);
        synth.oscNode.frequency.setValueAtTime(250, now);
        synth.filterNode.frequency.setValueAtTime(650, now);
      } else if (phase === 2) {
        // Exhale - sweep pitch DOWN, close filter, ramp volume down
        synth.gainNode.gain.linearRampToValueAtTime(0.04, now + durationSec);
        synth.oscNode.frequency.linearRampToValueAtTime(140, now + durationSec);
        synth.filterNode.frequency.linearRampToValueAtTime(180, now + durationSec);
      } else if (phase === 3) {
        // Hold empty - silent, completely quiet base
        synth.gainNode.gain.linearRampToValueAtTime(0.0, now + durationSec);
      }
    }
  };

  // Soundscape slider and toggle handlers
  const setupSoundscapes = () => {
    UI.soundItems.forEach(item => {
      const id = item.id.replace('sound-', '');
      const toggleBtn = item.querySelector('.sound-toggle-btn');
      const slider = item.querySelector('.sound-slider');
      const progress = item.querySelector('.slider-progress');
      
      const updateSliderTrack = (val) => {
        progress.style.width = `${val}%`;
      };
      
      updateSliderTrack(slider.value);
      
      toggleBtn.addEventListener('click', () => {
        if (!STATE.audioInitialized) AUDIO.init();
        
        if (slider.value == 0) {
          slider.value = 50;
          updateSliderTrack(50);
        }
        
        const active = AUDIO.toggleSound(id, slider.value);
        if (active) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
        
        // Remove preset highlight if soundscape ratios are customized
        clearActivePresetHighlight();
      });
      
      slider.addEventListener('input', (e) => {
        const val = e.target.value;
        updateSliderTrack(val);
        
        if (val > 0 && !item.classList.contains('active')) {
          if (!STATE.audioInitialized) AUDIO.init();
          AUDIO.toggleSound(id, val);
          item.classList.add('active');
        } else if (val == 0 && item.classList.contains('active')) {
          AUDIO.toggleSound(id, 0);
          item.classList.remove('active');
        } else {
          AUDIO.setVolume(id, val);
        }
        clearActivePresetHighlight();
      });
    });
  };

  const clearActivePresetHighlight = () => {
    UI.presetButtons.forEach(btn => btn.classList.remove('active'));
  };

  // Space Entry handler (Browser Consent policy)
  UI.btnEnter.addEventListener('click', () => {
    UI.overlay.classList.add('hidden');
    AUDIO.init();
    
    // Set a cozy Focus Drone backing hum automatically
    setTimeout(() => {
      const droneItem = document.getElementById('sound-drone');
      const slider = droneItem.querySelector('.sound-slider');
      slider.value = 35;
      droneItem.querySelector('.slider-progress').style.width = '35%';
      AUDIO.toggleSound('drone', 35);
      droneItem.classList.add('active');
    }, 400);
  });

  // ==========================================================================
  // 5. NEW FOCUS FEATURE A: SOUNDSCAPE PRESETS & SAVERS
  // ==========================================================================
  const PRESET_RATIOS = {
    storm: { rain: 85, waves: 0, birds: 0, drone: 25 },
    sanctuary: { rain: 15, waves: 0, birds: 85, drone: 40 },
    ocean: { rain: 0, waves: 80, birds: 0, drone: 60 }
  };

  const applySoundscapePreset = (presetName) => {
    if (!STATE.audioInitialized) AUDIO.init();
    const ratios = PRESET_RATIOS[presetName];
    if (!ratios) return;
    
    UI.soundItems.forEach(item => {
      const id = item.id.replace('sound-', '');
      const targetVal = ratios[id];
      const slider = item.querySelector('.sound-slider');
      const progress = item.querySelector('.slider-progress');
      
      slider.value = targetVal;
      progress.style.width = `${targetVal}%`;
      
      // Determine if synth should be turned on or off
      const synth = AUDIO.synths[id];
      const now = AUDIO.ctx.currentTime;
      
      if (targetVal > 0) {
        item.classList.add('active');
        synth.active = true;
        AUDIO.setVolume(id, targetVal);
      } else {
        item.classList.remove('active');
        synth.active = false;
        synth.gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      }
    });
  };

  // Setup Presets Buttons click listeners
  UI.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      UI.presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applySoundscapePreset(btn.dataset.preset);
    });
  });

  // Mute All Button handler
  UI.btnMuteAll.addEventListener('click', () => {
    if (!STATE.audioInitialized) return;
    clearActivePresetHighlight();
    
    UI.soundItems.forEach(item => {
      const id = item.id.replace('sound-', '');
      const slider = item.querySelector('.sound-slider');
      const progress = item.querySelector('.slider-progress');
      
      slider.value = 0;
      progress.style.width = '0%';
      item.classList.remove('active');
      
      const synth = AUDIO.synths[id];
      synth.active = false;
      synth.gainNode.gain.linearRampToValueAtTime(0, AUDIO.ctx.currentTime + 0.4);
    });
  });

  // Custom Mix slots local storage integration
  const setupCustomMixes = () => {
    // Select Slot
    UI.mixSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        UI.mixSlots.forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
        STATE.selectedMixSlot = slot.dataset.slot;
        
        // Attempt load custom mix
        const mix = localStorage.getItem(`zenfocus_mix_${STATE.selectedMixSlot}`);
        if (mix) {
          try {
            const data = JSON.parse(mix);
            loadSoundscapeMix(data);
          } catch(err) {
            console.error("Failed parsing mix: ", err);
          }
        }
      });
    });

    // Save Mix
    UI.btnSaveMix.addEventListener('click', () => {
      if (!STATE.selectedMixSlot) {
        alert("Please click and select Slot 1, 2, or 3 first!");
        return;
      }
      
      const mixData = {};
      UI.soundItems.forEach(item => {
        const id = item.id.replace('sound-', '');
        mixData[id] = parseInt(item.querySelector('.sound-slider').value);
      });
      
      // Save binaural settings too!
      mixData['binauralType'] = STATE.binaural.type;
      mixData['binauralVolume'] = parseInt(UI.binauralSlider.value);
      
      localStorage.setItem(`zenfocus_mix_${STATE.selectedMixSlot}`, JSON.stringify(mixData));
      
      const activeSlotBtn = document.querySelector(`.btn-custom[data-slot="${STATE.selectedMixSlot}"]`);
      activeSlotBtn.textContent = `Mix ${STATE.selectedMixSlot} ✓`;
      setTimeout(() => {
        activeSlotBtn.textContent = `Slot ${STATE.selectedMixSlot}`;
      }, 2000);
    });
  };

  const loadSoundscapeMix = (data) => {
    if (!STATE.audioInitialized) AUDIO.init();
    
    // Load standard synths
    UI.soundItems.forEach(item => {
      const id = item.id.replace('sound-', '');
      if (data.hasOwnProperty(id)) {
        const targetVal = data[id];
        const slider = item.querySelector('.sound-slider');
        const progress = item.querySelector('.slider-progress');
        
        slider.value = targetVal;
        progress.style.width = `${targetVal}%`;
        
        const synth = AUDIO.synths[id];
        const now = AUDIO.ctx.currentTime;
        
        if (targetVal > 0) {
          item.classList.add('active');
          synth.active = true;
          AUDIO.setVolume(id, targetVal);
        } else {
          item.classList.remove('active');
          synth.active = false;
          synth.gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        }
      }
    });

    // Load Binaural Wave mix settings
    if (data.hasOwnProperty('binauralType')) {
      STATE.binaural.type = data.binauralType;
      UI.binauralSlider.value = data.binauralVolume;
      document.querySelector('#binaural-volume-row .slider-progress').style.width = `${data.binauralVolume}%`;
      
      UI.binauralTabs.forEach(tab => {
        if (tab.dataset.wave === STATE.binaural.type) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      AUDIO.setBinauralWave(STATE.binaural.type, data.binauralVolume);
    }
  };

  // ==========================================================================
  // 6. NEW FOCUS FEATURE B: BINAURAL BEATS LOGIC
  // ==========================================================================
  const setupBinauralBeats = () => {
    // Slider Change
    UI.binauralSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      document.querySelector('#binaural-volume-row .slider-progress').style.width = `${val}%`;
      STATE.binaural.volume = val;
      
      if (STATE.binaural.type !== 'off') {
        AUDIO.setBinauralWave(STATE.binaural.type, val);
      }
    });

    // Wave Tabs trigger
    UI.binauralTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        UI.binauralTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        STATE.binaural.type = tab.dataset.wave;
        
        if (STATE.binaural.type !== 'off') {
          if (!STATE.audioInitialized) AUDIO.init();
        }
        
        AUDIO.setBinauralWave(STATE.binaural.type, UI.binauralSlider.value);
      });
    });
  };

  // ==========================================================================
  // 7. NEW FOCUS FEATURE C: ZEN BOX BREATHING COACH
  // ==========================================================================
  const BREATHING_PHASES = [
    { title: "Inhale", desc: "Draw in slow, peaceful air.", circleClass: "breath-inhale", glowClass: "breath-glow-inhale" },
    { title: "Hold Full", desc: "Let focus settle in still lungs.", circleClass: "breath-inhale", glowClass: "breath-glow-inhale" },
    { title: "Exhale", desc: "Quietly release all distraction.", circleClass: "breath-exhale", glowClass: "breath-glow-exhale" },
    { title: "Hold Empty", desc: "Enjoy the space of pure calm.", circleClass: "breath-exhale", glowClass: "breath-glow-exhale" }
  ];

  const updateBreathingVisual = () => {
    const phase = BREATHING_PHASES[STATE.breathing.phase];
    
    UI.breathTimerVal.textContent = `${STATE.breathing.timeRemaining}s`;
    UI.breathInstruction.textContent = phase.desc;
    
    // Circle resizing transitions
    UI.breathCircle.className = `breathing-circle ${phase.circleClass}`;
    UI.breathGlow.className = `breathing-circle-glow ${phase.glowClass}`;
    
    // Sweep Web Audio pitch frequencies
    if (STATE.audioInitialized && AUDIO.synths.breathing.active) {
      AUDIO.sweepBreathingAudio(STATE.breathing.phase, 4);
    }
  };

  const handleBreathingTick = () => {
    STATE.breathing.timeRemaining--;
    
    if (STATE.breathing.timeRemaining <= 0) {
      // Loop phase 0 to 3
      STATE.breathing.phase = (STATE.breathing.phase + 1) % 4;
      STATE.breathing.timeRemaining = 4;
      updateBreathingVisual();
    } else {
      UI.breathTimerVal.textContent = `${STATE.breathing.timeRemaining}s`;
    }
  };

  const startBreathingCoach = () => {
    if (!STATE.audioInitialized) AUDIO.init();
    
    STATE.breathing.isRunning = true;
    UI.btnBreathToggle.textContent = "Stop Coach";
    UI.btnBreathToggle.classList.remove('btn-secondary');
    UI.btnBreathToggle.classList.add('btn-primary');
    
    // Initialize Web Audio breathing synth
    const synth = AUDIO.synths.breathing;
    synth.active = true;
    synth.gainNode.gain.setValueAtTime(0, AUDIO.ctx.currentTime);
    
    STATE.breathing.phase = 0;
    STATE.breathing.timeRemaining = 4;
    
    updateBreathingVisual();
    
    STATE.breathing.intervalId = setInterval(handleBreathingTick, 1000);
  };

  const stopBreathingCoach = () => {
    clearInterval(STATE.breathing.intervalId);
    STATE.breathing.isRunning = false;
    
    UI.btnBreathToggle.textContent = "Start Coach";
    UI.btnBreathToggle.classList.remove('btn-primary');
    UI.btnBreathToggle.classList.add('btn-secondary');
    
    UI.breathCircle.className = "breathing-circle";
    UI.breathGlow.className = "breathing-circle-glow";
    UI.breathTimerVal.textContent = "Ready";
    UI.breathInstruction.textContent = "Let your lungs expand with quiet focus.";
    
    // Mute Web Audio breathing synth
    if (STATE.audioInitialized) {
      const synth = AUDIO.synths.breathing;
      synth.active = false;
      synth.gainNode.gain.linearRampToValueAtTime(0, AUDIO.ctx.currentTime + 0.5);
    }
  };

  UI.btnBreathToggle.addEventListener('click', () => {
    if (STATE.breathing.isRunning) {
      stopBreathingCoach();
    } else {
      startBreathingCoach();
    }
  });


  // ==========================================================================
  // 8. POMODORO FOCUS TIMER CHAMBER
  // ==========================================================================
  const TIMER_MODES = {
    focus: { time: 1500, label: "Keep focused" }, // 25 min
    short: { time: 300, label: "Take a breath" }, // 5 min
    long: { time: 900, label: "Deep unwind" }     // 15 min
  };

  const updateTimerDisplay = () => {
    const min = Math.floor(STATE.timer.remaining / 60);
    const sec = STATE.timer.remaining % 60;
    
    const formatted = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    UI.timerTime.textContent = formatted;
    
    const strokeDash = 678.58; // circle length
    const percent = STATE.timer.remaining / STATE.timer.duration;
    UI.timerProgress.style.strokeDashoffset = strokeDash * (1 - percent);
  };

  const handleTimerComplete = () => {
    clearInterval(STATE.timer.intervalId);
    STATE.timer.isRunning = false;
    
    UI.iconPlay.classList.remove('hidden');
    UI.iconPause.classList.add('hidden');
    
    AUDIO.playZenBowlChime();
    
    UI.timerStatus.textContent = "Session Complete!";
    
    // LOG ANALYTICAL FOCUS STATS (If Focus session completed successfully)
    if (STATE.timer.mode === 'focus') {
      const durationMin = Math.round(STATE.timer.duration / 60);
      logFocusSession(durationMin);
    }
    
    setTimeout(() => {
      alert(STATE.timer.mode === 'focus' ? "ZenFocus complete! Time for a breath." : "Break complete! Ready to return into focus?");
      resetTimer();
    }, 200);
  };

  const toggleTimer = () => {
    if (!STATE.timer.isRunning) {
      if (!STATE.audioInitialized) AUDIO.init();
      
      STATE.timer.isRunning = true;
      UI.iconPlay.classList.add('hidden');
      UI.iconPause.classList.remove('hidden');
      UI.timerStatus.textContent = TIMER_MODES[STATE.timer.mode].label;
      
      STATE.timer.intervalId = setInterval(() => {
        STATE.timer.remaining--;
        updateTimerDisplay();
        
        if (STATE.timer.remaining <= 0) {
          handleTimerComplete();
        }
      }, 1000);
    } else {
      clearInterval(STATE.timer.intervalId);
      STATE.timer.isRunning = false;
      UI.iconPlay.classList.remove('hidden');
      UI.iconPause.classList.add('hidden');
      UI.timerStatus.textContent = "Paused";
    }
  };

  const resetTimer = () => {
    clearInterval(STATE.timer.intervalId);
    STATE.timer.isRunning = false;
    
    STATE.timer.duration = TIMER_MODES[STATE.timer.mode].time;
    STATE.timer.remaining = STATE.timer.duration;
    
    UI.iconPlay.classList.remove('hidden');
    UI.iconPause.classList.add('hidden');
    UI.timerStatus.textContent = "Ready to start";
    updateTimerDisplay();
  };

  UI.modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      UI.modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      STATE.timer.mode = tab.dataset.mode;
      resetTimer();
    });
  });

  UI.btnTimerToggle.addEventListener('click', toggleTimer);
  UI.btnTimerReset.addEventListener('click', resetTimer);
  resetTimer();


  // ==========================================================================
  // 9. NEW FOCUS FEATURE D: FOCUS INSIGHTS DESK & MILESTONES
  // ==========================================================================
  
  // Tab trigger pane switcher
  UI.deskTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      UI.deskTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const pane = tab.dataset.pane;
      if (pane === 'tasks') {
        UI.paneTasks.classList.remove('hidden');
        UI.paneInsights.classList.add('hidden');
        UI.taskStatsDisplay.classList.remove('hidden');
      } else {
        UI.paneTasks.classList.add('hidden');
        UI.paneInsights.classList.remove('hidden');
        UI.taskStatsDisplay.classList.add('hidden');
        
        // Re-render SVG chart on loading insights desk
        renderFocusChart();
      }
    });
  });

  // Log completed focus minutes to LocalStorage database
  const logFocusSession = (durationMin) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const savedStats = localStorage.getItem('zenfocus_stats');
    let data = { sessions: [] };
    
    if (savedStats) {
      try {
        data = JSON.parse(savedStats);
      } catch(e) {
        data = { sessions: [] };
      }
    }
    
    data.sessions.push({
      timestamp: new Date().toISOString(),
      duration: durationMin
    });
    
    localStorage.setItem('zenfocus_stats', JSON.stringify(data));
    checkMilestones(data.sessions.length);
  };

  // Aggregates focus minutes over the past 7 days (including today)
  const getWeeklyAggregatedMinutes = (sessions) => {
    const dailyMinutes = Array(7).fill(0);
    const dateLabels = [];
    
    const now = new Date();
    
    // Get past 7 dates
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dateLabels.push({
        dateStr: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }) // Mon, Tue...
      });
    }

    sessions.forEach(session => {
      const sesDate = session.timestamp.split('T')[0];
      const idx = dateLabels.findIndex(lbl => lbl.dateStr === sesDate);
      if (idx !== -1) {
        dailyMinutes[idx] += session.duration;
      }
    });

    return { minutes: dailyMinutes, labels: dateLabels };
  };

  // Render Focus SVG Vertical Bar Graph dynamically
  const renderFocusChart = () => {
    const savedStats = localStorage.getItem('zenfocus_stats');
    let sessions = [];
    
    if (savedStats) {
      try {
        sessions = JSON.parse(savedStats).sessions || [];
      } catch(e) {
        sessions = [];
      }
    }
    
    const aggregated = getWeeklyAggregatedMinutes(sessions);
    
    UI.chartBarsContainer.innerHTML = '';
    UI.chartLabelsContainer.innerHTML = '';
    
    // SVG Dimensions: Y goes 135 (value 0) to 20 (value 60m)
    // Formula: yPos = 135 - (value / 60) * 115
    const barWidth = 32;
    const spacing = 22;
    const startX = 35;
    
    aggregated.minutes.forEach((val, idx) => {
      const x = startX + idx * (barWidth + spacing);
      // Cap focus minutes shown at 60 on graph (can go higher, but scales standard)
      const graphVal = Math.min(val, 60);
      const height = (graphVal / 60) * 115;
      const y = 135 - height;
      
      // Draw Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', Math.max(height, 2)); // min 2px height
      rect.setAttribute('rx', 4);
      rect.setAttribute('fill', 'url(#bar-grad)');
      rect.setAttribute('style', `animation: barGrowth 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${idx * 0.08}s both`);
      
      // Add tooltip/hover title
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${val} focus min`;
      rect.appendChild(title);
      
      // Draw Labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + barWidth/2);
      text.setAttribute('y', 152);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'var(--color-text-muted)');
      text.setAttribute('font-size', '9');
      text.setAttribute('font-weight', '500');
      text.textContent = aggregated.labels[idx].dayName;
      
      UI.chartBarsContainer.appendChild(rect);
      UI.chartLabelsContainer.appendChild(text);
    });

    UI.milestonesSessionsCount.textContent = `${sessions.length} focus session${sessions.length !== 1 ? 's' : ''} completed`;
    checkMilestones(sessions.length);
  };

  // Evaluate and unlock Milestone badges
  const checkMilestones = (totalSessions) => {
    const badges = [
      { id: 'badge-initiate', req: 1 },
      { id: 'badge-flow', req: 3 },
      { id: 'badge-monk', req: 5 }
    ];

    badges.forEach(b => {
      const el = document.getElementById(b.id);
      if (el) {
        if (totalSessions >= b.req) {
          // If transitioning to unlocked, play animation
          if (el.classList.contains('locked')) {
            el.classList.remove('locked');
            el.classList.add('unlocked');
          }
        } else {
          el.classList.add('locked');
          el.classList.remove('unlocked');
        }
      }
    });
  };

  // ==========================================================================
  // 10. NEW FOCUS FEATURE E: DYNAMIC MINIMALIST MONK MODE
  // ==========================================================================
  UI.btnMonkToggle.addEventListener('click', () => {
    STATE.monkMode = !STATE.monkMode;
    
    if (STATE.monkMode) {
      document.body.classList.add('monk-mode-active');
      UI.btnMonkToggle.classList.add('btn-primary');
      UI.btnMonkToggle.classList.remove('btn-secondary');
      UI.btnMonkToggle.querySelector('span').textContent = "Exit Monk Mode";
      
      // Slow down background canvas particle speed (deep cosmic calm)
      STATE.particleSpeedMultiplier = 0.15;
    } else {
      document.body.classList.remove('monk-mode-active');
      UI.btnMonkToggle.classList.add('btn-secondary');
      UI.btnMonkToggle.classList.remove('btn-primary');
      UI.btnMonkToggle.querySelector('span').textContent = "Monk Mode";
      
      // Restore standard particle movement speed
      STATE.particleSpeedMultiplier = 1.0;
    }
  });


  // ==========================================================================
  // 11. DYNAMIC KANBAN TASK DESK (WITH DRAG & DROP & LOCAL STORAGE)
  // ==========================================================================
  const updateTaskCounts = () => {
    const counts = { todo: 0, progress: 0, completed: 0 };
    
    STATE.tasks.forEach(t => {
      if (counts.hasOwnProperty(t.status)) counts[t.status]++;
    });
    
    UI.badgeTodo.textContent = counts.todo;
    UI.badgeProgress.textContent = counts.progress;
    UI.badgeCompleted.textContent = counts.completed;
    
    const total = STATE.tasks.length;
    UI.tasksCount.textContent = `${total} task${total !== 1 ? 's' : ''}`;
    
    ['todo', 'progress', 'completed'].forEach(col => {
      const container = document.getElementById(`list-${col}`);
      const emptyMsg = container.querySelector('.empty-msg') || createEmptyMsg(container);
      
      const colTasks = STATE.tasks.filter(t => t.status === col);
      if (colTasks.length === 0) {
        emptyMsg.style.display = 'block';
      } else {
        emptyMsg.style.display = 'none';
      }
    });
  };

  const createEmptyMsg = (container) => {
    const div = document.createElement('div');
    div.className = 'empty-msg';
    div.textContent = "Drop focus items here";
    container.appendChild(div);
    return div;
  };

  const saveTasks = () => {
    localStorage.setItem('zenfocus_tasks', JSON.stringify(STATE.tasks));
    updateTaskCounts();
  };

  const renderTaskCard = (task) => {
    const card = document.createElement('div');
    card.className = `task-item ${task.status === 'completed' ? 'completed-task' : ''}`;
    card.id = `task-${task.id}`;
    card.draggable = true;
    
    const priBadge = `<span class="priority-tag ${task.priority}">${task.priority}</span>`;
    
    const actionIcons = task.status === 'completed' 
      ? `<button class="task-action-btn btn-check" title="Mark Active">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-low)" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
         </button>`
      : `<button class="task-action-btn btn-check" title="Mark Done">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
         </button>`;

    card.innerHTML = `
      <p class="task-desc">${escapeHTML(task.text)}</p>
      <div class="task-meta">
        ${priBadge}
        <div class="task-actions">
          ${actionIcons}
          <button class="task-action-btn btn-delete" title="Delete Task">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', task.id);
    });
    
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    card.querySelector('.btn-check').addEventListener('click', () => {
      if (task.status === 'completed') {
        task.status = 'todo';
      } else {
        task.status = 'completed';
      }
      saveTasks();
      reloadTasksView();
    });

    card.querySelector('.btn-delete').addEventListener('click', () => {
      card.style.animation = 'taskFadeOut 0.25s ease forwards';
      card.addEventListener('animationend', () => {
        STATE.tasks = STATE.tasks.filter(t => t.id !== task.id);
        saveTasks();
        card.remove();
      });
    });

    return card;
  };

  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  const reloadTasksView = () => {
    ['todo', 'progress', 'completed'].forEach(col => {
      const container = document.getElementById(`list-${col}`);
      const cards = container.querySelectorAll('.task-item');
      cards.forEach(c => c.remove());
    });

    STATE.tasks.forEach(task => {
      const card = renderTaskCard(task);
      document.getElementById(`list-${task.status}`).appendChild(card);
    });
    
    updateTaskCounts();
  };

  const setupDragAndDrop = () => {
    UI.dragZones.forEach(zone => {
      const column = zone.closest('.kanban-column');
      const targetStatus = column.dataset.status;
      
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
      
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        
        const taskId = parseInt(e.dataTransfer.getData('text/plain'));
        const task = STATE.tasks.find(t => t.id === taskId);
        
        if (task && task.status !== targetStatus) {
          task.status = targetStatus;
          saveTasks();
          reloadTasksView();
        }
      });
    });
  };

  UI.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = UI.taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text: text,
      priority: UI.taskPriority.value,
      status: 'todo'
    };

    STATE.tasks.push(newTask);
    saveTasks();
    
    const card = renderTaskCard(newTask);
    UI.listTodo.appendChild(card);
    updateTaskCounts();
    
    UI.taskInput.value = '';
    UI.taskInput.focus();
  });

  const loadTasks = () => {
    const saved = localStorage.getItem('zenfocus_tasks');
    if (saved) {
      try {
        STATE.tasks = JSON.parse(saved);
      } catch(err) {
        STATE.tasks = [];
      }
    } else {
      STATE.tasks = [
        { id: 1, text: "Focus on writing clean CSS for this hub", priority: "high", status: "progress" },
        { id: 2, text: "Explore Web Audio synth controls", priority: "medium", status: "todo" },
        { id: 3, text: "Breathe in deeply for 4 seconds", priority: "low", status: "completed" }
      ];
      saveTasks();
    }
    reloadTasksView();
  };

  // ==========================================================================
  // 12. INSPIRATION 3D FLIP CARD LOGIC
  // ==========================================================================
  const flipQuoteCard = () => {
    const isFlipped = UI.quoteCardInner.classList.toggle('flipped');
    
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * STATE.quotes.length);
    } while(nextIdx === STATE.currentQuoteIndex && STATE.quotes.length > 1);
    
    STATE.currentQuoteIndex = nextIdx;
    const quote = STATE.quotes[nextIdx];

    setTimeout(() => {
      if (isFlipped) {
        UI.quoteTextBack.textContent = quote.text;
        UI.quoteAuthorBack.textContent = `— ${quote.author}`;
      } else {
        UI.quoteText.textContent = quote.text;
        UI.quoteAuthor.textContent = `— ${quote.author}`;
      }
    }, 300);
  };

  UI.btnNewQuote.addEventListener('click', (e) => {
    e.stopPropagation();
    flipQuoteCard();
  });

  UI.btnNewQuoteBack.addEventListener('click', (e) => {
    e.stopPropagation();
    flipQuoteCard();
  });

  UI.quoteCardInner.addEventListener('click', flipQuoteCard);


  // ==========================================================================
  // 13. AUTO-SAVE JOURNAL DESK LOGIC
  // ==========================================================================
  const setupJournal = () => {
    const savedJournal = localStorage.getItem('zenfocus_journal');
    if (savedJournal) {
      UI.journalInput.value = savedJournal;
    }
    
    let saveTimeout = null;
    UI.journalInput.addEventListener('input', (e) => {
      clearTimeout(saveTimeout);
      
      saveTimeout = setTimeout(() => {
        localStorage.setItem('zenfocus_journal', e.target.value);
        UI.journalSaved.classList.remove('hidden');
        
        setTimeout(() => {
          UI.journalSaved.classList.add('hidden');
        }, 2500);
      }, 800);
    });
  };

  // ==========================================================================
  // 14. INITIALIZE SYSTEM
  // ==========================================================================
  initCanvasBackground();
  setupSoundscapes();
  setupCustomMixes();
  setupBinauralBeats();
  loadTasks();
  setupDragAndDrop();
  setupJournal();
  
  // Set default unlocked states on badge grid
  const savedStats = localStorage.getItem('zenfocus_stats');
  if (savedStats) {
    try {
      const stats = JSON.parse(savedStats);
      checkMilestones(stats.sessions.length || 0);
    } catch(e) {
      checkMilestones(0);
    }
  } else {
    checkMilestones(0);
  }
  
  console.log("ZenFocus upgraded features booted and loaded successfully.");
});
