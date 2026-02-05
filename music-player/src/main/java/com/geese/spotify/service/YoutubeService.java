package com.geese.spotify.service;

import com.geese.spotify.model.Video;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;


import java.util.ArrayList;
import java.util.List;

@Service
public class YoutubeService {
    @Value("${youtube.api.key}")
    private String apiKey;
    private static final long numberOfSearches = 2;
    private final String YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";
    private final String VIDEOS_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";

    public List<Video> searchVideos(String query){
        RestTemplate restTemplate = new RestTemplate();
        List<Video> videoList = new ArrayList<>();

        String url = UriComponentsBuilder.fromUriString(YOUTUBE_URL)
                .queryParam("part", "snippet")
                .queryParam("q", query)
                .queryParam("maxResults", numberOfSearches)
                .queryParam("type", "video")
                .queryParam("key", apiKey)
                .build()
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode items = root.get("items");

            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    Video video = new Video();

                    video.setTitle(item.path("snippet").path("title").asText());
                    video.setVideoId(item.path("id").path("videoId").asText());
                    videoList.add(video);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return videoList;
    }

    public List<Video> getVideosDetails(String ids) {
        RestTemplate restTemplate = new RestTemplate();
        List<Video> videoList = new ArrayList<>();

        String url = UriComponentsBuilder.fromUriString(VIDEOS_DETAILS_URL)
                .queryParam("part", "snippet")
                .queryParam("id", ids)
                .queryParam("key", apiKey)
                .build()
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode items = root.get("items");

            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    Video video = new Video();
                    video.setTitle(item.path("snippet").path("title").asText());
                    video.setVideoId(item.path("id").asText());
                    videoList.add(video);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return videoList;
    }

}
