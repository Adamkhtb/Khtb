// Edit Mode for Portfolio Site - Fonts & Colors Only
class EditMode {
    constructor() {
        this.isEditMode = false;
        this.editToggle = document.getElementById('edit-mode-toggle');
        this.fontPanel = null;
        this.colorPanel = null;
        this.activeTab = 'fonts'; // Track which tab is active
        
        this.init();
    }
    
    init() {
        // Show edit button (hidden by default)
        if (this.editToggle) {
            this.editToggle.style.display = 'inline-flex';
            this.editToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleEditMode();
            });
        }
        
        // Keyboard shortcut: Ctrl+E to toggle edit mode
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
        // Add edit mode class to body
        document.body.classList.add('edit-mode');
        
        // Create unified edit panel with tabs
        this.createEditPanel();
        
        // Show entry message
        this.showEntryMessage();
        
        console.log('Edit mode enabled - Fonts & Colors');
    }
    
    disableEditMode() {
        // Remove edit mode class
        document.body.classList.remove('edit-mode');
        
        // Remove panels
        this.removePanels();
        
        // Show exit message
        this.showExitMessage();
        
        console.log('Edit mode disabled');
    }
    
    updateToggleButton() {
        if (this.editToggle) {
            this.editToggle.textContent = this.isEditMode ? 'Exit Edit' : 'Edit Mode';
            this.editToggle.classList.toggle('primary', this.isEditMode);
        }
    }
    
    createEditPanel() {
        // Create container
        const container = document.createElement('div');
        container.className = 'edit-panel-container';
        
        // Create tabs
        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'edit-tabs-header';
        tabsHeader.innerHTML = `
            <button class="edit-tab-btn active" data-tab="fonts">Fonts</button>
            <button class="edit-tab-btn" data-tab="colors">Colors</button>
        `;
        
        // Fonts tab content
        const fontsContent = document.createElement('div');
        fontsContent.className = 'edit-tab-content active';
        fontsContent.id = 'fonts-tab';
        fontsContent.innerHTML = `
            <label>
                <span>Heading Font:</span>
                <select id="heading-font">
                    <option value="dico-mono">Dico Mono</option>
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                </select>
            </label>
            <label>
                <span>Body Font:</span>
                <select id="body-font">
                    <option value="dico-mono">Dico Mono</option>
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                </select>
            </label>
            <label>
                <span>Font Size:</span>
                <input type="range" id="font-size" min="12" max="24" value="16">
                <span id="font-size-value">16px</span>
            </label>
            <button id="reset-fonts" class="reset-button">Reset Fonts</button>
        `;
        
        // Colors tab content
        const colorsContent = document.createElement('div');
        colorsContent.className = 'edit-tab-content';
        colorsContent.id = 'colors-tab';
        colorsContent.innerHTML = `
            <label>
                <span>Background:</span>
                <div class="color-input-wrapper">
                    <button class="close-color" data-target="bg-color">×</button>
                    <input type="color" id="bg-color" value="#ffffff">
                </div>
            </label>
            <label>
                <span>Text:</span>
                <div class="color-input-wrapper">
                    <button class="close-color" data-target="text-color">×</button>
                    <input type="color" id="text-color" value="#000000">
                </div>
            </label>
            <label>
                <span>Border:</span>
                <div class="color-input-wrapper">
                    <button class="close-color" data-target="border-color">×</button>
                    <input type="color" id="border-color" value="#000000">
                </div>
            </label>
            <button id="set-colors" class="set-button">Set Colors</button>
            <button id="reset-colors" class="reset-button">Reset Colors</button>
        `;
        
        // Assemble panel
        container.appendChild(tabsHeader);
        container.appendChild(fontsContent);
        container.appendChild(colorsContent);
        
        document.body.appendChild(container);
        
        // Store references
        this.fontPanel = fontsContent;
        this.colorPanel = colorsContent;
        
        // Tab switching
        tabsHeader.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-tab-btn')) {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab, tabsHeader);
            }
        });
        
        // Font controls
        document.getElementById('heading-font').addEventListener('change', (e) => {
            this.applyFontChange('h1, h2, h3', e.target.value);
        });
        
        document.getElementById('body-font').addEventListener('change', (e) => {
            this.applyFontChange('body, p', e.target.value);
        });
        
        document.getElementById('font-size').addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('font-size-value').textContent = value + 'px';
            this.applyFontSize(value);
        });
        
        document.getElementById('reset-fonts').addEventListener('click', () => {
            this.resetFonts();
        });
        
        // Color controls
        document.getElementById('set-colors').addEventListener('click', () => {
            this.setColors();
        });
        
        document.getElementById('reset-colors').addEventListener('click', () => {
            this.resetColors();
        });
        
        // Close button listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-color')) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = e.target.getAttribute('data-target');
                const colorInput = document.getElementById(targetId);
                
                // Hide the close button immediately
                e.target.style.display = 'none';
                
                // Close the color picker
                if (colorInput) {
                    colorInput.blur();
                }
            }
        });
        
        // Attach color input listeners
        this.attachColorInputListeners();
    }
    
    switchTab(tab, tabsHeader) {
        this.activeTab = tab;
        
        // Update tab buttons
        tabsHeader.querySelectorAll('.edit-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabsHeader.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update content visibility
        document.querySelectorAll('.edit-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
    }
    
    attachColorInputListeners(specificInput = null) {
        const inputs = specificInput ? [specificInput] : document.querySelectorAll('input[type="color"]');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const closeBtn = input.parentElement.querySelector('.close-color');
                if (closeBtn) {
                    closeBtn.style.display = 'flex';
                }
            });
            
            input.addEventListener('blur', () => {
                const closeBtn = input.parentElement.querySelector('.close-color');
                if (closeBtn) {
                    closeBtn.style.display = 'none';
                }
            });
            
            input.addEventListener('change', () => {
                const closeBtn = input.parentElement.querySelector('.close-color');
                if (closeBtn) {
                    closeBtn.style.display = 'none';
                }
            });
        });
    }
    
    applyFontChange(selector, fontFamily) {
        const style = document.createElement('style');
        style.setAttribute('data-custom-font', 'true');
        style.textContent = `${selector} { font-family: "${fontFamily}", sans-serif !important; }`;
        document.head.appendChild(style);
    }
    
    applyFontSize(size) {
        const style = document.createElement('style');
        style.setAttribute('data-custom-font', 'true');
        style.textContent = `body { font-size: ${size}px !important; }`;
        document.head.appendChild(style);
    }
    
    applyColorChange(cssVar, color) {
        document.documentElement.style.setProperty(cssVar, color);
    }
    
    showEntryMessage() {
        const entryContent = "Don't like my site? Fine you can fix it.";
        
        // Create entry message popup
        const popup = document.createElement('div');
        popup.className = 'entry-message-popup';
        popup.innerHTML = `
            <div class="entry-message-content">
                <p>${entryContent}</p>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .entry-message-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #000000;
                color: #ffffff;
                padding: 20px 30px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                text-align: center;
                z-index: 10001;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                max-width: 300px;
                width: 90%;
            }
            
            .entry-message-popup.show {
                opacity: 1;
                visibility: visible;
            }
            
            .entry-message-content p {
                margin: 0;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(popup);
        
        // Show popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);
        
        // Hide and remove popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
                style.remove();
            }, 300);
        }, 3000);
    }
    
    showExitMessage() {
        const exitContent = "Really? That's the best you can do?";
        
        // Create exit message popup
        const popup = document.createElement('div');
        popup.className = 'exit-message-popup';
        popup.innerHTML = `
            <div class="exit-message-content">
                <p>${exitContent}</p>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .exit-message-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #000000;
                color: #ffffff;
                padding: 20px 30px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                text-align: center;
                z-index: 10001;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                max-width: 300px;
                width: 90%;
            }
            
            .exit-message-popup.show {
                opacity: 1;
                visibility: visible;
            }
            
            .exit-message-content p {
                margin: 0;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(popup);
        
        // Show popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);
        
        // Hide and remove popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
                style.remove();
            }, 300);
        }, 3000);
    }
    
    resetFonts() {
        const customStyles = document.querySelectorAll('style[data-custom-font]');
        customStyles.forEach(style => style.remove());
        
        document.getElementById('heading-font').value = 'dico-mono';
        document.getElementById('body-font').value = 'dico-mono';
        document.getElementById('font-size').value = '16';
        document.getElementById('font-size-value').textContent = '16px';
        
        console.log('Fonts reset to original');
    }
    
    setColors() {
        const bgColor = document.getElementById('bg-color').value;
        const textColor = document.getElementById('text-color').value;
        const borderColor = document.getElementById('border-color').value;
        
        this.applyColorChange('--bg', bgColor);
        this.applyColorChange('--text', textColor);
        this.applyColorChange('--border', borderColor);
        
        console.log('Colors applied:', { bgColor, textColor, borderColor });
    }
    
    resetColors() {
        this.applyColorChange('--bg', '#ffffff');
        this.applyColorChange('--text', '#000000');
        this.applyColorChange('--border', '#000000');
        
        document.getElementById('bg-color').value = '#ffffff';
        document.getElementById('text-color').value = '#000000';
        document.getElementById('border-color').value = '#000000';
        
        console.log('Colors reset to original');
    }
    
    removePanels() {
        const container = document.querySelector('.edit-panel-container');
        if (container) {
            container.remove();
        }
        this.fontPanel = null;
        this.colorPanel = null;
    }
}

// Initialize edit mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EditMode();
});