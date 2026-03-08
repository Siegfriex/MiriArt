package com.miriart.api.domain.community.dto;

/**
 * 신고 요청 DTO. reason은 선택.
 */
public record ReportRequest(String reason) {}
