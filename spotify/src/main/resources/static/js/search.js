async function handleSearch() {

    const query = document.getElementById('query').value;
    const resultContainer = document.getElementById('video-results');

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const videos = await response.json();

        resultContainer.innerHTML = '';
        videos.forEach(video => {
            const videoElement = `
                <div class="video-card">
                    <h3>${video.title}</h3>
                    <p>ID: ${video.videoId}</p>
                    <button onclick="playVideo('${video.videoId}')">Play</button>
                </div>
            `;
            resultsContainer.insertAdjacentHTML('beforeend', videoElement);
        });
    }
}