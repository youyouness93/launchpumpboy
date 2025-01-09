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
    const infoButton = document.querySelector('.d-pad .fa-info');
    const infoModal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('#infoModal .close-btn');

    if (infoButton && infoModal) {
        infoButton.addEventListener('click', function() {
            console.log('Info button clicked'); // Debug log
            infoModal.style.display = 'block';
        });

        // Close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                console.log('Close button clicked'); // Debug log
                infoModal.style.display = 'none';
            });
        }

        // Click outside to close
        window.addEventListener('click', function(e) {
            if (e.target === infoModal) {
                console.log('Clicked outside modal'); // Debug log
                infoModal.style.display = 'none';
            }
        });
    } else {
        console.log('Info button or modal not found:', { 
            infoButton: !!infoButton, 
            infoModal: !!infoModal 
        }); // Debug log
    }

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
