package com.miriart.api.domain.community.dto;

import com.miriart.api.domain.community.entity.Persona;

/**
 * 페르소나 응답 DTO. FE personaSchema (community.ts) 매핑.
 */
public record PersonaResponse(String displayName, String colorToken) {

    public static PersonaResponse from(Persona p) {
        return p != null
                ? new PersonaResponse(p.getDisplayName(), p.getColorToken())
                : new PersonaResponse("익명", "#888888");
    }
}
