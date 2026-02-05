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
                    <p>ID: ${video.videoId}</p>
                    <button onclick="playVideo('${video.videoId}')">Play</button>
                </div>
            `;
            // Fixed variable name to match 'resultContainer'
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