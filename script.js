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
			var adamScale = lerp(2.2, 1.0, t);
			var alkScale = lerp(0.6, 2.0, t);
			var headerHeight = lerp(124, 64, t);
			var adamTranslateY = lerp(0, 6, t);
			var alkTranslateY = lerp(0, 5, t);
			var footerHeight = lerp(20, 60, t);
			var footerContentTranslateY = lerp(0, 15, t);
			
			adamEl.style.transform = 'scale(' + adamScale.toFixed(3) + ') translateY(' + adamTranslateY.toFixed(0) + 'px) translateX(' + lerp(20, 0, t).toFixed(0) + 'px)';
			alkEl.style.transform = 'scale(' + alkScale.toFixed(3) + ') translateY(' + alkTranslateY.toFixed(0) + 'px)';
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
		
		console.log('Popup check:', {
			popup: !!popup,
			isMobile: isMobileDevice,
			hasSeenWarning: !!hasSeenWarning,
			windowWidth: window.innerWidth
		});
		
		if (popup) {
			if (isMobileDevice && !hasSeenWarning) {
				console.log('Showing popup');
				popup.classList.remove('hidden');
			} else {
				console.log('Hiding popup');
				popup.classList.add('hidden');
			}
		}
	}

	// Close popup
	window.closePopup = function() {
		const popup = document.getElementById('mobileWarning');
		popup.classList.add('hidden');
		sessionStorage.setItem('mobileWarningDismissed', 'true');
	}

	// Close on overlay click
	const popup = document.getElementById('mobileWarning');
	if (popup) {
		popup.addEventListener('click', function(e) {
			if (e.target === this) {
				closePopup();
			}
		});
	}

	// Close on Escape key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			closePopup();
		}
	});

	// Clear session storage for testing (remove this line later)
	sessionStorage.removeItem('mobileWarningDismissed');
	
	// Check immediately when DOM is ready
	checkAndShowPopup();

	// Check on page load
	window.addEventListener('load', checkAndShowPopup);

	// Check on resize
	window.addEventListener('resize', checkAndShowPopup);
});
