package com.geese.spotify.controller;

import com.geese.spotify.model.Video;
import com.geese.spotify.service.YoutubeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class SearchController {
    private final YoutubeService youtubeService;

    public SearchController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/search")
    public List<Video> searchVideos(@RequestParam("q") String query) {
        return youtubeService.searchVideos(query);
    }

    @GetMapping("/video-details")
    public List<Video> videoDetails(@RequestParam("ids") String ids) {
        return youtubeService.getVideosDetails(ids);
    }
}
