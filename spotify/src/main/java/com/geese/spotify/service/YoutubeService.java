package com.geese.spotify.service;

import com.geese.spotify.model.Video;
import com.google.api.client.util.Value;
import org.springframework.stereotype.Service;

@Service
public class YoutubeService {
    @Value("${youtube.api.key}")
    private String apiKey;


}
