package com.miriart.api.global.storage;

import com.google.cloud.storage.Storage;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * GcsSignedUrlService 단위 테스트. 유효/잘못된 gcsUri 및 prefix 검증.
 */
@ExtendWith(MockitoExtension.class)
class GcsSignedUrlServiceTest {

    @Mock
    private Storage storage;

    private GcsSignedUrlService service;

    @BeforeEach
    void setUp() {
        service = new GcsSignedUrlService(storage);
        ReflectionTestUtils.setField(service, "bucketName", "miriart-bucket");
        ReflectionTestUtils.setField(service, "expirationMinutes", 15);
    }

    @Test
    @DisplayName("유효 gcsUri(artworks/) → url not null, expiresAt > now")
    void createSignedUrl_validArtworks_returnsUrlAndExpiry() throws MalformedURLException {
        when(storage.signUrl(
                any(com.google.cloud.storage.BlobInfo.class),
                eq(15L),
                eq(TimeUnit.MINUTES),
                any(Storage.SignUrlOption.class)))
                .thenReturn(new URL("https://storage.googleapis.com/miriart-bucket/artworks/2026-03-10/f.jpg?X-Goog-Signature=abc"));

        SignedImageUrl result = service.createSignedUrl(1L, "gs://miriart-bucket/artworks/2026-03-10/f.jpg");

        assertThat(result).isNotNull();
        assertThat(result.url()).isNotBlank();
        assertThat(result.url()).startsWith("https://storage.googleapis.com/");
        assertThat(result.expiresAt()).isAfter(Instant.now());
    }

    @Test
    @DisplayName("유효 gcsUri(edited/) → url 반환")
    void createSignedUrl_validEdited_returnsUrl() throws MalformedURLException {
        when(storage.signUrl(
                any(com.google.cloud.storage.BlobInfo.class),
                eq(15L),
                eq(TimeUnit.MINUTES),
                any(Storage.SignUrlOption.class)))
                .thenReturn(new URL("https://storage.googleapis.com/miriart-bucket/edited/2026-03-10/x.png?X-Goog-Signature=def"));

        SignedImageUrl result = service.createSignedUrl(2L, "gs://miriart-bucket/edited/2026-03-10/x.png");

        assertThat(result).isNotNull();
        assertThat(result.url()).isNotBlank();
        assertThat(result.expiresAt()).isAfter(Instant.now());
    }

    @Test
    @DisplayName("잘못된 gcsUri 형식(http) → F005")
    void createSignedUrl_invalidScheme_throwsF005() {
        assertThatThrownBy(() -> service.createSignedUrl(1L, "http://other-bucket/path"))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }

    @Test
    @DisplayName("null gcsUri → F005")
    void createSignedUrl_null_throwsF005() {
        assertThatThrownBy(() -> service.createSignedUrl(1L, null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }

    @Test
    @DisplayName("잘못된 gcsUri(빈 문자열) → F005")
    void createSignedUrl_blank_throwsF005() {
        assertThatThrownBy(() -> service.createSignedUrl(1L, "   "))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }

    @Test
    @DisplayName("허용되지 않은 object path prefix → F005")
    void createSignedUrl_disallowedPrefix_throwsF005() {
        assertThatThrownBy(() -> service.createSignedUrl(1L, "gs://miriart-bucket/other/2026-03-10/f.jpg"))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }

    @Test
    @DisplayName("bucket 불일치 → F005")
    void createSignedUrl_bucketMismatch_throwsF005() {
        assertThatThrownBy(() -> service.createSignedUrl(1L, "gs://other-bucket/artworks/2026-03-10/f.jpg"))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }
}
