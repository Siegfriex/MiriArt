package com.miriart.api.domain.community.service;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

class PostQueryServiceTest {

    @Test
    @DisplayName("decodeCursor - null/blank → 0")
    void decodeCursor_null_returns0() {
        assertThat(PostQueryService.decodeCursor(null)).isEqualTo(0);
        assertThat(PostQueryService.decodeCursor("")).isEqualTo(0);
        assertThat(PostQueryService.decodeCursor("  ")).isEqualTo(0);
    }

    @Test
    @DisplayName("decodeCursor - 유효한 Base64 → 정상 페이지 번호")
    void decodeCursor_valid_returnsPage() {
        String cursor = Base64.getEncoder()
                .encodeToString("page=3".getBytes(StandardCharsets.UTF_8));
        assertThat(PostQueryService.decodeCursor(cursor)).isEqualTo(3);
    }

    @Test
    @DisplayName("decodeCursor - 잘못된 Base64 → 0 (fallback)")
    void decodeCursor_invalid_returns0() {
        assertThat(PostQueryService.decodeCursor("not-a-valid-base64!!!")).isEqualTo(0);
    }

    @Test
    @DisplayName("encodeCursor - 페이지 번호 → Base64 인코딩")
    void encodeCursor_roundTrip() {
        String encoded = PostQueryService.encodeCursor(5);
        int decoded = PostQueryService.decodeCursor(encoded);
        assertThat(decoded).isEqualTo(5);
    }
}
