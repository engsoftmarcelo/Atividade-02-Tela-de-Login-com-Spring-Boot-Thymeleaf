package com.example.atividade2_login.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public String sendPasswordRecoveryEmail(String toEmail, String userName) {
        String token = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        logger.info("==================================================================");
        logger.info("📧 [RECUPERAÇÃO DE SENHA - PUC MINAS]");
        logger.info("Destinatário: {} ({})", userName, toEmail);
        logger.info("Código de Recuperação: {}", token);
        logger.info("Mensagem: Utilize este código para redefinir sua senha no sistema.");
        logger.info("==================================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("Recuperação de Senha - PUC Minas");
                message.setText("Olá " + userName + ",\n\nSeu código para recuperação de senha é: " + token +
                        "\n\nSe você não solicitou esta alteração, ignore este e-mail.");
                mailSender.send(message);
                logger.info("E-mail real enviado com sucesso para: {}", toEmail);
            } catch (Exception e) {
                logger.warn("Aviso: Envio real via SMTP falhou ({}), simulação registrada no log com sucesso.", e.getMessage());
            }
        }

        return token;
    }
}
