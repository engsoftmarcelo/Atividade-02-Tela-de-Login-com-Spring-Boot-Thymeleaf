package com.example.atividade2_login;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve carregar a página de login com status 200")
    void deveCarregarTelaLogin() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"));
    }

    @Test
    @DisplayName("Deve carregar a página de cadastro com status 200")
    void deveCarregarTelaRegistro() throws Exception {
        mockMvc.perform(get("/register"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("user"));
    }

    @Test
    @DisplayName("Deve carregar a página de recuperação de senha com status 200")
    void deveCarregarTelaRecuperacao() throws Exception {
        mockMvc.perform(get("/recoverpassword"))
                .andExpect(status().isOk())
                .andExpect(view().name("recoverpassword"));
    }

    @Test
    @DisplayName("Deve redirecionar para o login ao tentar acessar rota protegida sem autenticação")
    void deveBloquearAcessoNaoAutenticado() throws Exception {
        mockMvc.perform(get("/home"))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    @DisplayName("Deve permitir acesso ao painel home para usuário autenticado")
    void devePermitirAcessoAutenticado() throws Exception {
        mockMvc.perform(get("/home").with(user("aluno")))
                .andExpect(status().isOk())
                .andExpect(view().name("home"));
    }

    @Test
    @DisplayName("Deve rejeitar formulário de cadastro quando senhas não coincidem")
    void deveRejeitarSenhasDivergentes() throws Exception {
        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("name", "Teste Silva")
                        .param("username", "testesilva")
                        .param("email", "teste@pucminas.br")
                        .param("password", "senha123")
                        .param("confirmPassword", "outrasenha"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().hasErrors());
    }
}
