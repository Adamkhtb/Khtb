// Edit Mode for Portfolio Site - Fonts & Colors Only
class EditMode {
    constructor() {
        this.isEditMode = false;
        this.editToggle = document.getElementById('edit-mode-toggle');
        this.editToggleMobile = document.getElementById('edit-mode-toggle-mobile');
        this.fontPanel = null;
        this.colorPanel = null;
        
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
        
        // Handle mobile edit button
        if (this.editToggleMobile) {
            this.editToggleMobile.addEventListener('click', (e) => {
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
        
        // Create font and color panels
        this.createFontPanel();
        this.createColorPanel();
        
        // Show popup for both desktop and mobile
        this.showMobilePopup("Don't like my site? Fine you can fix it.");
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideMobilePopup();
        }, 3000);
        
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
        
        // Update mobile button text and styling
        if (this.editToggleMobile) {
            this.editToggleMobile.textContent = this.isEditMode ? 'Exit Edit' : 'Edit Mode';
            this.editToggleMobile.classList.toggle('primary', this.isEditMode);
        }
    }
    
    createFontPanel() {
        this.fontPanel = document.createElement('div');
        this.fontPanel.className = 'edit-panel font-panel';
        this.fontPanel.innerHTML = `
            <h3>Fonts</h3>
            <div class="font-controls">
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
            </div>
            <button id="reset-fonts" class="reset-button">Reset Fonts</button>
        `;
        
        document.body.appendChild(this.fontPanel);
        
        // Add event listeners
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
    }
    
    createColorPanel() {
        this.colorPanel = document.createElement('div');
        this.colorPanel.className = 'edit-panel color-panel';
        this.colorPanel.innerHTML = `
            <h3>Colors</h3>
            <div class="color-controls">
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
            </div>
            <button id="set-colors" class="set-button">Set Colors</button>
            <button id="reset-colors" class="reset-button">Reset Colors</button>
        `;
        
        document.body.appendChild(this.colorPanel);
        
        // Add event listeners
        document.getElementById('set-colors').addEventListener('click', () => {
            this.setColors();
        });
        
        document.getElementById('reset-colors').addEventListener('click', () => {
            this.resetColors();
        });
        
        // Add close button listeners using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-color')) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = e.target.getAttribute('data-target');
                const colorInput = document.getElementById(targetId);
                
                // Hide the close button immediately
                e.target.style.display = 'none';
                
                // Prevent the color picker from reopening
                if (colorInput) {
                    colorInput.style.pointerEvents = 'none';
                    colorInput.blur();
                    // Re-enable after a brief delay
                    setTimeout(() => {
                        colorInput.style.pointerEvents = 'auto';
                    }, 200);
                }
            }
        });
        
        // Attach event listeners to all color inputs
        this.attachColorInputListeners();
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
            
            // Hide close button when color changes
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
    
    showExitMessage() {
        // Show popup for both desktop and mobile
        const exitContent = "Really? That's the best you can do?";
        this.showMobilePopup(exitContent);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideMobilePopup();
        }, 3000);
    }
    
    showMobilePopup(message) {
        const popup = document.getElementById('edit-mode-popup');
        const messageEl = document.getElementById('edit-popup-message');
        if (popup && messageEl) {
            messageEl.textContent = message;
            popup.classList.add('show');
        }
    }
    
    hideMobilePopup() {
        const popup = document.getElementById('edit-mode-popup');
        if (popup) {
            popup.classList.remove('show');
        }
    }
    
    resetFonts() {
        // Remove all custom font styles
        const customStyles = document.querySelectorAll('style[data-custom-font]');
        customStyles.forEach(style => style.remove());
        
        // Reset select values
        document.getElementById('heading-font').value = 'dico-mono';
        document.getElementById('body-font').value = 'dico-mono';
        document.getElementById('font-size').value = '16';
        document.getElementById('font-size-value').textContent = '16px';
        
        console.log('Fonts reset to original');
    }
    
    setColors() {
        // Get current color values from inputs
        const bgColor = document.getElementById('bg-color').value;
        const textColor = document.getElementById('text-color').value;
        const borderColor = document.getElementById('border-color').value;
        
        // Apply the colors using CSS custom properties
        this.applyColorChange('--bg', bgColor);
        this.applyColorChange('--text', textColor);
        this.applyColorChange('--border', borderColor);
        
        console.log('Colors applied:', { bgColor, textColor, borderColor });
    }
    
    resetColors() {
        // Reset to original colors
        this.applyColorChange('--bg', '#ffffff');
        this.applyColorChange('--text', '#000000');
        this.applyColorChange('--border', '#000000');
        
        // Reset color picker values
        document.getElementById('bg-color').value = '#ffffff';
        document.getElementById('text-color').value = '#000000';
        document.getElementById('border-color').value = '#000000';
        
        console.log('Colors reset to original');
    }
    
    removePanels() {
        if (this.fontPanel) {
            this.fontPanel.remove();
            this.fontPanel = null;
        }
        if (this.colorPanel) {
            this.colorPanel.remove();
            this.colorPanel = null;
        }
    }
}

// Initialize edit mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EditMode();
});