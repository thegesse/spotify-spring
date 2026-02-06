package com.geese.spotify.service;

import com.geese.spotify.model.Playlist;
import com.geese.spotify.model.Video;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PlaylistService {
    private final Map<String, List<Video>> playlists = new HashMap<>();

    public Set<String> getAllPlaylistNames() {
        return playlists.keySet();
    }

    public void createPlaylist(String name) {
        playlists.putIfAbsent(name, new ArrayList<>());
    }

    public void addVideoToPlaylist(String name, Video video) {
        List<Video> list = playlists.get(name);
        if (list != null) {
            list.add(video);
        }
    }
    public void removeFromPlaylist(String playlistName, String videoId) {
        List<Video> list = playlists.get(playlistName);
        if (list != null) {
            list.removeIf(v -> v.getVideoId().equals(videoId));
        }
    }

    public List<Video> getPlaylistsContent(String name) {
        return playlists.getOrDefault(name, new ArrayList<>());
    }


}
