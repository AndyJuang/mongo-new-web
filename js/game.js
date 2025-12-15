import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LOCATIONS } from './data.js';

// --- Game Manager (State & Logic) ---
window.GameManager = {
    state: { cleared: [] },
    currentLocationId: null,

    init() {
        const saved = localStorage.getItem('anping_save');
        if (saved) {
            this.state = JSON.parse(saved);
            console.log("📂 Save loaded:", this.state);
            // Optional: Small visual cue could go here, but avoiding alert() on startup is better UX
        }
        this.updateMapUI();

        // Setup global video error handler
        document.getElementById('video-player').addEventListener('error', (e) => {
            const src = e.target.getAttribute('src');
            if (src) {
                this.showMissingAssetOverlay(src, 'video');
            }
        }, true);

        // Background Music Autoplay Handling
        const bgMusic = document.getElementById('bg-music');
        bgMusic.volume = 0.5; // Set initial volume

        const startMusic = () => {
            bgMusic.play().then(() => {
                console.log("BGM Started");
                document.removeEventListener('click', startMusic);
                document.removeEventListener('touchstart', startMusic);
            }).catch(e => console.log("BGM Autoplay prevented"));
        };

        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);
    },

    resetProgress() {
        localStorage.removeItem('anping_save');
        this.state.cleared = [];
        this.updateMapUI();
        alert("進度已重置");
    },

    updateMapUI() {
        Object.keys(LOCATIONS).forEach(id => {
            const el = document.getElementById(`pin-${id}`);
            const data = LOCATIONS[id];

            let statusClass = '';
            let statusText = data.title;

            if (this.state.cleared.includes(id)) {
                statusClass = 'unlocked solved';
                statusText = "已過關<br>Solved";
            } else {
                statusClass = '';
            }

            el.className = `map-piece ${statusClass}`;

            // Injecting IMG to detect load error
            el.innerHTML = `
                <img src="${data.thumb}" 
                    style="position:absolute; width:100%; height:100%; object-fit:cover; z-index:0; opacity: ${this.state.cleared.includes(id) ? 1 : 0.5}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="missing-asset-alert" style="display:none; position:absolute; width:100%; height:100%; z-index:1; background:#222; flex-direction:column; align-items:center; justify-content:center; border: 1px dashed #666;">
                    <span style="font-size:30px;">🖼️</span>
                    <span style="font-size:10px; color:#e15f41; text-align:center; padding:2px;">Missing:<br>${data.thumb}</span>
                </div>
                <div style="z-index:2; position:relative; text-shadow:0 0 4px #000;">${statusText}</div>
            `;

            // Re-bind click event
            el.onclick = () => this.enterLevel(id);
        });
    },

    enterLevel(id) {
        this.currentLocationId = id;
        const data = LOCATIONS[id];

        // Remove any existing missing overlay
        const existingOverlay = document.getElementById('missing-video-overlay');
        if (existingOverlay) existingOverlay.remove();

        // UI Switch
        document.getElementById('map-container').classList.add('hidden');
        document.getElementById('game-view').classList.remove('hidden');

        // Update Text
        document.getElementById('level-title').innerText = data.title;
        document.getElementById('puzzle-text-zh').innerText = data.puzzle.zh;
        document.getElementById('puzzle-text-en').innerText = data.puzzle.en;
        document.getElementById('puzzle-answer').value = ""; // Clear input

        // Start 3D
        ThreeEngine.loadScene(data);

        // Bind Minigame Button
        document.getElementById('btn-start-minigame').onclick = () => {
            MiniGameManager.start(data.minigameType, data);
        };
    },

    backToMap() {
        document.getElementById('game-view').classList.add('hidden');
        document.getElementById('map-container').classList.remove('hidden');
        AudioManager.stop();
        ThreeEngine.stop();
        this.updateMapUI();

        // Clear video overlay
        const existingOverlay = document.getElementById('missing-video-overlay');
        if (existingOverlay) existingOverlay.remove();
    },

    submitAnswer() {
        const input = document.getElementById('puzzle-answer').value.trim();
        const data = LOCATIONS[this.currentLocationId];

        if (input.toUpperCase() === data.puzzle.answer.toUpperCase()) {
            alert(`✅ 正確！\n${data.puzzle.successMsg}`);
            if (!this.state.cleared.includes(this.currentLocationId)) {
                this.state.cleared.push(this.currentLocationId);
                localStorage.setItem('anping_save', JSON.stringify(this.state));
            }
            this.backToMap();
        } else {
            alert("❌ 答案錯誤，請再試一次 (或是檢查小遊戲獲得的線索)");
        }
    },

    showMissingAssetOverlay(filename, type) {
        if (type === 'video') {
            const container = document.getElementById('game-view');
            let overlay = document.getElementById('missing-video-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'missing-video-overlay';
                overlay.style.cssText = `
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    border: 2px dashed #e15f41; background: rgba(0,0,0,0.85); color: #fff;
                    padding: 20px; z-index: 2000; text-align: center; max-width: 80%;
                 `;
                container.appendChild(overlay);
            }
            overlay.innerHTML = `
                <h3 style="color:#e15f41; margin:0 0 10px 0;">⚠️ 缺少檔案 Missing File</h3>
                <p style="font-family:monospace; word-break:break-all;">${filename}</p>
                <p style="font-size:12px; color:#aaa;">請將 360 影片檔案放入 assets 資料夾<br>Please place the 360 video file in assets folder</p>
             `;
        }
    }
};

// --- Audio Manager (Web Speech API) ---
window.AudioManager = {
    voices: [],

    init() {
        // Pre-load voices because getVoices() is async in Chrome
        const loadVoices = () => {
            this.voices = window.speechSynthesis.getVoices();
            console.log(`Loaded ${this.voices.length} voices`);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    },

    playVoice(lang) {
        const id = GameManager.currentLocationId;
        if (!id) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const data = LOCATIONS[id];
        const text = lang === 'zh' ? data.puzzle.zh : data.puzzle.en;

        if (!text) {
            alert("沒有可朗讀的文字 / No text to read");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Robust Voice Selection
        if (this.voices.length === 0) {
            this.voices = window.speechSynthesis.getVoices();
        }

        let selectedVoice = null;
        if (lang === 'zh') {
            // Try explicit zh-TW voices first, then any Chinese
            selectedVoice = this.voices.find(v => v.lang === 'zh-TW') ||
                this.voices.find(v => v.lang.includes('zh')) ||
                this.voices.find(v => v.name.includes('Chinese') || v.name.includes('Taiwan'));
            utterance.lang = 'zh-TW';
        } else {
            selectedVoice = this.voices.find(v => v.lang === 'en-US') ||
                this.voices.find(v => v.lang.startsWith('en'));
            utterance.lang = 'en-US';
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log("Using voice:", selectedVoice.name);
        } else {
            console.warn("No specific voice found for", lang, "using system default.");
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Volume Ducking
        const video = document.getElementById('video-player');
        const bgMusic = document.getElementById('bg-music');

        utterance.onstart = () => {
            console.log("Speech started");
            if (video) video.volume = 0.1;
            if (bgMusic) bgMusic.volume = 0.1;
        };

        const restoreVolume = () => {
            console.log("Speech ended/stopped");
            if (video) video.volume = 1.0;
            if (bgMusic) bgMusic.volume = 0.5;
        };

        utterance.onend = restoreVolume;
        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            restoreVolume();
        };

        window.speechSynthesis.speak(utterance);
    },

    stop() {
        window.speechSynthesis.cancel();
        const video = document.getElementById('video-player');
        const bgMusic = document.getElementById('bg-music');
        if (video) video.volume = 1.0;
        if (bgMusic) bgMusic.volume = 0.5;
    }
};

// Initiate voice loading immediately
window.AudioManager.init();

// --- Mini-Game Manager (The New Feature) ---
window.MiniGameManager = {
    overlay: document.getElementById('minigame-overlay'),
    container: document.getElementById('game-dynamic-area'),

    start(type, data) {
        this.overlay.classList.remove('hidden');
        this.container.innerHTML = ""; // Clear previous

        // Render specific game based on type
        if (type === 'dragdrop') this.renderDragDrop(data);
        else if (type === 'sequence') this.renderSequence(data);
        else if (type === 'rotate') this.renderRotate(data);
        else if (type === 'slider') this.renderSlider(data);
        else if (type === 'scratch') this.renderScratch(data);
    },

    close() {
        this.overlay.classList.add('hidden');
    },

    win(code) {
        alert(`🎉 小遊戲通關！\n線索代碼是：${code}`);
        this.close();
    },

    // Game 1: Drag Drop
    renderDragDrop(data) {
        this.container.innerHTML = `
            <div style="color:white; margin-bottom:10px;">將碎片拖入框中 (點擊模擬)</div>
            <div id="drag-source">
                <div class="draggable" onclick="this.style.display='none'; document.getElementById('drop-count').innerText++">A</div>
                <div class="draggable" onclick="this.style.display='none'; document.getElementById('drop-count').innerText++">B</div>
                <div class="draggable" onclick="this.style.display='none'; document.getElementById('drop-count').innerText++">C</div>
            </div>
            <div class="dropzone">已收集: <span id="drop-count">0</span> / 3</div>
            <button class="btn-retro" style="margin-top:10px" onclick="
                if(document.getElementById('drop-count').innerText == '3') MiniGameManager.win('${data.puzzle.answer}')
            ">檢查</button>
        `;
    },

    // Game 2: Sequence Click
    renderSequence(data) {
        this.container.innerHTML = `
            <div style="color:white; margin-bottom:10px;">點擊順序：紅 -> 綠 -> 藍</div>
            <div style="display:flex; gap:10px;">
                <div style="width:50px; height:50px; background:red; cursor:pointer;" onclick="window.seq='R'"></div>
                <div style="width:50px; height:50px; background:green; cursor:pointer;" onclick="window.seq+='G'"></div>
                <div style="width:50px; height:50px; background:blue; cursor:pointer;" onclick="window.seq+='B'"></div>
            </div>
            <button class="btn-retro" style="margin-top:20px" onclick="
                if(window.seq === 'RGB') MiniGameManager.win('${data.puzzle.answer}');
                else { alert('順序錯誤'); window.seq=''; }
            ">驗證</button>
        `;
        window.seq = '';
    },

    // Game 3: Rotate
    renderRotate(data) {
        this.container.innerHTML = `
            <div style="color:white;">旋轉羅盤直到指針向上</div>
            <div class="compass" id="compass-dial" style="transform: rotate(45deg);"></div>
            <input type="range" min="0" max="360" value="45" style="width:80%; margin-top:20px;" 
                oninput="document.getElementById('compass-dial').style.transform = 'rotate('+this.value+'deg)'; 
                if(Math.abs(this.value - 0) < 10 || Math.abs(this.value - 360) < 10) document.getElementById('btn-rot').style.display='block';">
            <button id="btn-rot" class="btn-retro" style="display:none; margin-top:10px" onclick="MiniGameManager.win('${data.puzzle.answer}')">鎖定方位</button>
        `;
    },

    // Game 4: Slider
    renderSlider(data) {
        this.container.innerHTML = `
            <div style="color:white;">調整頻率至 95</div>
            <h1 id="freq-disp" style="color:var(--primary-color)">50</h1>
            <input type="range" min="0" max="100" value="50" style="width:80%;"
                oninput="document.getElementById('freq-disp').innerText = this.value;
                if(this.value == 95) document.getElementById('btn-freq').style.display='block';">
            <button id="btn-freq" class="btn-retro" style="display:none; margin-top:10px" onclick="MiniGameManager.win('${data.puzzle.answer}')">接收訊號</button>
        `;
    },

    // Game 5: Scratch (Canvas)
    renderScratch(data) {
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 100;
        canvas.style.background = '#fff'; // Result text hidden under
        const ctx = canvas.getContext('2d');

        // Draw cover
        ctx.fillStyle = '#666';
        ctx.fillRect(0, 0, 200, 100);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText("刮開這裡 / Scratch Me", 30, 55);

        // Scratch Logic
        let isDrawing = false;
        const scratch = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
        };

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('touchstart', () => isDrawing = true);
        window.addEventListener('mouseup', () => isDrawing = false);
        window.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchmove', scratch);

        this.container.innerHTML = `<div style="position:relative; width:200px; height:100px;">
            <div style="position:absolute; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#000; font-weight:bold; background:gold;">結局代碼: ${data.puzzle.answer}</div>
            <div id="canvas-wrapper" style="position:absolute; top:0;"></div>
        </div>
        <div style="margin-top:10px; color:#aaa;">完成後手動輸入代碼</div>`;
        this.container.querySelector('#canvas-wrapper').appendChild(canvas);
    }
};

// --- Three.js Engine ---
const ThreeEngine = {
    scene: null, camera: null, renderer: null, videoTexture: null,
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 0.1); // Inside sphere

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableZoom = false;
        controls.rotateSpeed = -0.5;

        // Basic sphere
        const geometry = new THREE.SphereGeometry(60, 60, 40);
        geometry.scale(-1, 1, 1); // Invert

        // Video Texture setup
        const video = document.getElementById('video-player');
        this.videoTexture = new THREE.VideoTexture(video);
        this.videoTexture.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshBasicMaterial({ map: this.videoTexture });
        this.sphere = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.sphere);

        // Add Video Player error logging to help debug
        video.onerror = (e) => {
            console.error("Video Player Error:", video.error);
        };

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.animate();
    },

    loadScene(data) {
        const video = document.getElementById('video-player');

        // Reset materials
        this.material.map = this.videoTexture;
        this.material.wireframe = false;

        if (data.video) {
            video.src = data.video;
            video.play().catch(e => {
                // Often caught here if user hasn't interacted, but we handle missing files in GameManager.init error handling
                console.warn("Video autoplay blocked or format unsupported:", e);
            });
        } else {
            // Explicitly missing path in data
            GameManager.showMissingAssetOverlay('No video path configured', 'video');
            // Fallback visual
            video.pause();
            this.material.map = null;
            this.material.color.setHex(data.themeColor || 0x444444);
            this.material.wireframe = true;
        }
    },

    stop() {
        const video = document.getElementById('video-player');
        video.pause();
        video.src = ""; // Stop loading
    },

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
};

// --- Bootstrap ---
window.onload = () => {
    GameManager.init();
    ThreeEngine.init();
};

window.enterGame = function () {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('map-container').classList.remove('hidden');
    // Start music if needed, or wait for interaction
    const bgMusic = document.getElementById('bg-music');
    bgMusic.play().catch(e => console.log("Audio autoplay prevented"));
};
