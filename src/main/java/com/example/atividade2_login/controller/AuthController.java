package com.example.atividade2_login.controller;

import com.example.atividade2_login.dto.RegisterDTO;
import com.example.atividade2_login.model.User;
import com.example.atividade2_login.service.EmailService;
import com.example.atividade2_login.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.Optional;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/")
    public String root() {
        return "redirect:/home";
    }

    @GetMapping("/login")
    public String login(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            @RequestParam(value = "registered", required = false) String registered,
            @RequestParam(value = "recovered", required = false) String recovered,
            Model model) {

        if (error != null) {
            model.addAttribute("errorMessage", "Credenciais inválidas! Verifique seu usuário/e-mail e senha.");
        }
        if (logout != null) {
            model.addAttribute("infoMessage", "Você encerrou sua sessão com sucesso.");
        }
        if (registered != null && !model.containsAttribute("successMessage")) {
            model.addAttribute("successMessage", "Cadastro realizado com sucesso! Faça seu login para continuar.");
        }
        if (recovered != null && !model.containsAttribute("successMessage")) {
            model.addAttribute("successMessage", "Instruções de recuperação enviadas com sucesso! Verifique seu e-mail.");
        }

        return "login";
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        if (!model.containsAttribute("user")) {
            model.addAttribute("user", new RegisterDTO());
        }
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(
            @Valid @ModelAttribute("user") RegisterDTO registerDTO,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {

        // Validação: senhas coincidentes
        if (registerDTO.getPassword() != null && registerDTO.getConfirmPassword() != null
                && !registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            bindingResult.rejectValue("confirmPassword", "error.confirmPassword", "As senhas não coincidem!");
        }

        // Validação: usuário duplicado
        if (registerDTO.getUsername() != null && userService.existsByUsername(registerDTO.getUsername().trim())) {
            bindingResult.rejectValue("username", "error.username", "Este nome de usuário já está em uso.");
        }

        // Validação: email duplicado
        if (registerDTO.getEmail() != null && userService.existsByEmail(registerDTO.getEmail().trim())) {
            bindingResult.rejectValue("email", "error.email", "Este e-mail já está cadastrado no sistema.");
        }

        if (bindingResult.hasErrors()) {
            return "register";
        }

        userService.registerUser(registerDTO);
        redirectAttributes.addFlashAttribute("successMessage", "Conta criada com sucesso! Faça seu login.");
        return "redirect:/login?registered=true";
    }

    @GetMapping("/recoverpassword")
    public String showRecoverPasswordForm() {
        return "recoverpassword";
    }

    @PostMapping("/recoverpassword")
    public String processPasswordRecovery(
            @RequestParam("email") String email,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (email == null || email.trim().isEmpty()) {
            model.addAttribute("errorMessage", "Informe seu endereço de e-mail.");
            return "recoverpassword";
        }

        Optional<User> userOptional = userService.findByEmail(email.trim());

        if (userOptional.isEmpty()) {
            model.addAttribute("errorMessage", "Não encontramos nenhuma conta vinculada ao e-mail informado.");
            model.addAttribute("email", email);
            return "recoverpassword";
        }

        User user = userOptional.get();
        emailService.sendPasswordRecoveryEmail(user.getEmail(), user.getName());

        redirectAttributes.addFlashAttribute("successMessage", 
                "E-mail de recuperação enviado para " + user.getEmail() + "! Verifique sua caixa de entrada.");
        return "redirect:/login?recovered=true";
    }

    @GetMapping("/home")
    public String home(Principal principal, Model model) {
        if (principal != null) {
            String username = principal.getName();
            Optional<User> userOpt = userService.findByUsernameOrEmail(username);
            userOpt.ifPresent(user -> model.addAttribute("currentUser", user));
        }
        return "home";
    }
}
