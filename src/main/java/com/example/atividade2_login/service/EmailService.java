package com.example.atividade2_login.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public String sendPasswordRecoveryEmail(String toEmail, String userName) {
        String token = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        logger.info("=== Solicitacao de Recuperacao de Senha ===");
        logger.info("Destinatario: {} <{}>", userName, toEmail);
        logger.info("Codigo gerado: {}", token);

        if (mailSender != null && mailUsername != null && !mailUsername.isBlank()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(mailUsername);
                message.setTo(toEmail);
                message.setSubject("Recuperação de Senha - PUC Minas");
                message.setText("Olá " + userName + ",\n\nSeu código para recuperação de senha é: " + token +
                        "\n\nSe você não solicitou esta alteração, ignore este e-mail.");
                mailSender.send(message);
                logger.info("E-mail enviado com sucesso via SMTP para: {}", toEmail);
            } catch (Exception e) {
                logger.warn("Falha no envio via SMTP ({}), token registrado no log para testes.", e.getMessage());
            }
        } else {
            logger.info("Modo de desenvolvimento: credenciais SMTP nao configuradas no application.properties.");
        }
        logger.info("===========================================");

        return token;
    }
}
