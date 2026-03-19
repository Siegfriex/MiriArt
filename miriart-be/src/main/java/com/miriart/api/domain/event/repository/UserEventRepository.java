package com.miriart.api.domain.event.repository;

import com.miriart.api.domain.event.entity.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserEventRepository extends JpaRepository<UserEvent, Long> {

    /**
     * 증분 배치용: 특정 시각 이후 이벤트만 조회 (userId가 있는 것만 코호트 대상).
     */
    List<UserEvent> findByUserIdIsNotNullAndCreatedAtAfter(LocalDateTime after);
}
