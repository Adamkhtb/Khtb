// Edit Mode for Portfolio Site - User-Friendly Version
class EditMode {
    constructor() {
        this.isEditMode = false;
        this.editToggle = document.getElementById('edit-mode-toggle');
        this.activeTab = 'fonts';
        this.currentSettings = {
            headingFont: 'dico-mono',
            bodyFont: 'dico-mono',
            fontSize: 16,
            bgColor: '#ffffff',
            textColor: '#000000',
            borderColor: '#000000'
        };
        
        this.init();
    }
    
    init() {
        if (this.editToggle) {
            this.editToggle.style.display = 'inline-flex';
            this.editToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleEditMode();
            });
        }
        
        // Keyboard shortcut: Ctrl+E
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.toggleEditMode();
            }
        });
    }
    
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        if (this.isEditMode) {
            this.enableEditMode();
        } else {
            this.disableEditMode();
        }
        
        this.updateToggleButton();
    }
    
    enableEditMode() {
        document.body.classList.add('edit-mode');
        this.createEditPanel();
        // Show message after a brief delay to ensure it appears above the panel
        setTimeout(() => {
            this.showMessage("Don't like my site? Fine, you can fix it.", 'entry');
        }, 100);
    }
    
    disableEditMode() {
        document.body.classList.remove('edit-mode');
        this.removePanels();
        // Show exit message immediately
        setTimeout(() => {
            this.showMessage("Really? That's the best you can do?", 'exit');
        }, 100);
    }
    
    updateToggleButton() {
        if (this.editToggle) {
            this.editToggle.textContent = this.isEditMode ? 'Exit Edit' : 'Edit Mode';
            this.editToggle.classList.toggle('primary', this.isEditMode);
        }
    }
    
    createEditPanel() {
        const container = document.createElement('div');
        container.className = 'edit-panel-container';
        
        // Header with tabs and close button
        const header = document.createElement('div');
        header.className = 'edit-panel-header';
        header.innerHTML = `
            <div class="edit-tabs-header">
                <button class="edit-tab-btn active" data-tab="fonts">
                    Fonts
                </button>
                <button class="edit-tab-btn" data-tab="colors">
                    Colors
                </button>
            </div>
            <button class="edit-panel-close" title="Close Edit Mode (Ctrl+E)">×</button>
        `;
        
        // Fonts tab
        const fontsTab = document.createElement('div');
        fontsTab.className = 'edit-tab-content active';
        fontsTab.id = 'fonts-tab';
        fontsTab.innerHTML = `
            <div class="edit-section">
                <label class="edit-label">
                    <span class="label-text">Heading Font</span>
                    <select id="heading-font" class="edit-select">
                        <option value="dico-mono">Dico Mono (Default)</option>
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </label>
                
                <label class="edit-label">
                    <span class="label-text">Body Font</span>
                    <select id="body-font" class="edit-select">
                        <option value="dico-mono">Dico Mono (Default)</option>
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </label>
                
                <label class="edit-label">
                    <span class="label-text">
                        Font Size 
                        <span id="font-size-value" class="value-display">16px</span>
                    </span>
                    <input type="range" id="font-size" class="edit-range" min="12" max="24" value="16" step="1">
                    <div class="range-labels">
                        <span>Small</span>
                        <span>Large</span>
                    </div>
                </label>
            </div>
            
            <div class="edit-actions">
                <button id="reset-fonts" class="edit-button secondary">
                    ↺ Reset to Default
                </button>
            </div>
        `;
        
        // Colors tab
        const colorsTab = document.createElement('div');
        colorsTab.className = 'edit-tab-content';
        colorsTab.id = 'colors-tab';
        colorsTab.innerHTML = `
            <div class="edit-section">
                <label class="edit-label">
                    <span class="label-text">Background Color</span>
                    <div class="color-input-group">
                        <input type="color" id="bg-color" class="edit-color" value="#ffffff">
                        <input type="text" id="bg-color-hex" class="hex-input" value="#ffffff" maxlength="7">
                    </div>
                </label>
                
                <label class="edit-label">
                    <span class="label-text">Text Color</span>
                    <div class="color-input-group">
                        <input type="color" id="text-color" class="edit-color" value="#000000">
                        <input type="text" id="text-color-hex" class="hex-input" value="#000000" maxlength="7">
                    </div>
                </label>
                
                <label class="edit-label">
                    <span class="label-text">Border Color</span>
                    <div class="color-input-group">
                        <input type="color" id="border-color" class="edit-color" value="#000000">
                        <input type="text" id="border-color-hex" class="hex-input" value="#000000" maxlength="7">
                    </div>
                </label>
                
                <div class="color-presets">
                    <span class="label-text">Quick Presets:</span>
                    <div class="preset-buttons">
                        <button class="preset-btn" data-preset="light" title="Light Mode">Light</button>
                        <button class="preset-btn" data-preset="dark" title="Dark Mode">Dark</button>
                        <button class="preset-btn" data-preset="blue" title="Blue Theme">Blue</button>
                        <button class="preset-btn" data-preset="green" title="Green Theme">Green</button>
                    </div>
                </div>
            </div>
            
            <div class="edit-actions">
                <button id="apply-colors" class="edit-button primary">
                    ✓ Apply Colors
                </button>
                <button id="reset-colors" class="edit-button secondary">
                    ↺ Reset to Default
                </button>
            </div>
        `;
        
        container.appendChild(header);
        container.appendChild(fontsTab);
        container.appendChild(colorsTab);
        document.body.appendChild(container);
        
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Close button
        document.querySelector('.edit-panel-close').addEventListener('click', () => {
            this.toggleEditMode();
        });
        
        // Tab switching
        document.querySelectorAll('.edit-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Font controls - apply immediately
        document.getElementById('heading-font').addEventListener('change', (e) => {
            this.currentSettings.headingFont = e.target.value;
            this.applyFonts();
        });
        
        document.getElementById('body-font').addEventListener('change', (e) => {
            this.currentSettings.bodyFont = e.target.value;
            this.applyFonts();
        });
        
        document.getElementById('font-size').addEventListener('input', (e) => {
            const value = e.target.value;
            this.currentSettings.fontSize = value;
            document.getElementById('font-size-value').textContent = value + 'px';
            this.applyFonts();
        });
        
        document.getElementById('reset-fonts').addEventListener('click', () => {
            this.resetFonts();
        });
        
        // Color controls
        this.attachColorSync('bg-color');
        this.attachColorSync('text-color');
        this.attachColorSync('border-color');
        
        document.getElementById('apply-colors').addEventListener('click', () => {
            this.applyColors();
            this.showMessage('Colors applied!', 'success');
        });
        
        document.getElementById('reset-colors').addEventListener('click', () => {
            this.resetColors();
        });
        
        // Color presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.getAttribute('data-preset');
                this.applyPreset(preset);
            });
        });
    }
    
    attachColorSync(colorId) {
        const colorInput = document.getElementById(colorId);
        const hexInput = document.getElementById(colorId + '-hex');
        
        // Sync color picker to hex input
        colorInput.addEventListener('input', (e) => {
            hexInput.value = e.target.value;
            this.updateColorSetting(colorId, e.target.value);
        });
        
        // Sync hex input to color picker
        hexInput.addEventListener('input', (e) => {
            let hex = e.target.value;
            if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
                colorInput.value = hex;
                this.updateColorSetting(colorId, hex);
            }
        });
    }
    
    updateColorSetting(colorId, value) {
        if (colorId === 'bg-color') this.currentSettings.bgColor = value;
        if (colorId === 'text-color') this.currentSettings.textColor = value;
        if (colorId === 'border-color') this.currentSettings.borderColor = value;
    }
    
    switchTab(tab) {
        this.activeTab = tab;
        
        document.querySelectorAll('.edit-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        document.querySelectorAll('.edit-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
    }
    
    applyFonts() {
        // Remove old font styles
        document.querySelectorAll('style[data-custom-font]').forEach(s => s.remove());
        
        // Apply new fonts
        const style = document.createElement('style');
        style.setAttribute('data-custom-font', 'true');
        style.textContent = `
            h1, h2, h3, h4, h5, h6 { 
                font-family: "${this.currentSettings.headingFont}", sans-serif !important; 
            }
            body, p, div, span, a, button, input, textarea, select { 
                font-family: "${this.currentSettings.bodyFont}", sans-serif !important;
                font-size: ${this.currentSettings.fontSize}px !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    applyColors() {
        document.documentElement.style.setProperty('--bg', this.currentSettings.bgColor);
        document.documentElement.style.setProperty('--text', this.currentSettings.textColor);
        document.documentElement.style.setProperty('--border', this.currentSettings.borderColor);
        document.documentElement.style.setProperty('--card', this.currentSettings.bgColor);
        
        // Update header/footer backgrounds
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (header) header.style.background = this.currentSettings.bgColor;
        if (footer) footer.style.background = this.currentSettings.bgColor;
    }
    
    applyPreset(preset) {
        const presets = {
            light: { bg: '#ffffff', text: '#000000', border: '#000000' },
            dark: { bg: '#1a1a1a', text: '#ffffff', border: '#ffffff' },
            blue: { bg: '#e8f4f8', text: '#0a3d62', border: '#3498db' },
            green: { bg: '#e8f5e9', text: '#1b5e20', border: '#4caf50' }
        };
        
        const colors = presets[preset];
        if (!colors) return;
        
        this.currentSettings.bgColor = colors.bg;
        this.currentSettings.textColor = colors.text;
        this.currentSettings.borderColor = colors.border;
        
        document.getElementById('bg-color').value = colors.bg;
        document.getElementById('bg-color-hex').value = colors.bg;
        document.getElementById('text-color').value = colors.text;
        document.getElementById('text-color-hex').value = colors.text;
        document.getElementById('border-color').value = colors.border;
        document.getElementById('border-color-hex').value = colors.border;
        
        this.applyColors();
        this.showMessage(`${preset.charAt(0).toUpperCase() + preset.slice(1)} theme applied!`, 'success');
    }
    
    resetFonts() {
        this.currentSettings.headingFont = 'dico-mono';
        this.currentSettings.bodyFont = 'dico-mono';
        this.currentSettings.fontSize = 16;
        
        document.getElementById('heading-font').value = 'dico-mono';
        document.getElementById('body-font').value = 'dico-mono';
        document.getElementById('font-size').value = '16';
        document.getElementById('font-size-value').textContent = '16px';
        
        document.querySelectorAll('style[data-custom-font]').forEach(s => s.remove());
        this.showMessage('Fonts reset!', 'success');
    }
    
    resetColors() {
        this.currentSettings.bgColor = '#ffffff';
        this.currentSettings.textColor = '#000000';
        this.currentSettings.borderColor = '#000000';
        
        document.getElementById('bg-color').value = '#ffffff';
        document.getElementById('bg-color-hex').value = '#ffffff';
        document.getElementById('text-color').value = '#000000';
        document.getElementById('text-color-hex').value = '#000000';
        document.getElementById('border-color').value = '#000000';
        document.getElementById('border-color-hex').value = '#000000';
        
        this.applyColors();
        this.showMessage('Colors reset!', 'success');
    }
    
    showMessage(text, type = 'info') {
        console.log('Showing message:', text, type); // Debug log
        
        const popup = document.createElement('div');
        popup.className = `edit-message ${type}`;
        popup.textContent = text;
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000000;
            color: #ffffff;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            text-align: center;
            z-index: 10002;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            max-width: 320px;
            pointer-events: none;
        `;
        
        document.body.appendChild(popup);
        
        // Force reflow
        popup.offsetHeight;
        
        // Show the message
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.visibility = 'visible';
        }, 50);
        
        // Hide and remove
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.visibility = 'hidden';
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    }
    
    removePanels() {
        const container = document.querySelector('.edit-panel-container');
        if (container) container.remove();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new EditMode();
});