let currentAudio = null; // Store the currently playing audio
let currentCard = null; // Store the currently active card

function togglePlay(animal) {
    const card = document.querySelector(`.animal-card[data-animal="${animal}"]`);
    const playButton = card.querySelector('.play-pause-btn');
    const volumeSlider = card.querySelector('.volume-slider');

    // Create audio element if it doesn't exist
    if (!card.audio) {
        card.audio = new Audio(`sounds/${animal}.mp3`); // Path to the audio file
        card.audio.dataset.animal = animal; // Store the animal name in the audio object
    }

    const audio = card.audio;

    if (audio.paused) {
        // Pause any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.parentElement.querySelector('.play-pause-btn').textContent = 'Play'; // Reset previous button
            currentCard.classList.remove('active'); // Remove glow effect from previous card
            currentCard.querySelector('.volume-slider').style.display = 'none'; // Hide previous volume slider
        }

        audio.play();
        playButton.textContent = 'Pause'; // Change button text to 'Pause'
        currentAudio = audio; // Set current audio
        currentCard = card; // Set current card
        card.classList.add('active'); // Add glow effect
        volumeSlider.style.display = 'block'; // Show the volume slider
    } else {
        audio.pause();
        playButton.textContent = 'Play'; // Change button text back to 'Play'
        currentAudio = null; // Clear current audio
        currentCard.classList.remove('active'); // Remove glow effect
        volumeSlider.style.display = 'none'; // Hide the volume slider when paused
    }

    // Update volume based on slider
    audio.volume = parseFloat(volumeSlider.value) / 100;

    // Event listener to reset button when audio ends
    audio.onended = () => {
        playButton.textContent = 'Play';
        currentAudio = null;
        currentCard.classList.remove('active'); // Remove glow effect
        volumeSlider.style.display = 'none'; // Hide the slider when audio ends
    };

    // Update volume based on slider input
    volumeSlider.addEventListener('input', function() {
        audio.volume = parseFloat(this.value) / 100; // Set the new volume
    });
}

function searchAnimal() {
    const searchInput = document.querySelector('#searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.animal-card');
    let found = false;

    cards.forEach(card => {
        const animal = card.dataset.animal.toLowerCase();
        if (animal.includes(searchInput)) {
            card.classList.add('highlight'); // Highlight matched card
            card.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to the matched card
            card.classList.add('active'); // Ensure it has the glow effect
            found = true;
        } else {
            card.classList.remove('highlight'); // Remove highlight from other cards
            card.classList.remove('active'); // Ensure glow is removed from non-matching cards
        }
    });

    if (!found) {
        alert('Animal not found');
    }
}

// Keyboard control for volume
document.addEventListener('keydown', (event) => {
    if (currentAudio) {
        if (event.key === 'ArrowUp') {
            currentAudio.volume = Math.min(currentAudio.volume + 0.01, 1); // Volume up
            const volumeSlider = currentCard.querySelector('.volume-slider');
            volumeSlider.value = Math.round(currentAudio.volume * 100);
        } else if (event.key === 'ArrowDown') {
            currentAudio.volume = Math.max(currentAudio.volume - 0.01, 0); // Volume down
            const volumeSlider = currentCard.querySelector('.volume-slider');
            volumeSlider.value = Math.round(currentAudio.volume * 100);
        }
    }
});

// Add event listener for the search input
document.querySelector('#searchInput').addEventListener('input', searchAnimal);

