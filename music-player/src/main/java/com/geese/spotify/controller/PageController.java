package com.geese.spotify.controller;

import com.geese.spotify.model.Playlist;
import com.geese.spotify.model.Video;
import com.geese.spotify.service.PlaylistService;
import com.geese.spotify.service.YoutubeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PageController {
    private final YoutubeService youtubeService;
    private final PlaylistService playlistService;

    public PageController(YoutubeService youtubeService, PlaylistService playlistService) {
        this.youtubeService = youtubeService;
        this.playlistService = playlistService;
    }

    @GetMapping("/search")
    public List<Video> searchVideos(@RequestParam("q") String query) {
        return youtubeService.searchVideos(query);
    }

    @GetMapping("/video-details")
    public List<Video> videoDetails(@RequestParam("ids") String ids) {
        return youtubeService.getVideosDetails(ids);
    }

    @PostMapping("/playlist")
    public void createPlaylist(@RequestParam String name) {
        playlistService.createPlaylist(name);
    }

    @GetMapping("/playlists")
    public Set<String> getAllPlaylists() {
        return playlistService.getAllPlaylistNames();
    }

    @PostMapping("/playlist/{name}/add")
    public void addToPlaylist(@PathVariable String name, @RequestBody Video video) {
        playlistService.addVideoToPlaylist(name, video);
    }

    @GetMapping("/playlist/{name}")
    public List<Video> getPlaylists(@PathVariable String name) {
        return playlistService.getPlaylistsContent(name);
    }

    @DeleteMapping("/playlist/{name}/remove/{videoId}")
    public void removePlaylist(@PathVariable String name, @PathVariable String videoId) {
        playlistService.removeFromPlaylist(name, videoId);
    }
}
