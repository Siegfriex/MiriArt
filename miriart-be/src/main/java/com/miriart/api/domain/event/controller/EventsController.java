package com.miriart.api.domain.event.controller;

import com.miriart.api.domain.event.dto.TrackEventRequest;
import com.miriart.api.domain.event.service.EventLoggingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * FE PAGE_VIEW 이벤트 수신 엔드포인트. 비인증(permitAll) 허용.
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventsController {

    private static final Set<String> ALLOWED_EVENT_TYPES = Set.of("PAGE_VIEW");

    private final EventLoggingService eventLoggingService;

    @PostMapping
    public ResponseEntity<Void> trackEvent(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid TrackEventRequest req) {

        // eventType 화이트리스트 검증
        if (!ALLOWED_EVENT_TYPES.contains(req.getEventType())) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, Object> extra = new HashMap<>();
        if (req.getClientTs() != null) {
            extra.put("client_ts", req.getClientTs());
        }
        if (req.getUserAgent() != null) {
            extra.put("user_agent", truncate(req.getUserAgent(), 200));
        }

        eventLoggingService.publishPageView(
                userId,
                req.getSessionKey(),
                req.getSource(),
                req.getPage(),
                req.getReferrer(),
                extra
        );

        return ResponseEntity.ok().build();
    }

    private String truncate(String value, int maxLength) {
        return (value != null && value.length() > maxLength)
                ? value.substring(0, maxLength)
                : value;
    }
}
