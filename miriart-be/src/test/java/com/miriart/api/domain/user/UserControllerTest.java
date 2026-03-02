package com.miriart.api.domain.user;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * P1: GET /api/users/me (planType 포함), GET /api/users/me/plan (FREE monthlyLimit=5) 검증.
 */
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(
                User.builder()
                        .provider(LoginProvider.GOOGLE)
                        .providerUserId("user-test-" + UUID.randomUUID())
                        .email("user-test@example.com")
                        .build()
        );
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), testUser.getRole().name());
    }

    @Test
    @DisplayName("GET /api/users/me - planType, role, needsProfile 포함")
    void getMyProfile_includesPlanTypeAndRole() throws Exception {
        ResultActions result = mockMvc.perform(get("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.path("planType").asText()).isEqualTo("FREE");
        assertThat(data.path("role").asText()).isEqualTo("USER");
        assertThat(data.path("needsProfile").asBoolean()).isTrue();
        assertThat(data.path("id").asText()).isEqualTo(String.valueOf(testUser.getId()));
    }

    @Test
    @DisplayName("GET /api/users/me/plan - FREE monthlyLimit=5")
    void getPlan_returnsFreeLimitFive() throws Exception {
        ResultActions result = mockMvc.perform(get("/api/users/me/plan")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.path("plan").asText()).isEqualTo("FREE");
        assertThat(data.path("monthlyLimit").asInt()).isEqualTo(5);
        assertThat(data.path("billingPeriodStart").isMissingNode()).isFalse();
    }

    @Test
    @DisplayName("PATCH /api/users/me/profile - 완료 후 needsProfile=false, planType 유지")
    void updateProfile_thenMe_hasNeedsProfileFalse() throws Exception {
        mockMvc.perform(patch("/api/users/me/profile")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"테스트닉","grade":"고3","domain":"기초디자인"}
                                """))
                .andExpect(status().isOk());

        ResultActions me = mockMvc.perform(get("/api/users/me")
                .header(HttpHeaders.AUTHORIZATION, bearer()));
        JsonNode data = objectMapper.readTree(me.andReturn().getResponse().getContentAsString()).path("data");
        assertThat(data.path("needsProfile").asBoolean()).isFalse();
        assertThat(data.path("planType").asText()).isEqualTo("FREE");
    }
}
