import { handleSearch } from './search.js';
import { renderPlaylist, renderPlaylistUI, saveVideo, removeVideo, createPlaylist, fetchAllPlaylists } from './save.js';
import { playFromPlaylist, toggleShuffle, playVideo, playNext } from './play.js';

document.addEventListener('DOMContentLoaded', async () => {
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
window.saveVideo = saveVideo;
window.removeVideo = removeVideo;
window.toggleShuffle = toggleShuffle;
window.playVideo = playVideo;
window.playNext = playNext;
window.createPlaylist = createPlaylist;
window.fetchAllPlaylists = fetchAllPlaylists;
window.playFromPlaylist = playFromPlaylist;