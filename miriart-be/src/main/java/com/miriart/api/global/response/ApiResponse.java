package com.miriart.api.global.response;

import com.miriart.api.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 공통 API 성공/실패 응답 래퍼. success, data, code, message 필드.
 *
 * <p>연계: 컨트롤러에서 ApiResponse.success(data) 또는 ApiResponse.error(ErrorCode)로
 * 일관된 JSON 구조 반환. FE는 success로 분기 후 data 또는 code/message 사용.</p>
 *
 * @author MiriArt Team
 */
@Schema(description = "공통 API 래퍼: success(성공 여부), data(페이로드), code(에러 코드), message(에러 메시지)")
@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    private final boolean success;
    private final T data;
    private final String code;
    private final String message;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(true, null, null, null);
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(false, null, errorCode.getCode(), errorCode.getMessage());
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String message) {
        return new ApiResponse<>(false, null, errorCode.getCode(), message);
    }
}
