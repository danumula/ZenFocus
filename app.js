/* ==========================================================================
   ZenFocus — Premium Ambient Logic & Procedural Audio Engine (Ultimate Upgrades)
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
    chimeSelect: document.getElementById('chime-select'),
    
    // Sound & Mixer Elements
    soundItems: document.querySelectorAll('.sound-item'),
    presetButtons: document.querySelectorAll('.btn-preset'),
    btnMuteAll: document.querySelector('.text-preset'),
    mixSlots: document.querySelectorAll('.btn-custom'),
    btnSaveMix: document.getElementById('btn-save-mix'),
    
    // Binaural Controls
    binauralTabs: document.querySelectorAll('.wave-tab'),
    binauralSlider: document.getElementById('binaural-slider'),
    
    // Solfeggio Controls
    solfeggioTabs: document.querySelectorAll('.solfeggio-tab'),
    solfeggioSlider: document.getElementById('solfeggio-slider'),
    
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
    aggregatedHoursTracked: document.getElementById('aggregated-hours-tracked'),
    
    // Gratitude Grid Section
    gratitudeGrid: document.getElementById('gratitude-grid'),
    gratitudePopover: document.getElementById('gratitude-popover'),
    popoverDate: document.getElementById('popover-date'),
    popoverContent: document.getElementById('popover-content'),
    btnClosePopover: document.getElementById('btn-close-popover'),
    
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
    activeTaskTimerId: null, // Track currently running card stopwatch
    taskIntervalId: null,   // Card timer interval handle
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
      type: 'off',
      volume: 30
    },
    solfeggio: {
      freq: 'off',
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
        this.x += this.speedX * STATE.particleSpeedMultiplier;
        this.y += this.speedY * STATE.particleSpeedMultiplier;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
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
        
        if (STATE.monkMode) {
          ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha * 0.7})`;
          ctx.shadowBlur = this.size;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.2)';
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
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
      
      if (STATE.mouse.x !== null && STATE.mouse.y !== null && !STATE.monkMode) {
        const glowGrad = ctx.createRadialGradient(
          STATE.mouse.x, STATE.mouse.y, 10,
          STATE.mouse.x, STATE.mouse.y, 250
        );
        glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
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
    analyser: null,
    synths: {
      rain: null,
      waves: null,
      birds: null,
      drone: null,
      binaural: null,
      solfeggio: null,
      breathing: null
    },
    
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
        
        // Dynamic Radial Analyser Node
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128; // 64 frequency bands
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        
        // Connect routing: synths -> masterGain -> analyser -> limiter -> destination
        this.masterGain.connect(this.analyser);
        this.analyser.connect(limiter);
        limiter.connect(this.ctx.destination);
        
        // Build individual synth units
        this.buildRainSynth();
        this.buildWavesSynth();
        this.buildBirdsSynth();
        this.buildDroneSynth();
        this.buildBinauralSynth();
        this.buildSolfeggioSynth();
        this.buildBreathingSynth();
        
        // Run Real-Time Canvas Audio Visualizer loop
        initAudioVisualizerLoop();
        
        STATE.audioInitialized = true;
        console.log("Web Audio Context, analyser and procedurals initialized successfully.");
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
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start();
      
      let crackleInterval = null;
      const playCrackle = () => {
        if (gain.gain.value === 0) return;
        
        const dropletCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < dropletCount; i++) {
          const osc = this.ctx.createOscillator();
          const dropFilter = this.ctx.createBiquadFilter();
          const dropGain = this.ctx.createGain();
          
          osc.type = 'sine';
          dropFilter.type = 'bandpass';
          dropFilter.frequency.setValueAtTime(Math.random() * 3000 + 1500, this.ctx.currentTime);
          dropFilter.Q.setValueAtTime(10, this.ctx.currentTime);
          
          const now = this.ctx.currentTime;
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
      
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      
      const volLfo = this.ctx.createOscillator();
      volLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      
      const volLfoGain = this.ctx.createGain();
      volLfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      
      const waveMasterGain = this.ctx.createGain();
      waveMasterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      
      noise.connect(filter);
      filter.connect(waveMasterGain);
      waveMasterGain.connect(gain);
      gain.connect(this.masterGain);
      
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
    
    // C. Forest Birds Synthesizer
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
    
    // D. Focus Drone (Low Triangle detuning)
    buildDroneSynth() {
      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      
      oscA.type = 'triangle';
      oscB.type = 'triangle';
      
      oscA.frequency.setValueAtTime(55, this.ctx.currentTime);
      oscB.frequency.setValueAtTime(55.4, this.ctx.currentTime);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      
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
    
    // E. Headphones Binaural Beats Synth (Stereo pan detuning)
    buildBinauralSynth() {
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      
      oscL.type = 'sine';
      oscR.type = 'sine';
      
      oscL.frequency.setValueAtTime(150, this.ctx.currentTime);
      oscR.frequency.setValueAtTime(150, this.ctx.currentTime);
      
      const panL = this.ctx.createStereoPanner();
      const panR = this.ctx.createStereoPanner();
      
      panL.pan.setValueAtTime(-1, this.ctx.currentTime);
      panR.pan.setValueAtTime(1, this.ctx.currentTime);
      
      const gainL = this.ctx.createGain();
      const gainR = this.ctx.createGain();
      gainL.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gainR.gain.setValueAtTime(0.5, this.ctx.currentTime);
      
      const binMasterGain = this.ctx.createGain();
      binMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      
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
    
    // F. Procedural Solfeggio Resonance Synth (Warm Tremolo Sine)
    buildSolfeggioSynth() {
      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      
      oscA.type = 'sine';
      oscB.type = 'sine';
      
      oscA.frequency.setValueAtTime(432, this.ctx.currentTime);
      oscB.frequency.setValueAtTime(432.3, this.ctx.currentTime); // detuned by 0.3Hz for rich tremolo warmth
      
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime); // start silent
      
      // Tremolo LFO modulator
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // slow breathing
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.1, this.ctx.currentTime); // modulate volume by 10%
      
      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      
      oscA.connect(droneGain);
      oscB.connect(droneGain);
      droneGain.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      
      oscA.start();
      oscB.start();
      lfo.start();
      
      this.synths.solfeggio = {
        oscA: oscA,
        oscB: oscB,
        gainNode: gainNode,
        active: false
      };
    },
    
    // G. Breathing Coach sweep hum
    buildBreathingSynth() {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
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
    
    // FM synthesis chimes triggers
    playTibetanBowl() {
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
    
    playCrystalBowl() {
      const now = this.ctx.currentTime;
      // High pure crystalline frequencies (F4 base + harmonics)
      const frequencies = [349.23, 698.46, 1047.69, 1396.92];
      const gains = [0.35, 0.18, 0.08, 0.03];
      
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5); // long pure decay
      
      chimeGain.connect(this.masterGain);
      
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        oscGain.gain.setValueAtTime(gains[idx], now);
        osc.connect(oscGain);
        oscGain.connect(chimeGain);
        osc.start(now);
        osc.stop(now + 9.0);
      });
    },
    
    playZenWindChimes() {
      const now = this.ctx.currentTime;
      // FM Bell synthesis pitches mapping random wind blowing strikes
      const chimePitches = [880, 987.77, 1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760];
      const count = 15; // 15 scattered chimes over 3.5 seconds
      
      for(let i = 0; i < count; i++) {
        const strikeTime = now + (i * 0.18) + (Math.random() * 0.12);
        const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];
        
        // FM Modulator/Carrier setup
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        
        carrier.type = 'sine';
        modulator.type = 'sine';
        
        carrier.frequency.setValueAtTime(pitch, strikeTime);
        modulator.frequency.setValueAtTime(pitch * 1.414, strikeTime); // inharmonic chime ratio
        
        const bellGain = this.ctx.createGain();
        bellGain.gain.setValueAtTime(0, strikeTime);
        bellGain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.05, strikeTime + 0.005);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + Math.random() * 1.2 + 0.6); // varying decay
        
        // Panning to scatter them in stereo
        const pan = this.ctx.createStereoPanner();
        pan.pan.setValueAtTime(Math.random() * 1.6 - 0.8, strikeTime);
        
        modGain.gain.setValueAtTime(500, strikeTime);
        modGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 0.5);
        
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        
        carrier.connect(bellGain);
        bellGain.connect(pan);
        pan.connect(this.masterGain);
        
        modulator.start(strikeTime);
        carrier.start(strikeTime);
        
        modulator.stop(strikeTime + 2.0);
        carrier.stop(strikeTime + 2.0);
      }
    },
    
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
        if (waveType === 'alpha') {
          synth.oscR.frequency.linearRampToValueAtTime(160, now + 0.2);
        } else if (waveType === 'theta') {
          synth.oscR.frequency.linearRampToValueAtTime(155, now + 0.2);
        }
        
        const vol = volumePercent / 100 * 0.22;
        synth.gainNode.gain.setValueAtTime(synth.gainNode.gain.value, now);
        synth.gainNode.gain.linearRampToValueAtTime(vol, now + 0.5);
      }
    },
    
    setSolfeggioFrequency(freqType, volumePercent) {
      if (!this.ctx) this.init();
      const synth = this.synths.solfeggio;
      if (!synth) return;
      
      const now = this.ctx.currentTime;
      
      if (freqType === 'off') {
        synth.active = false;
        synth.gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      } else {
        synth.active = true;
        const targetFreq = parseFloat(freqType);
        
        synth.oscA.frequency.linearRampToValueAtTime(targetFreq, now + 0.25);
        synth.oscB.frequency.linearRampToValueAtTime(targetFreq + 0.3, now + 0.25);
        
        const vol = volumePercent / 100 * 0.2;
        synth.gainNode.gain.setValueAtTime(synth.gainNode.gain.value, now);
        synth.gainNode.gain.linearRampToValueAtTime(vol, now + 0.5);
      }
    },
    
    sweepBreathingAudio(phase, durationSec) {
      const synth = this.synths.breathing;
      if (!synth || !synth.active) return;
      
      const now = this.ctx.currentTime;
      
      if (phase === 0) {
        synth.gainNode.gain.linearRampToValueAtTime(0.2, now + durationSec);
        synth.oscNode.frequency.linearRampToValueAtTime(250, now + durationSec);
        synth.filterNode.frequency.linearRampToValueAtTime(650, now + durationSec);
      } else if (phase === 1) {
        synth.gainNode.gain.linearRampToValueAtTime(0.2, now + durationSec);
        synth.oscNode.frequency.setValueAtTime(250, now);
        synth.filterNode.frequency.setValueAtTime(650, now);
      } else if (phase === 2) {
        synth.gainNode.gain.linearRampToValueAtTime(0.04, now + durationSec);
        synth.oscNode.frequency.linearRampToValueAtTime(140, now + durationSec);
        synth.filterNode.frequency.linearRampToValueAtTime(180, now + durationSec);
      } else if (phase === 3) {
        synth.gainNode.gain.linearRampToValueAtTime(0.0, now + durationSec);
      }
    }
  };

  // Setup circular visualizer rendering loop
  const initAudioVisualizerLoop = () => {
    const canvas = document.getElementById('timer-visualizer');
    const ctx = canvas.getContext('2d');
    
    const bufferLength = AUDIO.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      requestAnimationFrame(draw);
      
      ctx.clearRect(0, 0, 240, 240);
      
      if (!STATE.audioInitialized || STATE.monkMode) return; // silent inside Monk Mode to avoid distraction
      
      AUDIO.analyser.getByteFrequencyData(dataArray);
      
      const radius = 105;
      const centerX = 120;
      const centerY = 120;
      const barCount = 48; // clean resolution spacing
      const angleStep = (Math.PI * 2) / barCount;
      
      for(let i = 0; i < barCount; i++) {
        // Average bands if needed, or index directly
        const valIdx = Math.floor((i / barCount) * bufferLength);
        const amp = dataArray[valIdx] / 255;
        const length = amp * 22; // max 22px radial bars
        
        if (length <= 1) continue;
        
        const angle = i * angleStep;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + length);
        const y2 = centerY + Math.sin(angle) * (radius + length);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        // Premium purple-indigo gradient visual effect
        ctx.strokeStyle = `hsla(${250 + amp * 30}, 85%, 66%, ${0.1 + amp * 0.55})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };
    
    draw();
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

  UI.btnEnter.addEventListener('click', () => {
    UI.overlay.classList.add('hidden');
    AUDIO.init();
    
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
  // 5. MIXER PRESETS & CUSTOM SAVERS
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

  UI.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      UI.presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applySoundscapePreset(btn.dataset.preset);
    });
  });

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

  const setupCustomMixes = () => {
    UI.mixSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        UI.mixSlots.forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
        STATE.selectedMixSlot = slot.dataset.slot;
        
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
      
      mixData['binauralType'] = STATE.binaural.type;
      mixData['binauralVolume'] = parseInt(UI.binauralSlider.value);
      
      // Save Solfeggio settings too!
      mixData['solfeggioFreq'] = STATE.solfeggio.freq;
      mixData['solfeggioVolume'] = parseInt(UI.solfeggioSlider.value);
      
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

    // Load Solfeggio settings if saved
    if (data.hasOwnProperty('solfeggioFreq')) {
      STATE.solfeggio.freq = data.solfeggioFreq;
      UI.solfeggioSlider.value = data.solfeggioVolume;
      document.querySelector('#solfeggio-volume-row .slider-progress').style.width = `${data.solfeggioVolume}%`;
      
      UI.solfeggioTabs.forEach(tab => {
        if (tab.dataset.freq === STATE.solfeggio.freq) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      AUDIO.setSolfeggioFrequency(STATE.solfeggio.freq, data.solfeggioVolume);
    }
  };

  // ==========================================================================
  // 6. BINAURAL BEATS LOGIC
  // ==========================================================================
  const setupBinauralBeats = () => {
    UI.binauralSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      document.querySelector('#binaural-volume-row .slider-progress').style.width = `${val}%`;
      STATE.binaural.volume = val;
      if (STATE.binaural.type !== 'off') {
        AUDIO.setBinauralWave(STATE.binaural.type, val);
      }
    });

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
  // 7. SOLFEGGIO MEDITATION FREQS
  // ==========================================================================
  const setupSolfeggioResonance = () => {
    UI.solfeggioSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      document.querySelector('#solfeggio-volume-row .slider-progress').style.width = `${val}%`;
      STATE.solfeggio.volume = val;
      if (STATE.solfeggio.freq !== 'off') {
        AUDIO.setSolfeggioFrequency(STATE.solfeggio.freq, val);
      }
    });

    UI.solfeggioTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        UI.solfeggioTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        STATE.solfeggio.freq = tab.dataset.freq;
        if (STATE.solfeggio.freq !== 'off') {
          if (!STATE.audioInitialized) AUDIO.init();
        }
        AUDIO.setSolfeggioFrequency(STATE.solfeggio.freq, UI.solfeggioSlider.value);
      });
    });
  };

  // ==========================================================================
  // 8. ZEN BOX BREATHING COACH
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
    
    UI.breathCircle.className = `breathing-circle ${phase.circleClass}`;
    UI.breathGlow.className = `breathing-circle-glow ${phase.glowClass}`;
    
    if (STATE.audioInitialized && AUDIO.synths.breathing.active) {
      AUDIO.sweepBreathingAudio(STATE.breathing.phase, 4);
    }
  };

  const handleBreathingTick = () => {
    STATE.breathing.timeRemaining--;
    if (STATE.breathing.timeRemaining <= 0) {
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
  // 9. POMODORO FOCUS TIMER CHAMBER
  // ==========================================================================
  const updateTimerDisplay = () => {
    const min = Math.floor(STATE.timer.remaining / 60);
    const sec = STATE.timer.remaining % 60;
    const formatted = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    UI.timerTime.textContent = formatted;
    
    const strokeDash = 678.58;
    const percent = STATE.timer.remaining / STATE.timer.duration;
    UI.timerProgress.style.strokeDashoffset = strokeDash * (1 - percent);
  };

  const handleTimerComplete = () => {
    clearInterval(STATE.timer.intervalId);
    STATE.timer.isRunning = false;
    
    UI.iconPlay.classList.remove('hidden');
    UI.iconPause.classList.add('hidden');
    
    // Choose dynamic FM synthesized Chime Sound
    const chimeSelected = UI.chimeSelect.value;
    if (chimeSelected === 'crystal') {
      AUDIO.playCrystalBowl();
    } else if (chimeSelected === 'chimes') {
      AUDIO.playZenWindChimes();
    } else {
      AUDIO.playTibetanBowl();
    }
    
    UI.timerStatus.textContent = "Session Complete!";
    
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

  // ==========================================================================
  // 10. FOCUS INSIGHTS DESK & MILESTONES (STAT SAVERS)
  // ==========================================================================
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
        
        renderFocusChart();
        renderGratitudeGrid();
      }
    });
  });

  const logFocusSession = (durationMin) => {
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

  const getWeeklyAggregatedMinutes = (sessions) => {
    const dailyMinutes = Array(7).fill(0);
    const dateLabels = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dateLabels.push({
        dateStr: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' })
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
    
    const barWidth = 32;
    const spacing = 22;
    const startX = 35;
    
    aggregated.minutes.forEach((val, idx) => {
      const x = startX + idx * (barWidth + spacing);
      const graphVal = Math.min(val, 60);
      const height = (graphVal / 60) * 115;
      const y = 135 - height;
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', Math.max(height, 2));
      rect.setAttribute('rx', 4);
      rect.setAttribute('fill', 'url(#bar-grad)');
      rect.setAttribute('style', `animation: barGrowth 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${idx * 0.08}s both`);
      
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${val} focus min`;
      rect.appendChild(title);
      
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

    // Calculate total aggregated hours completed
    let totalSecs = 0;
    STATE.tasks.forEach(t => {
      if (t.status === 'completed') {
        totalSecs += (t.elapsedSeconds || 0);
      }
    });
    
    const completedFocusMinutesFromPomodoro = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalMinutesCombined = completedFocusMinutesFromPomodoro + Math.floor(totalSecs / 60);
    
    const hrs = Math.floor(totalMinutesCombined / 60);
    const mins = totalMinutesCombined % 60;
    UI.aggregatedHoursTracked.textContent = `${hrs}h ${String(mins).padStart(2, '0')}m tracked focus time`;

    UI.milestonesSessionsCount.textContent = `${sessions.length} focus session${sessions.length !== 1 ? 's' : ''} completed`;
    checkMilestones(sessions.length);
  };

  const checkMilestones = (totalSessions) => {
    const badges = [
      { id: 'badge-initiate', req: 1 },
      { id: 'badge-flow', req: 3, selectOptionId: 'crystal' },
      { id: 'badge-monk', req: 5, selectOptionId: 'chimes' }
    ];

    badges.forEach(b => {
      const el = document.getElementById(b.id);
      if (el) {
        if (totalSessions >= b.req) {
          if (el.classList.contains('locked')) {
            el.classList.remove('locked');
            el.classList.add('unlocked');
          }
          // Unlock Chime Library option dropdown
          if (b.selectOptionId) {
            const opt = UI.chimeSelect.querySelector(`option[value="${b.selectOptionId}"]`);
            if (opt) {
              opt.removeAttribute('disabled');
              // Remove emoji lock
              if (b.selectOptionId === 'crystal') opt.textContent = "Crystal Singing Bowl";
              if (b.selectOptionId === 'chimes') opt.textContent = "Zen Wind Chimes";
            }
          }
        } else {
          el.classList.add('locked');
          el.classList.remove('unlocked');
        }
      }
    });
  };

  // ==========================================================================
  // 11. DYNAMIC KANBAN STOPWATCHES
  // ==========================================================================
  const toggleTaskStopwatch = (taskId) => {
    const task = STATE.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const card = document.getElementById(`task-${taskId}`);
    const playBtn = card.querySelector('.btn-card-timer');
    const timerTag = card.querySelector('.card-timer-tag span');
    
    if (STATE.activeTaskTimerId === taskId) {
      // Pause current
      clearInterval(STATE.taskIntervalId);
      STATE.activeTaskTimerId = null;
      STATE.taskIntervalId = null;
      
      card.classList.remove('timer-active');
      playBtn.querySelector('svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3" />'; // play icon
      
      saveTasks();
    } else {
      // Pause any other actively running card stopwatch first
      if (STATE.activeTaskTimerId !== null) {
        const otherId = STATE.activeTaskTimerId;
        const otherCard = document.getElementById(`task-${otherId}`);
        if (otherCard) {
          otherCard.classList.remove('timer-active');
          const otherPlay = otherCard.querySelector('.btn-card-timer');
          if (otherPlay) otherPlay.querySelector('svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3" />';
        }
        clearInterval(STATE.taskIntervalId);
      }
      
      // Start this stopwatch
      if (!STATE.audioInitialized) AUDIO.init();
      
      STATE.activeTaskTimerId = taskId;
      card.classList.add('timer-active');
      playBtn.querySelector('svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'; // pause icon
      
      STATE.taskIntervalId = setInterval(() => {
        task.elapsedSeconds = (task.elapsedSeconds || 0) + 1;
        timerTag.textContent = formatStopwatchTime(task.elapsedSeconds);
        
        // Auto-save state hourly/incrementally
        if (task.elapsedSeconds % 5 === 0) {
          saveTasks();
        }
      }, 1000);
    }
  };

  const formatStopwatchTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ==========================================================================
  // 12. NEW FOCUS FEATURE E: GRATITUDE CALENDAR GRID LOG BOOK
  // ==========================================================================
  
  // Save reflection log entries by date
  const saveGratitudeLog = (text) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('zenfocus_journal_log');
    let logs = {};
    
    if (saved) {
      try {
        logs = JSON.parse(saved);
      } catch(e) {
        logs = {};
      }
    }
    
    if (text.trim()) {
      logs[todayStr] = text.trim();
    } else {
      delete logs[todayStr];
    }
    
    localStorage.setItem('zenfocus_journal_log', JSON.stringify(logs));
    
    // Dynamically update the specific square if insights desk is active
    if (!UI.paneInsights.classList.contains('hidden')) {
      renderGratitudeGrid();
    }
  };

  // Render 84 grid squares (12 Weeks matrix)
  const renderGratitudeGrid = () => {
    UI.gratitudeGrid.innerHTML = '';
    
    const savedLogs = localStorage.getItem('zenfocus_journal_log');
    let logs = {};
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
      } catch(e) {
        logs = {};
      }
    }

    const now = new Date();
    
    // Map chronological preceding 84 dates (starting 12 weeks ago)
    for (let i = 83; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      const square = document.createElement('div');
      square.className = 'grid-square';
      
      // Determine contribution levels
      const reflectionText = logs[dateStr] || '';
      if (reflectionText) {
        // High density visual glow if text is rich
        const level = reflectionText.length > 50 ? 'level-2' : 'level-1';
        square.classList.add(level);
      } else {
        square.classList.add('level-0');
      }
      
      // Custom date details tooltip
      const formattedDate = targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      square.title = reflectionText ? `${formattedDate} (Click to read)` : formattedDate;
      
      // Open detailed reflection popup modal
      square.addEventListener('click', (e) => {
        e.stopPropagation();
        if (reflectionText) {
          UI.popoverDate.textContent = targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
          UI.popoverContent.textContent = `“ ${reflectionText} ”`;
          UI.gratitudePopover.classList.add('active');
        } else {
          UI.gratitudePopover.classList.remove('active');
        }
      });
      
      UI.gratitudeGrid.appendChild(square);
    }
  };

  // Close reflection details popover
  UI.btnClosePopover.addEventListener('click', (e) => {
    e.stopPropagation();
    UI.gratitudePopover.classList.remove('active');
  });

  // Close popup if clicking outside
  document.addEventListener('click', () => {
    UI.gratitudePopover.classList.remove('active');
  });
  UI.gratitudePopover.addEventListener('click', (e) => e.stopPropagation());


  // ==========================================================================
  // 13. MONK MODE VIEWPORT SYSTEM STATE
  // ==========================================================================
  UI.btnMonkToggle.addEventListener('click', () => {
    STATE.monkMode = !STATE.monkMode;
    
    if (STATE.monkMode) {
      document.body.classList.add('monk-mode-active');
      UI.btnMonkToggle.classList.add('btn-primary');
      UI.btnMonkToggle.classList.remove('btn-secondary');
      UI.btnMonkToggle.querySelector('span').textContent = "Exit Monk Mode";
      
      STATE.particleSpeedMultiplier = 0.15;
    } else {
      document.body.classList.remove('monk-mode-active');
      UI.btnMonkToggle.classList.add('btn-secondary');
      UI.btnMonkToggle.classList.remove('btn-primary');
      UI.btnMonkToggle.querySelector('span').textContent = "Monk Mode";
      
      STATE.particleSpeedMultiplier = 1.0;
    }
  });

  // ==========================================================================
  // 14. KANBAN TASK DESK ENGINE
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
    if (STATE.activeTaskTimerId === task.id) {
      card.classList.add('timer-active');
    }
    card.id = `task-${task.id}`;
    card.draggable = true;
    
    const priBadge = `<span class="priority-tag ${task.priority}">${task.priority}</span>`;
    
    // Micro Stopwatch timer elements
    const elapsedVal = formatStopwatchTime(task.elapsedSeconds || 0);
    const timerTag = `<div class="card-timer-tag">
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>${elapsedVal}</span>
    </div>`;

    const timerPlayIcon = STATE.activeTaskTimerId === task.id
      ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>' // pause icon
      : '<polygon points="5 3 19 12 5 21 5 3" />'; // play icon

    // Completion icon
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
        ${timerTag}
        <div class="task-actions">
          <button class="task-action-btn btn-card-timer" title="Start/Pause Task Stopwatch">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              ${timerPlayIcon}
            </svg>
          </button>
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

    // Check complete listener
    card.querySelector('.btn-check').addEventListener('click', () => {
      // Pause stopwatch if card is completed
      if (STATE.activeTaskTimerId === task.id) {
        toggleTaskStopwatch(task.id);
      }
      
      if (task.status === 'completed') {
        task.status = 'todo';
      } else {
        task.status = 'completed';
      }
      saveTasks();
      reloadTasksView();
    });

    // Stopwatch Play/Pause toggle
    card.querySelector('.btn-card-timer').addEventListener('click', () => {
      toggleTaskStopwatch(task.id);
    });

    // Delete listener
    card.querySelector('.btn-delete').addEventListener('click', () => {
      if (STATE.activeTaskTimerId === task.id) {
        toggleTaskStopwatch(task.id);
      }
      
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
          // If task timer is active and card gets moved to completed column, pause it
          if (targetStatus === 'completed' && STATE.activeTaskTimerId === task.id) {
            toggleTaskStopwatch(task.id);
          }
          
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
      status: 'todo',
      elapsedSeconds: 0 // initialize stopwatch
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
        { id: 1, text: "Focus on writing clean CSS for this hub", priority: "high", status: "progress", elapsedSeconds: 45 },
        { id: 2, text: "Explore Web Audio synth controls", priority: "medium", status: "todo", elapsedSeconds: 0 },
        { id: 3, text: "Breathe in deeply for 4 seconds", priority: "low", status: "completed", elapsedSeconds: 4 }
      ];
      saveTasks();
    }
    reloadTasksView();
  };

  // ==========================================================================
  // 15. INSPIRATION 3D FLIP CARD LOGIC
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
  // 16. AUTO-SAVE JOURNAL DESK LOGIC
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
        const text = e.target.value;
        
        // Save to active notepad
        localStorage.setItem('zenfocus_journal', text);
        
        // SAVE TO THE GRATITUDE CALENDAR GRID LOG DATABASE
        saveGratitudeLog(text);
        
        UI.journalSaved.classList.remove('hidden');
        setTimeout(() => {
          UI.journalSaved.classList.add('hidden');
        }, 2500);
      }, 800);
    });
  };

  // ==========================================================================
  // 17. INITIALIZE SYSTEM
  // ==========================================================================
  const TIMER_MODES = {
    focus: { time: 1500, label: "Keep focused" },
    short: { time: 300, label: "Take a breath" },
    long: { time: 900, label: "Deep unwind" }
  };

  initCanvasBackground();
  setupSoundscapes();
  setupCustomMixes();
  setupBinauralBeats();
  setupSolfeggioResonance();
  loadTasks();
  setupDragAndDrop();
  setupJournal();
  
  // Set default unlocked states on badge grid
  const loadedStats = localStorage.getItem('zenfocus_stats');
  if (loadedStats) {
    try {
      const stats = JSON.parse(loadedStats);
      checkMilestones(stats.sessions.length || 0);
    } catch(e) {
      checkMilestones(0);
    }
  } else {
    checkMilestones(0);
  }
  
  console.log("ZenFocus ultimate upgrades successfully booted and loaded.");
});
