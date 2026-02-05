package com.geese.spotify.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Video {
    private String title;
    private String videoId;
    private String thumbnailUrl;
}
