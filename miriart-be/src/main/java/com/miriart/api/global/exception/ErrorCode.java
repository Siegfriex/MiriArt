package com.miriart.api.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * MiriArt 에러 코드 정의. HTTP 상태·코드 문자열·한글 메시지 보유.
 *
 * <p>연계: {@link BusinessException} 생성자 인자, {@link GlobalExceptionHandler}·{@link ApiResponse#error}에서
 * 클라이언트 응답 code/message 결정. 공통·Auth·Member·File·Analysis·Credit·AI Chat·Community 도메인별 코드.</p>
 *
 * <p>Cariv global/ 패턴 이식 + MiriArt 신규 코드 추가.</p>
 *
 * @author MiriArt Team
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common (공통)
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다"),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C002", "허용되지 않은 HTTP 메서드입니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C003", "서버 오류가 발생했습니다"),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, "C004", "잘못된 타입입니다"),
    HANDLE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "C005", "접근이 거부되었습니다"),
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "C006", "엔티티를 찾을 수 없습니다"),

    // Auth (인증)
    OAUTH_PROVIDER_UNSUPPORTED(HttpStatus.BAD_REQUEST, "AUTH001", "지원하지 않는 OAuth 제공자입니다"),
    OAUTH_CODE_INVALID(HttpStatus.BAD_REQUEST, "AUTH002", "유효하지 않거나 만료된 인가 코드입니다"),
    OAUTH_EMAIL_CONSENT_REQUIRED(HttpStatus.BAD_REQUEST, "AUTH003", "이메일 동의가 필요합니다"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "AUTH004", "유효하지 않은 토큰입니다"),
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH005", "만료된 액세스 토큰입니다"),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH006", "만료된 리프레시 토큰입니다"),
    OAUTH_USER_INFO_FAILED(HttpStatus.BAD_GATEWAY, "AUTH007", "OAuth 사용자 정보 조회에 실패했습니다"),
    OAUTH_TOKEN_EXCHANGE_FAILED(HttpStatus.BAD_GATEWAY, "AUTH008", "OAuth 토큰 교환에 실패했습니다"),

    // Member (회원)
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "M001", "회원을 찾을 수 없습니다"),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "M002", "이미 존재하는 닉네임입니다"),
    MEMBER_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "M003", "이미 삭제된 회원입니다"),

    // File (파일)
    FILE_EMPTY(HttpStatus.BAD_REQUEST, "F001", "업로드할 파일이 없습니다"),
    FILE_TOO_LARGE(HttpStatus.BAD_REQUEST, "F002", "파일 크기가 제한을 초과했습니다 (최대 10MB)"),
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "F003", "파일 업로드에 실패했습니다"),

    // Analysis (분석 — MiriArt 신규)
    AI_ANALYSIS_FAILED(HttpStatus.BAD_GATEWAY, "AN001", "AI 분석 서비스 연결에 실패했습니다"),
    AI_ANALYSIS_TIMEOUT(HttpStatus.GATEWAY_TIMEOUT, "AN002", "분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요"),
    ANALYSIS_NOT_FOUND(HttpStatus.NOT_FOUND, "AN003", "분석 결과를 찾을 수 없습니다"),

    // Credit (크레딧 — MiriArt 신규)
    CREDIT_LIMIT_EXCEEDED(HttpStatus.PAYMENT_REQUIRED, "CR001", "이번 달 분석 한도를 초과했습니다. 플랜을 업그레이드해주세요"),
    PLAN_UPGRADE_REQUIRED(HttpStatus.BAD_REQUEST, "CR002", "이 기능은 Basic 플랜 이상에서 사용 가능합니다"),

    // AI Chat (AI 채팅 — MiriArt 신규)
    AI_CHAT_FAILED(HttpStatus.BAD_GATEWAY, "AI001", "AI 멘토 연결에 실패했습니다. 다시 시도해주세요"),
    AI_CHAT_TIMEOUT(HttpStatus.GATEWAY_TIMEOUT, "AI002", "AI 응답 시간이 초과됐습니다"),

    // Community (커뮤니티 — MiriArt 신규, Phase C)
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "CM001", "게시글을 찾을 수 없습니다"),
    POST_LOCKED_BY_ANSWER(HttpStatus.BAD_REQUEST, "CM002", "답변이 달린 질문은 수정/삭제할 수 없습니다"),
    ANSWER_ALREADY_ACCEPTED(HttpStatus.BAD_REQUEST, "CM003", "이미 채택된 답변이 있습니다"),
    ACCEPT_FORBIDDEN(HttpStatus.FORBIDDEN, "CM004", "채택은 질문 작성자만 가능합니다"),
    POST_DEADLINE_PASSED(HttpStatus.BAD_REQUEST, "CM005", "마감된 질문입니다"),
    LIKE_ALREADY_EXISTS(HttpStatus.CONFLICT, "CM006", "이미 좋아요를 눌렀습니다"),
    REPORT_ALREADY_EXISTS(HttpStatus.CONFLICT, "CM007", "이미 신고한 컨텐츠입니다");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
