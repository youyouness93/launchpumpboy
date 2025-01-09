// Set the launch date (January 18, 2025 at 12:00)
const launchDate = new Date('2025-01-18T12:00:00-05:00');

// Update countdown
function updateCountdown() {
    const now = new Date();
    const diff = launchDate - now;

    if (diff <= 0) {
        // Launch time reached
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Matrix rain effect
function createMatrixRain() {
    const matrixBg = document.querySelector('.matrix-bg');
    
    for (let i = 0; i < 100; i++) {
        const line = document.createElement('div');
        line.className = 'matrix-line';
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDuration = `${Math.random() * 3 + 2}s`;
        line.style.opacity = Math.random() * 0.5 + 0.5;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        for (let j = 0; j < 30; j++) {
            const char = document.createElement('div');
            char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
            char.style.color = '#39ff14';
            char.style.fontSize = '14px';
            char.style.marginBottom = '5px';
            char.style.transform = Math.random() > 0.5 ? 'scale(1.2)' : 'scale(1)';
            line.appendChild(char);
        }
        
        matrixBg.appendChild(line);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('infoModal');
    const dPad = document.querySelector('.d-pad');
    const closeBtn = document.querySelector('.close-btn');

    if (dPad && modal && closeBtn) {
        dPad.addEventListener('click', () => {
            console.log('D-pad clicked');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    } else {
        console.error('Modal elements not found:', {
            modal: !!modal,
            dPad: !!dPad,
            closeBtn: !!closeBtn
        });
    }

    // Form submission
    const form = document.getElementById('subscribe-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('Thank you for subscribing! We will notify you when we launch.');
            this.reset();
        });
    }

    // Initialize countdown and matrix
    setInterval(updateCountdown, 1000);
    createMatrixRain();

    // Add button interactivity
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
    });
});
