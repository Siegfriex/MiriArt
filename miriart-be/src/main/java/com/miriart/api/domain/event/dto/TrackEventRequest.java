package com.miriart.api.domain.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

/**
 * FE → BE PAGE_VIEW 이벤트 수신용 DTO.
 */
@Getter
public class TrackEventRequest {

    @NotBlank(message = "eventType은 필수입니다")
    @Size(max = 50)
    private String eventType;

    @Size(max = 64)
    private String sessionKey;

    @Size(max = 100)
    private String page;

    @Size(max = 200)
    private String referrer;

    @Size(max = 20)
    private String source;

    private Long clientTs;

    @Size(max = 200)
    private String userAgent;
}
