// Portfolio Catalog JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile warning banner functionality
    const mobileWarning = document.getElementById('mobileWarning');
    const warningClose = document.getElementById('warningClose');
    
    if (warningClose) {
        warningClose.addEventListener('click', function() {
            mobileWarning.style.display = 'none';
            // Remove the margin-top from container when warning is closed
            const container = document.querySelector('.container');
            if (container) {
                container.style.marginTop = '0';
            }
        });
    }
    
    // Always show bottom border at the bottom of content
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        function updateBottomBorder() {
            // Always show the bottom border
            rightPanel.style.borderBottom = '2px solid #ffffff';
        }
        
        // Check on scroll
        rightPanel.addEventListener('scroll', updateBottomBorder);
        
        // Check on content change (when switching between sections)
        const observer = new MutationObserver(updateBottomBorder);
        observer.observe(rightPanel, { childList: true, subtree: true });
        
        // Initial check
        updateBottomBorder();
    }
    
    const projectItems = document.querySelectorAll('.project-item');
    const projectDetails = document.querySelectorAll('.project-detail');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const defaultDetail = document.getElementById('default');
    
    // Track clicked project
    let clickedProject = null;
    
    // Initialize with default content
    showProjectDetail('default');
    
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navigation = document.querySelector('.navigation');
    
    console.log('Mobile menu toggle element:', mobileMenuToggle);
    console.log('Navigation element:', navigation);
    
    if (mobileMenuToggle && navigation) {
        console.log('Setting up mobile menu toggle...');
        
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu toggle clicked!');
            console.log('Current classes:', this.className);
            this.classList.toggle('active');
            navigation.classList.toggle('active');
            console.log('After toggle classes:', this.className);
        });
        
        // Close mobile menu when clicking on nav items
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    mobileMenuToggle.classList.remove('active');
                    navigation.classList.remove('active');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024 && 
                !mobileMenuToggle.contains(e.target) && 
                !navigation.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navigation.classList.remove('active');
            }
        });
    } else {
        console.log('Mobile menu elements not found!');
    }
    
    // Navigation functionality
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            // Handle work section toggle (collapsible)
            if (section === 'work') {
                const workSection = document.getElementById('work-content');
                const isExpanded = !workSection.classList.contains('collapsed');
                
                if (isExpanded) {
                    // Collapse work section
                    workSection.classList.add('collapsed');
                    this.classList.remove('expanded');
                    this.classList.remove('active');
                    clickedProject = null;
                    projectItems.forEach(project => project.classList.remove('selected'));
                    showProjectDetail('default');
                } else {
                    // Expand work section
                    workSection.classList.remove('collapsed');
                    this.classList.add('expanded');
                    this.classList.add('active');
                    showProjectDetail('work-gallery');
                }
                
                // Remove active from other nav items
                navItems.forEach(nav => {
                    if (nav !== this) {
                        nav.classList.remove('active');
                    }
                });
                
                // Hide other content sections
                contentSections.forEach(contentSection => {
                    if (contentSection.id !== 'work-content') {
                        contentSection.classList.add('collapsed');
                    }
                });
            } else {
                // Handle other sections (about, resume)
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => section.classList.add('collapsed'));
                
                // Show selected content section
                const targetSection = document.getElementById(section + '-content');
                if (targetSection) {
                    targetSection.classList.remove('collapsed');
                }
                
                // Clear clicked project when switching sections
                clickedProject = null;
                projectItems.forEach(project => project.classList.remove('selected'));
                
                // Show corresponding content on right panel
                if (section === 'resume') {
                    showProjectDetail('resume-detail');
                } else if (section === 'contact') {
                    showProjectDetail('contact-detail');
                } else if (section === 'about') {
                    showProjectDetail('default');
                }
            }
        });
    });
    
    // Add hover event listeners to project items
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const projectId = this.getAttribute('data-project');
            // Set as clicked project and add selected class
            clickedProject = projectId;
            projectItems.forEach(project => project.classList.remove('selected'));
            this.classList.add('selected');
            showProjectDetail(projectId);
        });
        
        item.addEventListener('mouseleave', function() {
            // Return to clicked project or gallery view
            if (clickedProject) {
                showProjectDetail(clickedProject);
            } else {
                const workNavItem = document.querySelector('.nav-item[data-section="work"]');
                if (workNavItem && workNavItem.classList.contains('active')) {
                    showProjectDetail('work-gallery');
                }
            }
        });
    });
    
    // Add click event listeners to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            clickedProject = projectId;
            
            // Remove selected class from all project items
            projectItems.forEach(project => project.classList.remove('selected'));
            
            // Find and select the corresponding project item
            const correspondingProjectItem = document.querySelector(`.project-item[data-project="${projectId}"]`);
            if (correspondingProjectItem) {
                correspondingProjectItem.classList.add('selected');
            }
            
            showProjectDetail(projectId);
        });
    });
    
    // Interactive page gallery functionality
    let currentPage = 1;
    const totalPages = 19;
    const pageImages = [
        'humanpg01.jpg', 'humanpg02.jpg', 'humanpg03.jpg', 'humanpg04.jpg',
        'humanpg05.jpg', 'humanpg06.jpg', 'humanpg07.jpg', 'humanpg08.jpg',
        'humanpg09.jpg', 'humanpg10.jpg', 'humanpg11.jpg', 'humanpg12.jpg',
        'humanpg13.jpg', 'humanpg14.jpg', 'humanpg15.jpg', 'humanpg16.jpg',
        'humanpg17.jpg', 'humanpg18.jpg', 'humanpg20.jpg'
    ];
    
    const galleryImage = document.getElementById('galleryImage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (galleryImage && currentPageSpan && totalPagesSpan && prevBtn && nextBtn) {
        // Initialize gallery
        totalPagesSpan.textContent = totalPages;
        updateGallery();
        
        // Previous button
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updateGallery();
            }
        });
        
        // Next button
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updateGallery();
            }
        });
        
        // Thumbnail clicks
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                currentPage = index + 1;
                updateGallery();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (galleryImage && galleryImage.offsetParent !== null) { // Check if gallery is visible
                if (e.key === 'ArrowLeft' && currentPage > 1) {
                    currentPage--;
                    updateGallery();
                } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
                    currentPage++;
                    updateGallery();
                }
            }
        });
        
        function updateGallery() {
            // Update main image
            galleryImage.src = pageImages[currentPage - 1];
            galleryImage.alt = `Human Project Page ${currentPage}`;
            
            // Update page counter
            currentPageSpan.textContent = currentPage;
            
            // Update button states
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            
            // Update thumbnails
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentPage - 1);
            });
        }
    }

    // VCU Gallery functionality
    let vcuCurrentPage = 1;
    const vcuTotalPages = 10;
    const vcuPageImages = [
        'fix_Page_04.jpg', 'fix_Page_05.jpg', 'fix_Page_06.jpg', 'fix_Page_07.jpg',
        'fix_Page_08.jpg', 'fix_Page_09.jpg', 'fix_Page_10.jpg', 'fix_Page_11.jpg',
        'fix_Page_12.jpg', 'fix_Page_13.jpg'
    ];
    
    const vcuGalleryImage = document.getElementById('vcuGalleryImage');
    const vcuCurrentPageSpan = document.getElementById('vcuCurrentPage');
    const vcuTotalPagesSpan = document.getElementById('vcuTotalPages');
    const vcuPrevBtn = document.getElementById('vcuPrevPage');
    const vcuNextBtn = document.getElementById('vcuNextPage');
    const vcuThumbnails = document.querySelectorAll('#vcu .thumbnail');
    
    if (vcuGalleryImage && vcuCurrentPageSpan && vcuTotalPagesSpan && vcuPrevBtn && vcuNextBtn) {
        // Initialize VCU gallery
        vcuTotalPagesSpan.textContent = vcuTotalPages;
        updateVcuGallery();
        
        // Previous button
        vcuPrevBtn.addEventListener('click', function() {
            if (vcuCurrentPage > 1) {
                vcuCurrentPage--;
                updateVcuGallery();
            }
        });
        
        // Next button
        vcuNextBtn.addEventListener('click', function() {
            if (vcuCurrentPage < vcuTotalPages) {
                vcuCurrentPage++;
                updateVcuGallery();
            }
        });
        
        // Thumbnail clicks
        vcuThumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                vcuCurrentPage = index + 1;
                updateVcuGallery();
            });
        });
        
        // Keyboard navigation for VCU gallery
        document.addEventListener('keydown', function(e) {
            if (vcuGalleryImage && vcuGalleryImage.offsetParent !== null) { // Check if VCU gallery is visible
                if (e.key === 'ArrowLeft' && vcuCurrentPage > 1) {
                    vcuCurrentPage--;
                    updateVcuGallery();
                } else if (e.key === 'ArrowRight' && vcuCurrentPage < vcuTotalPages) {
                    vcuCurrentPage++;
                    updateVcuGallery();
                }
            }
        });
        
        function updateVcuGallery() {
            // Update main image
            vcuGalleryImage.src = vcuPageImages[vcuCurrentPage - 1];
            vcuGalleryImage.alt = `VCU Marketing Material Page ${vcuCurrentPage}`;
            
            // Update page counter
            vcuCurrentPageSpan.textContent = vcuCurrentPage;
            
            // Update button states
            vcuPrevBtn.disabled = vcuCurrentPage === 1;
            vcuNextBtn.disabled = vcuCurrentPage === vcuTotalPages;
            
            // Update thumbnails
            vcuThumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === vcuCurrentPage - 1);
            });
        }
    }

    // Good Soup Gallery functionality
    let soupCurrentPage = 1;
    const soupTotalPages = 22;
    const soupPageImages = [
        'soup.jpg', 'soup2.jpg', 'soup3.jpg', 'soup4.jpg',
        'soup5.jpg', 'soup6.jpg', 'soup7.jpg', 'soup8.jpg',
        'soup9.jpg', 'soup10.jpg', 'soup11.jpg', 'soup12.jpg',
        'soup13.jpg', 'soup14.jpg', 'soup15.jpg', 'soup16.jpg',
        'soup17.jpg', 'soup18.jpg', 'soup19.jpg', 'soup20.jpg',
        'soup21.jpg', 'soup22.jpg'
    ];
    
    const soupGalleryImage = document.getElementById('soupGalleryImage');
    const soupCurrentPageSpan = document.getElementById('soupCurrentPage');
    const soupTotalPagesSpan = document.getElementById('soupTotalPages');
    const soupPrevBtn = document.getElementById('soupPrevPage');
    const soupNextBtn = document.getElementById('soupNextPage');
    const soupThumbnails = document.querySelectorAll('#goodsoup .thumbnail');
    
    if (soupGalleryImage && soupCurrentPageSpan && soupTotalPagesSpan && soupPrevBtn && soupNextBtn) {
        // Initialize Good Soup gallery
        soupTotalPagesSpan.textContent = soupTotalPages;
        updateSoupGallery();
        
        // Previous button
        soupPrevBtn.addEventListener('click', function() {
            if (soupCurrentPage > 1) {
                soupCurrentPage--;
                updateSoupGallery();
            }
        });
        
        // Next button
        soupNextBtn.addEventListener('click', function() {
            if (soupCurrentPage < soupTotalPages) {
                soupCurrentPage++;
                updateSoupGallery();
            }
        });
        
        // Thumbnail clicks
        soupThumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                soupCurrentPage = index + 1;
                updateSoupGallery();
            });
        });
        
        // Keyboard navigation for Good Soup gallery
        document.addEventListener('keydown', function(e) {
            if (soupGalleryImage && soupGalleryImage.offsetParent !== null) { // Check if Good Soup gallery is visible
                if (e.key === 'ArrowLeft' && soupCurrentPage > 1) {
                    soupCurrentPage--;
                    updateSoupGallery();
                } else if (e.key === 'ArrowRight' && soupCurrentPage < soupTotalPages) {
                    soupCurrentPage++;
                    updateSoupGallery();
                }
            }
        });
        
        function updateSoupGallery() {
            // Update main image
            soupGalleryImage.src = soupPageImages[soupCurrentPage - 1];
            soupGalleryImage.alt = `Good Soup Publication Page ${soupCurrentPage}`;
            
            // Update page counter
            soupCurrentPageSpan.textContent = soupCurrentPage;
            
            // Update button states
            soupPrevBtn.disabled = soupCurrentPage === 1;
            soupNextBtn.disabled = soupCurrentPage === soupTotalPages;
            
            // Update thumbnails
            soupThumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === soupCurrentPage - 1);
            });
        }
    }

    
    // Function to show specific project detail
    function showProjectDetail(projectId) {
        // Hide all project details
        projectDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        
        // Show the selected project detail
        const targetDetail = document.getElementById(projectId);
        if (targetDetail) {
            targetDetail.classList.add('active');
        }
        
        // Show/hide return button
        const returnButton = document.getElementById('returnToGallery');
        if (returnButton) {
            if (projectId === 'work-gallery' || projectId === 'default') {
                returnButton.style.display = 'none';
            } else {
                returnButton.style.display = 'block';
            }
        }
    }

    // Add return button functionality
    const returnButton = document.getElementById('returnToGallery');
    if (returnButton) {
        returnButton.addEventListener('click', function() {
            // Return to gallery view
            showProjectDetail('work-gallery');
            
            // Clear any selected project
            projectItems.forEach(project => project.classList.remove('selected'));
            clickedProject = null;
        });
    }

    
    // Add click functionality for mobile/touch devices
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            clickedProject = projectId;
            
            // Remove selected class from all project items
            projectItems.forEach(project => project.classList.remove('selected'));
            
            // Add selected class to clicked item
            this.classList.add('selected');
            
            showProjectDetail(projectId);
            
            // Add visual feedback for click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        const activeProject = document.querySelector('.project-item:hover');
        if (!activeProject) return;
        
        const currentIndex = Array.from(projectItems).indexOf(activeProject);
        let targetIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                targetIndex = Math.min(currentIndex + 1, projectItems.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                targetIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                activeProject.click();
                return;
        }
        
        if (targetIndex !== currentIndex) {
            projectItems[targetIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    });
    
    
    // Add loading state for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Add error handling
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
    
    // Add video controls and autoplay handling
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        
        
        
        // Handle video loading errors
        video.addEventListener('error', function() {
            console.warn('Failed to load video:', this.src);
            // You could replace with a placeholder image here
        });
    });
    
    
    // Add performance optimization
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                // Handle scroll-based animations here if needed
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Terminal sound effects
    function playTerminalSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // Add terminal sound to project hover
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            playTerminalSound();
        });
    });
    
    // Add glitch effect to random elements
    function addGlitchEffect() {
        const elements = document.querySelectorAll('.project-item, .header h1, .detail-header h2');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        if (randomElement) {
            randomElement.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => {
                randomElement.style.animation = '';
            }, 300);
        }
    }
    
    // Add periodic glitch effects
    setInterval(addGlitchEffect, 8000);
    
    // Terminal typing effect
    function typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
    
    // Add typing effect to headers on load
    setTimeout(() => {
        const header = document.querySelector('.header h1');
        const originalText = header.textContent;
        typeWriter(header, originalText, 100);
    }, 1000);
    
    // Matrix-style background effect
    function createMatrixEffect() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.05';
        
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 12;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 50);
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Initialize matrix effect
    createMatrixEffect();
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit form data
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.backgroundColor = '#22c55e';
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '#ffffff';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.backgroundColor = '#dc2626';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '#ffffff';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
    
    // Terminal boot sequence
    function terminalBoot() {
        const bootMessages = [
            'Initializing portfolio system...',
            'Loading project database...',
            'Connecting to server...',
            'Authentication successful',
            'Portfolio Terminal ready'
        ];
        
        bootMessages.forEach((message, index) => {
            setTimeout(() => {
                console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
            }, index * 800);
        });
    }
    
    terminalBoot();
    
    console.log('Portfolio Terminal initialized successfully! 🖥️');
    console.log('System ready for user interaction');
});
