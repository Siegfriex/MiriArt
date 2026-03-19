package com.miriart.api.domain.event.util;

import java.util.regex.Pattern;

/**
 * 개인식별정보(PII) 마스킹 유틸. truncated_content에서 전화번호/이메일 패턴을 마스킹.
 */
public final class PiiFilter {

    private PiiFilter() {}

    // 한국 전화번호: 010-1234-5678, 01012345678, 010 1234 5678
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "0\\d{1,2}[-\\s.]?\\d{3,4}[-\\s.]?\\d{4}");

    // 이메일: user@domain.com
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");

    public static String mask(String text) {
        if (text == null || text.isBlank()) return text;
        String result = PHONE_PATTERN.matcher(text).replaceAll("[PHONE]");
        result = EMAIL_PATTERN.matcher(result).replaceAll("[EMAIL]");
        return result;
    }
}
