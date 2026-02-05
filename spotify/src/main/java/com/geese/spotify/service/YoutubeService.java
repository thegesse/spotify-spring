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
            // 1. Make the API call
            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            // 2. YouTube uses "items" (plural)
            JsonNode items = root.get("items");

            // Check for null to prevent the iterator() crash
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    Video video = new Video();

                    // 3. Title is inside "snippet"
                    video.setTitle(item.path("snippet").path("title").asText());

                    // 4. videoId is inside "id"
                    video.setVideoId(item.path("id").path("videoId").asText());

                    videoList.add(video);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return videoList;
    }

}
