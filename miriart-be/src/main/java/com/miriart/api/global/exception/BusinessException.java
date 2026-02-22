package com.miriart.api.global.exception;

import lombok.Getter;

/**
 * 비즈니스 로직 예외. 도메인/서비스에서 throw 시 {@link GlobalExceptionHandler}가 잡아 ErrorResponse로 변환.
 *
 * <p>연계: 서비스에서 {@link ErrorCode}와 함께 throw → 클라이언트에 해당 코드·메시지·HTTP 상태 반환.</p>
 *
 * @author MiriArt Team
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
