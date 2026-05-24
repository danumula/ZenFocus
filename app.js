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
    
    // Pomodoro Elements
    timerTime: document.getElementById('timer-time'),
    timerStatus: document.getElementById('timer-status'),
    timerProgress: document.getElementById('timer-progress'),
    btnTimerToggle: document.getElementById('btn-timer-toggle'),
    btnTimerReset: document.getElementById('btn-timer-reset'),
    iconPlay: document.getElementById('icon-play'),
    iconPause: document.getElementById('icon-pause'),
    modeTabs: document.querySelectorAll('.mode-tab'),
    
    // Sound Elements
    soundItems: document.querySelectorAll('.sound-item'),
    
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
    timer: {
      intervalId: null,
      duration: 1500, // Default 25 minutes
      remaining: 1500,
      mode: 'focus', // focus, short, long
      isRunning: false
    },
    tasks: [],
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
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce on borders
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        // Mouse reaction (subtle attraction)
        if (STATE.mouse.x !== null && STATE.mouse.y !== null) {
          const dx = STATE.mouse.x - this.x;
          const dy = STATE.mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180) {
            const force = (180 - distance) / 180;
            this.x += (dx / distance) * force * 0.6;
            this.y += (dy / distance) * force * 0.6;
          }
        }
      }
      
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`; // Sleek purple particles
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
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
      
      // Draw a soft glowing gradient at mouse position
      if (STATE.mouse.x !== null && STATE.mouse.y !== null) {
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
      drone: null
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
          // Double quick chirp
          osc.frequency.setValueAtTime(3200, now);
          osc.frequency.exponentialRampToValueAtTime(3800, now + 0.04);
          osc.frequency.exponentialRampToValueAtTime(2800, now + 0.08);
          
          tweetGain.gain.setValueAtTime(0, now);
          tweetGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
          tweetGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
          
          // Second chirp
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
          // Simple sweet slide
          osc.frequency.setValueAtTime(2400, now);
          osc.frequency.exponentialRampToValueAtTime(3400, now + 0.12);
          
          tweetGain.gain.setValueAtTime(0, now);
          tweetGain.gain.linearRampToValueAtTime(0.06, now + 0.02);
          tweetGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          
          osc.start(now);
          osc.stop(now + 0.15);
        } else {
          // Rapid warble (3 chirps)
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
        // Only trigger bird sounds randomly every 3-8 seconds
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
      
      // Deep focus notes (Detuned low hum)
      oscA.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      oscB.frequency.setValueAtTime(55.4, this.ctx.currentTime); // detuned by 0.4Hz for natural analog chorus
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      
      // Slow pulsing drone LFO
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
    
    // Synthesize a beautiful Metallic Meditation Bowl chime dynamically!
    playZenBowlChime() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Harmonic Series for metal chimes
      const frequencies = [220, 442, 663, 885, 1105, 1330];
      const gains = [0.25, 0.15, 0.12, 0.08, 0.05, 0.02];
      
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.4, now + 0.01);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5); // long organic decay
      
      // Resonance filter
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
        // Slight frequency modulation to sound natural
        osc.frequency.linearRampToValueAtTime(freq + (Math.random() * 2 - 1), now + 4.0);
        
        osc.connect(oscGain);
        oscGain.connect(chimeGain);
        
        osc.start(now);
        osc.stop(now + 6.0);
      });
    },
    
    // Toggle active synthesizer state
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
        // Ramp up volume
        const vol = sliderValue / 100 * 0.75;
        synth.gainNode.gain.setValueAtTime(0, now);
        synth.gainNode.gain.linearRampToValueAtTime(vol, now + 0.5);
      } else {
        // Ramp down volume
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
    }
  };

  // Soundscape slider and toggle handlers
  const setupSoundscapes = () => {
    UI.soundItems.forEach(item => {
      const id = item.id.replace('sound-', '');
      const toggleBtn = item.querySelector('.sound-toggle-btn');
      const slider = item.querySelector('.sound-slider');
      const progress = item.querySelector('.slider-progress');
      
      // Update custom background track slider
      const updateSliderTrack = (val) => {
        progress.style.width = `${val}%`;
      };
      
      updateSliderTrack(slider.value);
      
      // Button Toggle
      toggleBtn.addEventListener('click', () => {
        // Prompt audio engine
        if (!STATE.audioInitialized) {
          AUDIO.init();
        }
        
        // If slider is 0, give it a default volume on activate
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
      });
      
      // Slider Input
      slider.addEventListener('input', (e) => {
        const val = e.target.value;
        updateSliderTrack(val);
        
        // Auto-enable if volume is dragged up from 0
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
      });
    });
  };

  // Space Entry handler (Browser Consent policy)
  UI.btnEnter.addEventListener('click', () => {
    UI.overlay.classList.add('hidden');
    // Start Audio engine
    AUDIO.init();
    
    // Set low default focus drone for automatic smooth backdrop hum
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
  // 5. POMODORO FOCUS TIMER CHAMBER
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
    
    // Update SVG Stroke Progress Circle
    const strokeDash = 678.58; // circle length
    const percent = STATE.timer.remaining / STATE.timer.duration;
    UI.timerProgress.style.strokeDashoffset = strokeDash * (1 - percent);
  };

  const handleTimerComplete = () => {
    clearInterval(STATE.timer.intervalId);
    STATE.timer.isRunning = false;
    
    UI.iconPlay.classList.remove('hidden');
    UI.iconPause.classList.add('hidden');
    
    // Play beautiful Meditation Bowl Chime dynamically!
    AUDIO.playZenBowlChime();
    
    // Display completion message
    UI.timerStatus.textContent = "Session Complete!";
    
    // Create immediate alert modal
    setTimeout(() => {
      alert(STATE.timer.mode === 'focus' ? "ZenFocus complete! Time for a breath." : "Break complete! Ready to return into focus?");
      resetTimer();
    }, 200);
  };

  const toggleTimer = () => {
    // If not running, start
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
      // Pause timer
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

  // Timer tab clicking
  UI.modeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
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
  // 6. DYNAMIC KANBAN TASK DESK (WITH DRAG & DROP & LOCAL STORAGE)
  // ==========================================================================
  
  // Render task counter stats
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
    
    // Toggle empty message states
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

  // Save tasks array to localStorage
  const saveTasks = () => {
    localStorage.setItem('zenfocus_tasks', JSON.stringify(STATE.tasks));
    updateTaskCounts();
  };

  // Render a task item card in the DOM
  const renderTaskCard = (task) => {
    const card = document.createElement('div');
    card.className = `task-item ${task.status === 'completed' ? 'completed-task' : ''}`;
    card.id = `task-${task.id}`;
    card.draggable = true;
    
    // Priority markup
    const priBadge = `<span class="priority-tag ${task.priority}">${task.priority}</span>`;
    
    // Check icon or box based on completion status
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

    // Drag listeners on card
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', task.id);
    });
    
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    // Check complete listener
    card.querySelector('.btn-check').addEventListener('click', () => {
      if (task.status === 'completed') {
        task.status = 'todo';
      } else {
        task.status = 'completed';
      }
      saveTasks();
      reloadTasksView();
    });

    // Delete listener
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

  // Re-render columns from state
  const reloadTasksView = () => {
    // Clear list boxes except empty-msg divs
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

  // Drag and Drop Board Event handling
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
          // If moved to completed, update visually, or vice versa
          task.status = targetStatus;
          saveTasks();
          reloadTasksView();
        }
      });
    });
  };

  // Form submit add task listener
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

  // Load Tasks from Storage
  const loadTasks = () => {
    const saved = localStorage.getItem('zenfocus_tasks');
    if (saved) {
      try {
        STATE.tasks = JSON.parse(saved);
      } catch(err) {
        STATE.tasks = [];
      }
    } else {
      // Setup beautiful initial sample tasks
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
  // 7. INSPIRATION 3D FLIP CARD LOGIC
  // ==========================================================================
  const flipQuoteCard = () => {
    const isFlipped = UI.quoteCardInner.classList.toggle('flipped');
    
    // Choose next random quote index
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * STATE.quotes.length);
    } while(nextIdx === STATE.currentQuoteIndex && STATE.quotes.length > 1);
    
    STATE.currentQuoteIndex = nextIdx;
    const quote = STATE.quotes[nextIdx];

    // Load content onto the back face before completing the rotation
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

  // Setup click listeners for 3D flip card
  UI.btnNewQuote.addEventListener('click', (e) => {
    e.stopPropagation();
    flipQuoteCard();
  });

  UI.btnNewQuoteBack.addEventListener('click', (e) => {
    e.stopPropagation();
    flipQuoteCard();
  });

  // Flip when container body itself is clicked
  UI.quoteCardInner.addEventListener('click', flipQuoteCard);


  // ==========================================================================
  // 8. AUTO-SAVE JOURNAL DESK LOGIC
  // ==========================================================================
  const setupJournal = () => {
    // Load existing
    const savedJournal = localStorage.getItem('zenfocus_journal');
    if (savedJournal) {
      UI.journalInput.value = savedJournal;
    }
    
    let saveTimeout = null;
    UI.journalInput.addEventListener('input', (e) => {
      clearTimeout(saveTimeout);
      
      // Debounce saving to disk (wait for 800ms pause)
      saveTimeout = setTimeout(() => {
        localStorage.setItem('zenfocus_journal', e.target.value);
        
        // Briefly animate the "Auto-saved" indicator
        UI.journalSaved.classList.remove('hidden');
        
        // Remove and hide after animation completes
        setTimeout(() => {
          UI.journalSaved.classList.add('hidden');
        }, 2500);
      }, 800);
    });
  };

  // ==========================================================================
  // 9. INITIALIZE SYSTEM
  // ==========================================================================
  initCanvasBackground();
  setupSoundscapes();
  loadTasks();
  setupDragAndDrop();
  setupJournal();
  
  console.log("ZenFocus successfully booted and loaded.");
});
