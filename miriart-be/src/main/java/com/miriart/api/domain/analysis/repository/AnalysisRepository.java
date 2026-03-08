package com.miriart.api.domain.analysis.repository;

import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.entity.AnalysisStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 작품 분석 JPA 리포지토리. 사용자별 목록·단건 조회.
 *
 * <p>연계: {@link AnalysisService}에서 save, findByUserId, findByIdAndUserId 사용.</p>
 *
 * @author MiriArt Team
 */
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

    Page<Analysis> findByUserId(Long userId, Pageable pageable);

    Optional<Analysis> findByIdAndUserId(Long id, Long userId);

    List<Analysis> findByStatusAndCreatedAtBefore(AnalysisStatus status, LocalDateTime threshold);
}
