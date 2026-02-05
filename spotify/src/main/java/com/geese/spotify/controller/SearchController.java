package com.geese.spotify.controller;

import com.geese.spotify.model.Video;
import com.geese.spotify.service.YoutubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {
    private final YoutubeService youtubeService;

    public SearchController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/search")
    public List<Video> searchVideos(@RequestParam("q") String query) {
        return youtubeService.searchVideos(query);
    }
}
