// 1. Listen for the form submission
document.getElementById('add').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page refresh
    handleSearch();
});

async function handleSearch() {
    // Match the ID "userSearch" from your HTML
    const query = document.getElementById('userSearch').value;

    // Create or find a results container
    let resultContainer = document.getElementById('video-results');
    if (!resultContainer) {
        resultContainer = document.createElement('div');
        resultContainer.id = 'video-results';
        document.body.appendChild(resultContainer);
    }

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const videos = await response.json();

        resultContainer.innerHTML = ''; // Clear old results

        videos.forEach(video => {
            const videoElement = `
        <div class="video-card">
            <h3>${video.title}</h3>
            <button onclick="playVideo('${video.videoId}')">Play</button>
            <button onclick="saveVideo('${video.videoId}')">Save to Library</button>
        </div>
    `;
            resultContainer.insertAdjacentHTML('beforeend', videoElement);
        });
    } catch (e) {
        console.error("Error fetching videos:", e);
        resultContainer.innerHTML = "Something went wrong.";
    }
}

// 2. Move this OUTSIDE so the buttons can find it
function playVideo(id) {
    const playerContainer = document.getElementById('player-container');
    playerContainer.innerHTML = `
        <div class="video-wrapper">
            <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/${id}?autoplay=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        </div>
    `;
}

// move these when future me wants to add a playlist system
function saveVideo(videoId) {
    const favorites = JSON.parse(localStorage.getItem('myVideos')) || [];

    if (!favorites.includes(videoId)) {
        favorites.push(videoId);
        localStorage.setItem('myVideos', JSON.stringify(favorites));
        console.log("ID Saved:", videoId);
    }
}

async function loadFavorites() {
    const favoriteIds = JSON.parse(localStorage.getItem('myVideos')) || [];
    console.log("IDs found in storage:", favoriteIds); // DEBUG 1
    if (favoriteIds.length === 0) return;
    const idString = favoriteIds.join(',');
    const url = `/api/video-details?ids=${encodeURIComponent(idString)}`;
    console.log("Fetching from:", url); // DEBUG 2

    try {
        const response = await fetch(`/api/video-details?ids=${idString}`);
        const freshVideos = await response.json();
        console.log("Data received from Java:", freshVideos); // DEBUG 3
        const favoriteContainer = document.getElementById('favorites-list');
        favoriteContainer.innerHTML = freshVideos.map(video => `
            <li>
                <strong>${video.title}</strong>
                <button onclick="playVideo('${video.videoId}')">Play Now</button>
            </li>
        `).join('');
    } catch (e) {
        console.error("Couldn't refresh titles:", e);
    }
}