package com.miriart.api.global.storage;

import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * dev 프로파일용 Signed URL 서비스. GCS 없이 기동 가능하게 하며, 호출 시 F005 반환.
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@Profile("dev")
public class MockGcsSignedUrlService implements SignedUrlService {

    @Override
    public SignedImageUrl createSignedUrl(Long analysisId, String gcsUri) {
        log.warn("event=signed_url_error analysisId={} objectPath=null ttl=0 errorCode=F005 mock_dev", analysisId);
        throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
    }
}
