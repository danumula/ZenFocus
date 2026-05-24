# 🌌 ZenFocus — Premium Ambient Productivity Workspace

ZenFocus is a premium, client-side productivity hub and focus room built with modern web technologies. It is fully self-contained, offline-first, and features procedural sound synthesizers that generate high-fidelity audio directly in the browser using the Web Audio API.

---

## ✨ Features

- **🎨 Rich Glassmorphism Design**: An ultra-modern responsive UI tailored with sleek dark modes, custom variables, neon ambient highlights, and fluid micro-animations.
- **🔊 Procedural Audio Engine (Web Audio API)**: Generates highly realistic ambient soundscapes client-side without downloading or streaming heavy media files:
  - **Rain**: Continuous mathematical white noise shaped by low-pass filters coupled with a randomized high-frequency impulse scheduler for crisp, individual droplet crackles.
  - **Ocean Waves**: White noise swept in frequency and volume by slow low-frequency oscillators (LFOs) to mimic rolling shorelines.
  - **Forest Birds**: Randomized sine-wave synthesis sweep algorithms mimicking real birds chirping.
  - **Focus Drone**: Low-frequency detuned analog triangle oscillators modulated by breathing filters to build a deep, warm backing soundscape.
- **⏱️ Focus Chamber (Pomodoro timer)**: Circular visual countdown dashboard utilizing animated SVG strokes. Plays a dynamically synthesized **Meditation Bowl Chime** (using detuned harmonic series frequencies) upon completion.
- **📋 Kanban Desk**: Drag-and-drop task card dashboard supporting customizable priority badges (High, Medium, Low) and column counters backed by `localStorage` persistence.
- **📝 Reflection Journal**: Debounced auto-save writing notepad indicating real-time saving status.
- **🃏 3D Quote Cards**: Hand-selected inspiring quotes using hardware-accelerated 3D card flips.
- **✨ Active Background Canvas**: Gentle floating nodes that react dynamically to cursor movements and window scaling.

---

## 🚀 Running Locally

ZenFocus has zero external package requirements or dependencies. To spin it up locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/zenfocus.git
   cd zenfocus
   ```

2. **Start a local server**:
   You can serve the static files using Python's built-in module:
   ```bash
   python3 -m http.server 8000
   ```

3. **Enjoy the space**:
   Navigate to **`http://localhost:8000`** in your browser.

---

## 🛠️ Tech Stack
- **Structure**: Semantic HTML5 markup
- **Style**: Modern Vanilla CSS3 utilizing Custom Properties, CSS variables, CSS grid/flex, and custom scrollbar bindings
- **Logic**: Pure Client-Side JavaScript (Vanilla ES6)
- **Audio**: Web Audio API (Oscillators, DynamicsCompressors, BiquadFilters, GainNodes)
- **Graphics**: HTML5 Canvas API

---

*Made with 💜 for developers who seek peace in their work environment.*
