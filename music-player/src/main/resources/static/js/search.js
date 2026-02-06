import { renderPlaylist, fetchAllPlaylists } from './save.js';

export async function handleSearch() {
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
        const playlistNames = await fetchAllPlaylists();

        resultContainer.innerHTML = '';
        videos.forEach(video => {
            const videoJson = JSON.stringify(video).replace(/"/g, '&quot;');

            const videoElement = `
                <div class="video-card">
                    <h3>${video.title}</h3>
                    <select id="folder-${video.videoId}">
                        ${playlistNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                    </select>
                    <button onclick="playVideo('${video.videoId}')">Play</button>
                    <button onclick="saveToPlaylist('${video.videoId}', ${videoJson})">Add to Playlist</button>
                </div>
            `;
            resultContainer.insertAdjacentHTML('beforeend', videoElement);
        });
    } catch (e) {
        console.error("Error during search:", e);
        resultContainer.innerHTML = "Something went wrong.";
    }
}