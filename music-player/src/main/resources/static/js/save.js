let currentPlaylistName = "My Library";
export function renderPlaylistUI(names) {
    const container = document.getElementById('playlist-buttons-container');
    if (!container) return;

    container.innerHTML = names.map(name => `
        <button class="playlist-nav-btn" onclick="renderPlaylist('${name}')">
            ${name}
        </button>
    `).join(' ');
}

export async function fetchAllPlaylists() {
    try {
        const response = await fetch('/api/playlists');
        const names = await response.json();
        renderPlaylistUI(names);
        return names;
    } catch (e) {
        console.error("Error fetching playlists:", e);
    }
}
export async function saveVideo(videoObject, targetPlaylist = currentPlaylistName) {
    try {
        const response = await fetch(`/api/playlist/${encodeURIComponent(targetPlaylist)}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(videoObject)
        });

        if (response.ok) {
            alert(`Added to ${targetPlaylist}!`);
            if (targetPlaylist === currentPlaylistName) renderPlaylist(currentPlaylistName);
        }
    } catch (e) {
        console.error("Save failed:", e);
    }
}

export async function createPlaylist() {
    const nameInput = document.getElementById('new-playlist-name');
    const name = nameInput.value.trim();
    if (!name) return;

    await fetch(`/api/playlist?name=${encodeURIComponent(name)}`, { method: 'POST' });
    nameInput.value = '';
    await fetchAllPlaylists();
    renderPlaylist(name);
}

export async function renderPlaylist(name = currentPlaylistName) {
    currentPlaylistName = name;
    try {
        const response = await fetch(`/api/playlist/${encodeURIComponent(name)}`);
        const videos = await response.json();

        window.currentPlaylist = videos.map(v => v.videoId);

        const container = document.getElementById('favorites-list');
        if (!container) return;

        container.innerHTML = videos.map(video => `
            <div class="video-card">
                <strong>${video.title}</strong>
                <button onclick="playFromPlaylist('${video.videoId}')">Play</button>
                <button onclick="removeVideo('${video.videoId}')">Remove</button>
            </div>
        `).join('');
    } catch (e) {
        console.error("Display Error:", e);
    }
}

export async function removeVideo(videoId) {
    try {
        await fetch(`/api/playlist/${encodeURIComponent(currentPlaylistName)}/remove/${videoId}`, {
            method: 'DELETE'
        });
        renderPlaylist(currentPlaylistName);
    } catch (e) {
        console.error("Error removing video:", e);
    }
}