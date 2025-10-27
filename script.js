document.addEventListener('DOMContentLoaded', function () {
	var yearEl = document.getElementById('y');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}

	// Update date and time
	var datetimeEl = document.getElementById('datetime');
	if (datetimeEl) {
		function updateDateTime() {
			var now = new Date();
			var options = { 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			};
			datetimeEl.textContent = now.toLocaleDateString('en-US', options);
		}
		
		updateDateTime();
		setInterval(updateDateTime, 1000); // Update every second
	}

	var adamEl = document.getElementById('label-adam');
	var alkEl = document.getElementById('label-alkhateeb');
	var headerEl = document.querySelector('header');
	var navbarEl = document.querySelector('.navbar');
	var footerEl = document.querySelector('footer');
	var bodyEl = document.body;
	
	if (adamEl && alkEl && headerEl && navbarEl && footerEl && bodyEl) {
		var ticking = false;
		var maxProgress = 600; // px to reach final scale
		var clamp = function (v, min, max) { return Math.max(min, Math.min(max, v)); };
		var lerp = function (a, b, t) { return a + (b - a) * t; };

		var update = function () {
			var y = window.scrollY || window.pageYOffset || 0;
			var t = clamp(y / maxProgress, 0, 1);
			var adamFontSize = lerp(48, 24, t);
			var alkFontSize = lerp(24, 48, t);
			var headerHeight = lerp(124, 64, t);
			var adamTranslateY = lerp(0, 0, t);
			var adamTranslateX = lerp(0, 0, t);
			var alkTranslateY = lerp(0, 0, t);
			var footerHeight = lerp(20, 60, t);
			var footerContentTranslateY = lerp(0, 15, t);
			
			adamEl.style.fontSize = adamFontSize.toFixed(1) + 'px';
			alkEl.style.fontSize = alkFontSize.toFixed(1) + 'px';
			alkEl.style.transform = 'translateY(' + alkTranslateY.toFixed(0) + 'px)';
			navbarEl.style.height = headerHeight.toFixed(0) + 'px';
			bodyEl.style.paddingTop = headerHeight.toFixed(0) + 'px';
			footerEl.style.paddingBottom = footerHeight.toFixed(0) + 'px';
			bodyEl.style.paddingBottom = (footerHeight.toFixed(0) + 3) + 'px';
			
			var footerContentEl = document.querySelector('.footer-content');
			if (footerContentEl) {
				footerContentEl.style.transform = 'translateY(' + footerContentTranslateY.toFixed(0) + 'px)';
			}
			
			ticking = false;
		};

		var onScroll = function () {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		update();
	}
});

// Flipbook gallery logic
// Generic flipbook initializer (supports multiple instances)
document.addEventListener('DOMContentLoaded', function () {
	var flipbooks = document.querySelectorAll('.flipbook');
	flipbooks.forEach(function (flipbook) {
		var pagesAttr = flipbook.getAttribute('data-pages') || '';
		var pages = pagesAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
		if (!pages.length) return;

		var idPrefix = flipbook.id.replace(/-flipbook$/, '');
		var prevBtn = document.getElementById(idPrefix + '-prev');
		var nextBtn = document.getElementById(idPrefix + '-next');
		var totalEl = document.getElementById(idPrefix + '-total');
		var currentEl = document.getElementById(idPrefix + '-current');

				var current = 0;
				var allowSpread = (flipbook.getAttribute('data-spread') || 'true') !== 'false';
				var isSpread = pages.length > 2 && !flipbook.id.includes('fix') && allowSpread; // Only show spreads if allowed

		var render = function () {
			flipbook.innerHTML = '';
			
			if (isSpread && current > 0 && current < pages.length - 1) {
				// Show spread (two pages side by side)
				var spread = document.createElement('div');
				spread.className = 'flipbook-spread';
				
				var img1 = new Image();
				img1.src = pages[current];
				img1.alt = 'Page ' + (current + 1);
				img1.decoding = 'async';
				img1.loading = 'eager';
				
				var img2 = new Image();
				img2.src = pages[current + 1];
				img2.alt = 'Page ' + (current + 2);
				img2.decoding = 'async';
				img2.loading = 'eager';
				
				spread.appendChild(img1);
				spread.appendChild(img2);
				flipbook.appendChild(spread);
			} else {
				// Show single page
				var img = new Image();
				img.src = pages[current];
				img.alt = 'Page ' + (current + 1);
				img.decoding = 'async';
				img.loading = 'eager';
				flipbook.appendChild(img);
			}
			
			if (currentEl) currentEl.textContent = String(current + 1);
		};

		if (totalEl) totalEl.textContent = String(pages.length);

		if (prevBtn) prevBtn.addEventListener('click', function () {
			if (isSpread && current > 1) {
				current -= 2; // Move back 2 pages for spreads
			} else {
				current = Math.max(0, current - 1);
			}
			render();
		});
		
		if (nextBtn) nextBtn.addEventListener('click', function () {
			if (isSpread && current < pages.length - 2) {
				current += 2; // Move forward 2 pages for spreads
			} else {
				current = Math.min(pages.length - 1, current + 1);
			}
			render();
		});

		flipbook.setAttribute('tabindex', '0');
		flipbook.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') {
				if (isSpread && current > 1) {
					current -= 2;
				} else {
					current = Math.max(0, current - 1);
				}
				render();
			}
			if (e.key === 'ArrowRight') {
				if (isSpread && current < pages.length - 2) {
					current += 2;
				} else {
					current = Math.min(pages.length - 1, current + 1);
				}
				render();
			}
		});

		var startX = 0;
		flipbook.addEventListener('touchstart', function (e) {
			if (!e.touches || !e.touches.length) return;
			startX = e.touches[0].clientX;
		}, { passive: true });
		flipbook.addEventListener('touchend', function (e) {
			var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
			var dx = endX - startX;
			if (Math.abs(dx) > 30) {
				if (dx > 0) {
					// Swipe right - go back
					if (isSpread && current > 1) {
						current -= 2;
					} else {
						current = Math.max(0, current - 1);
					}
				} else {
					// Swipe left - go forward
					if (isSpread && current < pages.length - 2) {
						current += 2;
					} else {
						current = Math.min(pages.length - 1, current + 1);
					}
				}
				render();
			}
		});

		var preload = function (index) {
			var iPrev = Math.max(0, index - 2);
			var iNext = Math.min(pages.length - 1, index + 2);
			[new Image(), new Image()].forEach(function (pre, idx) {
				pre.decoding = 'async';
				pre.loading = 'lazy';
				pre.src = pages[idx === 0 ? iPrev : iNext];
			});
		};

		flipbook.addEventListener('load', function () { preload(current); }, true);
		render();
	});
});


// Make project cards clickable (navigate to first link inside)
document.addEventListener('DOMContentLoaded', function () {
	var projectCards = document.querySelectorAll('.project');
	projectCards.forEach(function (card) {
		var primaryLink = card.querySelector('a[href]');
		if (!primaryLink) return;

		card.setAttribute('tabindex', '0');
		card.setAttribute('role', 'link');

		var navigate = function () {
			var href = primaryLink.getAttribute('href');
			var target = primaryLink.getAttribute('target');
			if (!href || href === '#') return;
			if (target === '_blank') {
				window.open(href, '_blank', 'noopener');
			} else {
				window.location.href = href;
			}
		};

		card.addEventListener('click', function (e) {
			if (e.target && e.target.closest('a')) return; // let inner links work normally
			navigate();
		});

		card.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				navigate();
			}
		});
	});
});

// Custom cursor (optional): dot follows mouse, hidden on touch and reduced motion
(function() {
	var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	if (prefersReduced || isTouch) return;
	var dot = document.createElement('div');
	dot.setAttribute('aria-hidden','true');
	dot.style.cssText = 'position:fixed;inset:auto;left:0;top:0;width:8px;height:8px;border-radius:50%;background:#000;mix-blend-mode:difference;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.02s linear;';
	document.body.appendChild(dot);
	window.addEventListener('mousemove', function(e){ dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, { passive: true });
})();

// Pause footer squares animation when footer is off-screen
(function(){
	var footer = document.querySelector('footer');
	if (!footer || !('IntersectionObserver' in window)) return;
	var obs = new IntersectionObserver(function(entries){
		entries.forEach(function(entry){
			if (entry.isIntersecting) {
				document.documentElement.style.setProperty('--footer-animate', '1');
			} else {
				document.documentElement.style.setProperty('--footer-animate', '0');
			}
		});
	}, { threshold: 0 });
	obs.observe(footer);
})();

// Mobile warning popup functionality
document.addEventListener('DOMContentLoaded', function() {
	// Check if user is on mobile and show popup
	function isMobile() {
		return window.innerWidth <= 768;
	}

	// Show popup only on mobile devices
	function checkAndShowPopup() {
		const popup = document.getElementById('mobileWarning');
		const hasSeenWarning = sessionStorage.getItem('mobileWarningDismissed');
		const isMobileDevice = isMobile();
		
		if (popup) {
			if (isMobileDevice && !hasSeenWarning) {
				popup.classList.remove('hidden');
			} else {
				popup.classList.add('hidden');
			}
		}
	}

	// Close popup
	window.closePopup = function() {
		const popup = document.getElementById('mobileWarning');
		if (popup) {
			popup.classList.add('hidden');
			sessionStorage.setItem('mobileWarningDismissed', 'true');
		}
	}

	// Set up popup event listeners
	function setupPopupEvents() {
		const popup = document.getElementById('mobileWarning');
		if (!popup) return;

		// Close button event listener
		const closeButton = popup.querySelector('.popup-close');
		if (closeButton) {
			closeButton.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				closePopup();
			});
		}

		// Close on overlay click (but not on popup content)
		popup.addEventListener('click', function(e) {
			if (e.target === this) {
				e.preventDefault();
				e.stopPropagation();
				closePopup();
			}
		});

		// Close on Escape key
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
				e.preventDefault();
				closePopup();
			}
		});
	}

	// Set up events after DOM is ready
	setupPopupEvents();

	// Check immediately when DOM is ready
	checkAndShowPopup();

	// Check on page load
	window.addEventListener('load', checkAndShowPopup);

	// Check on resize
	window.addEventListener('resize', checkAndShowPopup);
});

// Mobile edit mode popup close function
window.closeEditPopup = function() {
	const popup = document.getElementById('edit-mode-popup');
	if (popup) {
		popup.classList.remove('show');
	}
};

// Number Grid Animation
let numberGrid = null;

function initNumberGrid() {
    const canvas = document.getElementById('number-grid');
    const img = document.getElementById('profile-pic');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 48;
    const gridWidth = 25;
    
    // Calculate grid height based on image dimensions to match the photo size
    let gridHeight = 25;
    if (img && img.naturalHeight && img.naturalWidth) {
        // Get the actual displayed size of the image
        const imgRect = img.getBoundingClientRect();
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        // Calculate grid height based on canvas width and image aspect ratio
        const canvasWidth = gridWidth * cellSize;
        const canvasHeight = canvasWidth * aspectRatio;
        gridHeight = Math.ceil(canvasHeight / cellSize);
    }
    
    // Set canvas internal resolution
    canvas.width = gridWidth * cellSize;
    canvas.height = gridHeight * cellSize;
    ctx.imageSmoothingEnabled = false;
    
    // Check if device is touch/tablet/mobile (has touch capability)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let autoCursorX = gridWidth / 2;
    let autoCursorY = gridHeight / 2;
    let autoCursorVx = 0.05;
    let autoCursorVy = 0.03;
    
    let grid = [];
    let targetGrid = [];
    let mouseX = -1;
    let mouseY = -1;
    let time = 0;
    
    // Initialize grids
    function initGrid() {
        grid = [];
        targetGrid = [];
        for (let y = 0; y < gridHeight; y++) {
            grid[y] = [];
            targetGrid[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                grid[y][x] = 0;
                targetGrid[y][x] = 0;
            }
        }
    }
    
    function spreadInfluence(centerX, centerY) {
        const maxRadius = 12;
        
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxRadius) {
                    const angle = Math.atan2(dy, dx);
                    const noiseX = Math.sin(angle * 2.5 + x * 0.4 + time * 0.02) * 0.8;
                    const noiseY = Math.cos(angle * 2.2 + y * 0.4 + time * 0.025) * 0.8;
                    const pulse = Math.sin(time * 0.03) * 0.3;
                    const organicDist = dist + noiseX + noiseY + pulse;
                    
                    if (organicDist < maxRadius) {
                        const influence = 1 - (organicDist / maxRadius);
                        const growth = Math.pow(influence, 1.5) * 18;
                        const speedVariation = 0.8 + Math.sin(x + y + time * 0.01) * 0.2;
                        targetGrid[y][x] = Math.min(9, targetGrid[y][x] + growth * speedVariation * 0.5);
                    }
                }
            }
        }
    }
    
    function update() {
        time++;
        
        // Auto-animate cursor on touch devices
        if (isTouchDevice) {
            autoCursorX += autoCursorVx;
            autoCursorY += autoCursorVy;
            
            // Bounce off edges
            if (autoCursorX < 0 || autoCursorX >= gridWidth) {
                autoCursorVx *= -1;
                autoCursorX = Math.max(0, Math.min(gridWidth - 1, autoCursorX));
            }
            if (autoCursorY < 0 || autoCursorY >= gridHeight) {
                autoCursorVy *= -1;
                autoCursorY = Math.max(0, Math.min(gridHeight - 1, autoCursorY));
            }
            
            mouseX = Math.floor(autoCursorX);
            mouseY = Math.floor(autoCursorY);
        }
        
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                targetGrid[y][x] = 0;
            }
        }
        
        if (mouseX >= 0 && mouseY >= 0) {
            spreadInfluence(mouseX, mouseY);
        }
        
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const speed = 0.05 + (Math.sin(x * 0.7 + y * 0.5) * 0.02);
                const diff = targetGrid[y][x] - grid[y][x];
                grid[y][x] += diff * speed;
            }
        }
    }
    
    function draw() {
        // Get colors from CSS variables (affected by edit mode)
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#000000';
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 60px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const value = Math.floor(grid[y][x]);
                const px = x * cellSize;
                const py = y * cellSize;
                
                ctx.fillStyle = textColor;
                ctx.fillText(value, px + cellSize / 2, py + cellSize / 2);
            }
        }
    }
    
    function animate() {
        update();
        draw();
        numberGrid = requestAnimationFrame(animate);
    }
    
    // Only enable hover effects on non-touch devices
    if (!isTouchDevice) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            mouseX = Math.floor((e.clientX - rect.left) * scaleX / cellSize);
            mouseY = Math.floor((e.clientY - rect.top) * scaleY / cellSize);
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouseX = -1;
            mouseY = -1;
        });
    }
    
    initGrid();
    animate();
}

// Toggle between profile picture and number grid
window.toggleView = function() {
    const canvas = document.getElementById('number-grid');
    const img = document.getElementById('profile-pic');
    const btn = document.getElementById('view-toggle-btn');
    const message = document.getElementById('hero-message');
    
    if (!canvas || !img || !btn) return;
    
    if (canvas.style.display === 'none') {
        // Show canvas, hide image
        canvas.style.display = 'block';
        img.style.display = 'none';
        btn.textContent = 'Show Photo';
        if (message) message.textContent = 'Hover over the grid!';
        if (!numberGrid) {
            initNumberGrid();
        }
    } else {
        // Show image, hide canvas
        canvas.style.display = 'none';
        img.style.display = 'block';
        btn.textContent = 'Show Grid';
        if (message) message.textContent = "That's just me";
        if (numberGrid) {
            cancelAnimationFrame(numberGrid);
            numberGrid = null;
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the number grid if canvas exists
    const canvas = document.getElementById('number-grid');
    const img = document.getElementById('profile-pic');
    
    if (canvas && img) {
        // Make sure only canvas is visible by default
        canvas.style.display = 'block';
        img.style.display = 'none';
        initNumberGrid();
    }
});
