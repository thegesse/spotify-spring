document.getElementById('add').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSearch();
});

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

async function handleSearch() {
    const query = document.getElementById('userSearch').value;

    let resultContainer = document.getElementById('video-results');
    if (!resultContainer) {
        resultContainer = document.createElement('div');
        resultContainer.id = 'video-results';
        document.body.appendChild(resultContainer);
    }

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const videos = await response.json();

        resultContainer.innerHTML = '';

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
    document.addEventListener('DOMContentLoaded', () => {
        loadFavorites();
    });
}

function playVideo(videoId) {
    const playerContainer = document.getElementById('player-container');
    if (!playerContainer) return;

    playerContainer.innerHTML = `
        <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" allowfullscreen>
        </iframe>`;
}

function saveVideo(videoId) {
    let favorites = JSON.parse(localStorage.getItem('myVideos')) || [];
    if (!favorites.includes(videoId)) {
        favorites.push(videoId);
        localStorage.setItem('myVideos', JSON.stringify(favorites));
        loadFavorites();
    }
}

function removeVideo(videoId) {
    let favorites = JSON.parse(localStorage.getItem('myVideos')) || [];
    favorites = favorites.filter(id => id !== videoId);
    localStorage.setItem('myVideos', JSON.stringify(favorites));
    loadFavorites();
}

let currentPlaylist = [];
let isShuffle = false;

async function loadFavorites() {
    const favoriteIds = JSON.parse(localStorage.getItem('myVideos')) || [];
    if (favoriteIds.length === 0) return;

    currentPlaylist = [...favoriteIds];
    const idString = favoriteIds.join(',');

    try {
        const response = await fetch(`/api/video-details?ids=${encodeURIComponent(idString)}`);
        const freshVideos = await response.json();

        const favoriteContainer = document.getElementById('favorites-list');
        favoriteContainer.innerHTML = freshVideos.map(video => `
            <div class="video-card">
                <strong>${video.title}</strong>
                <button onclick="playFromPlaylist('${video.videoId}')">Play</button>
                <button onclick="removeVideo('${video.videoId}')">Remove</button>
            </div>
        `).join('');
    } catch (e) {
        console.error("Library Load Error:", e);
    }
}

function playFromPlaylist(videoId) {
    const playerContainer = document.getElementById('player-container');
    playerContainer.innerHTML = `<div id="yt-player"></div>`;

    new YT.Player('yt-player', {
        height: '315',
        width: '560',
        videoId: videoId,
        events: {
            'onReady': (event) => event.target.playVideo(),
            'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerStateChange(event) {
    if (event.data === 0) {
        playNext();
    }
}

function playNext() {
    if (currentPlaylist.length === 0) return;

    let nextId;
    if (isShuffle) {
        nextId = currentPlaylist[Math.floor(Math.random() * currentPlaylist.length)];
    } else {
        const currentVideoId = document.querySelector('iframe').src.split('/embed/')[1].split('?')[0];
        const currentIndex = currentPlaylist.indexOf(currentVideoId);
        nextId = currentPlaylist[(currentIndex + 1) % currentPlaylist.length];
    }
    playFromPlaylist(nextId);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    alert(`Shuffle is now ${isShuffle ? 'ON' : 'OFF'}`);
}