# 🌌 ZenFocus — Premium Ambient Productivity Workspace

ZenFocus is an ultra-modern, client-side productivity hub and focus room built with modern web technologies. It is fully self-contained, offline-first, and features procedural sound synthesizers that generate high-fidelity audio directly in the browser using the Web Audio API.

---

## ✨ Upgraded Feature Suite

ZenFocus now features 5 advanced cognitive-focus and sensory tools designed to support your work:

### 1. 🧘‍♂️ Zen Breathing Coach (Box Breathing)
- **Visual Circle Visualizer**: Generates a smooth CSS scaling circle mapping a 16-second box breathing loop (4s Inhale, 4s Hold, 4s Exhale, 4s Hold) with a glowing, pulse-breathing underlay.
- **Vocal Sweep Synthesizer**: Utilizes Web Audio API to sweep a low-pass filter and pitch frequency up during Inhale, hold it steady, sweep down during Exhale, and mute on Empty.

### 2. 🎧 Binaural Beats Generator (Neural Entrainment)
- **Stereo Panned Waveguides**: Separate left and right oscillator nodes set via stereo panners to separate ear channels.
- **Wave Selection**:
  - **Alpha Waves (10Hz difference)**: Left channel at 150Hz, Right channel at 160Hz. Induces cognitive focus.
  - **Theta Waves (5Hz difference)**: Left channel at 150Hz, Right channel at 155Hz. Induces creative calm.
- **Volume control**: Capped maximum volume specifically to protect your hearing.

### 3. 💾 Soundscape Presets & Custom Mix Slots
- **Default Presets**: One-click quick mixer buttons to trigger **⛈️ Storm**, **🌲 Forest Sanctuary**, and **🌊 Deep Ocean Wave** ratios.
- **Custom Mix Slots**: Allows users to save their current sound levels + binaural choices to Slot 1, 2, or 3, saving state permanently in `localStorage`.

### 4. 📊 Focus Metrics & Achievement Milestones
- **Tabbed Layout**: Switch between the active **Tasks Desk** and the new **Insights Desk** pane.
- **Focus Chart Graph**: Renders a sleek vertical bar chart generated dynamically using SVG rectangles and linear gradients, illustrating the user's focus minutes over the past 7 days.
- **Unlocked Achievement Badges**: Computes completed focus sessions and dynamically unlocks gold-glowing badge items (*Zen Initiate*, *Flow Master*, *Monk Mode Elite*) while keeping unearned milestones in grayscale locked states.

### 5. 🕯️ Minimalist "Monk Mode" Viewport
- **Visual Fading**: Toggling Monk Mode in the header fades out all widgets except the Pomodoro timer and reflection journal with a smooth `0.6s` transition.
- **Centered Layout**: Repositions these two cards into a centered vertical stack for zero-distraction.
- **Calming Speed**: Damps the canvas background particle float velocities down to 15% speed to encourage absolute visual calmness.

### 🌌 Visual Branding & Favicon
- **Brand Matching Favicon**: Powered by an inline **Data URI SVG Favicon** inside the `<head>` of `index.html`. It renders a vector-sharp glowing rounded square with a white focal dot in the browser tab, matching the header logo emblem and ensuring 100% reliable offline operations.

---

## 🚀 Running Locally

ZenFocus has zero external package requirements or dependencies. To spin it up locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/danumula/ZenFocus.git
   cd ZenFocus
   ```

2. **Start a local server**:
   You can serve the static files using Python's built-in module:
   ```bash
   python3 -m http.server 8000
   ```

3. **Enjoy the space**:
   Navigate to **`http://localhost:8000`** in your browser.

---

## 🌐 Web Deployment (GitHub Pages)

The project is hosted and fully active on **GitHub Pages**! You can access it from any device at:
👉 **[https://danumula.github.io/ZenFocus/](https://danumula.github.io/ZenFocus/)**

---

## 🛠️ Tech Stack
- **Structure**: Semantic HTML5 markup
- **Style**: Modern Vanilla CSS3 utilizing Custom Properties, CSS variables, CSS grid/flex, and custom scrollbar bindings
- **Logic**: Pure Client-Side JavaScript (Vanilla ES6)
- **Audio**: Web Audio API (Oscillators, DynamicsCompressors, BiquadFilters, GainNodes, StereoPannerNodes)
- **Graphics**: HTML5 Canvas API & SVG Vector charts

---

*Made with 💜 by Dinesh Anumula. Simplified workflow, amplified mind.*
