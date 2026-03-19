package com.miriart.api.domain.event.repository;

import com.miriart.api.domain.event.entity.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEventRepository extends JpaRepository<UserEvent, Long> {
}
