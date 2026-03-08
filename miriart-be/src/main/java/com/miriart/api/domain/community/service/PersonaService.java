package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.entity.Persona;
import com.miriart.api.domain.community.repository.PersonaRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 페르소나(가명) 서비스. 동일 (userId, boardScope)에 대해 하나의 페르소나 보장.
 * UNIQUE(uq_user_scope) 경쟁 시 DataIntegrityViolation → 재조회로 방어.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PersonaService {

    private static final List<String> ANIMAL_NAMES = List.of(
            "토끼", "고양이", "강아지", "여우", "곰", "펭귄", "코알라", "판다", "사슴", "부엉이",
            "다람쥐", "수달", "돌고래", "앵무새", "햄스터"
    );
    private static final List<String> COLOR_TOKENS = List.of(
            "#C2F970", "#70C2F9", "#F970C2", "#F9C270", "#70F9C2",
            "#9370F9", "#F97093", "#93F970", "#7093F9", "#F9D670"
    );

    private final PersonaRepository personaRepository;
    private final UserRepository userRepository;

    @Transactional
    public Persona getOrCreatePersona(Long userId, String boardScope) {
        return personaRepository.findByUserIdAndBoardScope(userId, boardScope)
                .orElseGet(() -> {
                    try {
                        User user = userRepository.findByIdOrThrow(userId);
                        Persona persona = Persona.builder()
                                .user(user)
                                .boardScope(boardScope)
                                .displayName(generateRandomName())
                                .colorToken(generateRandomColor())
                                .build();
                        return personaRepository.save(persona);
                    } catch (DataIntegrityViolationException e) {
                        // 동시 생성 경쟁 시 UNIQUE(uq_user_scope) 위반 → 기존 persona 재조회
                        log.debug("Persona UNIQUE race condition, userId={}, scope={}", userId, boardScope);
                        return personaRepository.findByUserIdAndBoardScope(userId, boardScope)
                                .orElseThrow(() -> e);
                    }
                });
    }

    private String generateRandomName() {
        ThreadLocalRandom rng = ThreadLocalRandom.current();
        return "익명 " + ANIMAL_NAMES.get(rng.nextInt(ANIMAL_NAMES.size()));
    }

    private String generateRandomColor() {
        ThreadLocalRandom rng = ThreadLocalRandom.current();
        return COLOR_TOKENS.get(rng.nextInt(COLOR_TOKENS.size()));
    }
}
