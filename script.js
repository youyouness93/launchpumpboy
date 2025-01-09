// Set the launch date (January 18, 2025 at 12:00)
const launchDate = new Date('2025-01-10T15:00:00-05:00');

// Update countdown
function updateCountdown() {
    const now = new Date();
    const diff = launchDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

// Create matrix rain effect
function createMatrixRain() {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    document.querySelector('.matrix-bg').appendChild(c);

    c.height = window.innerHeight;
    c.width = window.innerWidth;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const font_size = 10;
    const columns = c.width / font_size;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#39FF14";
        ctx.font = font_size + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            if (drops[i] * font_size > c.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 35);

    window.addEventListener('resize', () => {
        c.height = window.innerHeight;
        c.width = window.innerWidth;
    });
}

// Toggle sound
function toggleSound() {
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    const icon = soundToggle.querySelector('i');

    if (bgMusic.paused) {
        bgMusic.play();
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
    } else {
        bgMusic.pause();
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const enterModal = document.getElementById('enterModal');
    const enterButton = document.getElementById('enterButton');
    const mainContent = document.querySelector('.container');
    const soundControl = document.querySelector('.sound-control');
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    let isMuted = false;

    // Start countdown
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Create matrix effect
    createMatrixRain();

    // Enter button click handler
    enterButton.addEventListener('click', function() {
        // Start music
        bgMusic.volume = 0.3;
        bgMusic.play()
            .then(() => {
                // Hide enter modal
                enterModal.style.display = 'none';
                // Show main content
                mainContent.style.display = 'block';
                soundControl.style.display = 'block';
            })
            .catch(e => console.log('Audio playback failed:', e));
    });

    // Sound toggle button
    soundToggle.addEventListener('click', toggleSound);

    // Info modal functionality
    const infoButton = document.querySelector('.d-pad');
    const infoModal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('#infoModal .close-btn');

    infoButton.addEventListener('click', function() {
        infoModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

    // Handle wallet submission
    const form = document.getElementById('subscribe-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const wallet = this.querySelector('input[type="text"]').value.trim();
            
            console.log('Submitting wallet:', wallet);
            
            try {
                // Save wallet address
                const response = await fetch('https://pump-boy.fun/api/wallets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ wallet: wallet })
                });

                const data = await response.json();
                console.log('Response:', data);
                
                if (data.success) {
                    // Show thank you popup
                    const thankYouPopup = document.getElementById('thankYouPopup');
                    if (thankYouPopup) {
                        thankYouPopup.style.display = 'block';
                        
                        // Add close button functionality
                        const closeBtn = document.querySelector('.thank-you-close-btn');
                        const closePopup = () => {
                            thankYouPopup.style.display = 'none';
                        };

                        if (closeBtn) {
                            closeBtn.addEventListener('click', closePopup);
                        }

                        // Close on outside click
                        thankYouPopup.addEventListener('click', function(e) {
                            if (e.target === this) {
                                closePopup();
                            }
                        });
                    }
                    
                    // Reset form
                    this.reset();
                } else {
                    console.error('Error saving wallet:', data.message);
                }
            } catch (error) {
                console.error('Error saving wallet:', error);
            }
        });
    }
});
