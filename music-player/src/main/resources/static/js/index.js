import { handleSearch } from './search.js';
import {
    renderPlaylist,
    renderPlaylistUI,
    saveVideo,
    removeVideo,
    createPlaylist,
    fetchAllPlaylists,
} from './save.js';
import { playFromPlaylist, toggleShuffle, playVideo, playNext } from './play.js';

document.addEventListener('DOMContentLoaded', async () => {
    const localData = JSON.parse(localStorage.getItem('youtube_playlists') || '{}');
    const playlistNames = Object.keys(localData);

    if (playlistNames.length > 0) {
        console.log("Syncing local storage with server...");
        for (const name of playlistNames) {
            try {
                await fetch(`/api/playlist?name=${encodeURIComponent(name)}`, { method: 'POST' });
                for (const video of localData[name]) {
                    await fetch(`/api/playlist/${encodeURIComponent(name)}/add`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(video)
                    });
                }
            } catch (err) {
                console.error(`Failed to restore playlist ${name}:`, err);
            }
        }
    }

    await renderPlaylist("My Library");
    await fetchAllPlaylists();
});

const searchForm = document.getElementById('add');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch();
    });
}

window.saveToPlaylist = (videoId, videoObj) => {
    const selector = document.getElementById(`folder-${videoId}`);
    if (selector) {
        saveVideo(videoObj, selector.value);
    }
};

window.currentPlaylist = [];
window.renderPlaylist = renderPlaylist;
window.renderPlaylistUI = renderPlaylistUI;
window.saveVideo = saveVideo;
window.removeVideo = removeVideo;
window.createPlaylist = createPlaylist;
window.fetchAllPlaylists = fetchAllPlaylists;

window.playVideo = playVideo;
window.playFromPlaylist = playFromPlaylist;
window.playNext = playNext;
window.toggleShuffle = toggleShuffle;