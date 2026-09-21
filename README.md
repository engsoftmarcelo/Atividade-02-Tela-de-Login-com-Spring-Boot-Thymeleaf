# 🔐 Atividade 02 - Sistema de Autenticação com Spring Boot, Thymeleaf e Three.js 3D

<div align="center">
  <img src="src/main/resources/static/images/brasao_puc.svg" alt="Brasão PUC Minas" width="120" />
  <h2>Pontifícia Universidade Católica de Minas Gerais</h2>
  <p><strong>Desenvolvimento e Integração de Aplicações Web</strong></p>
  <p>Atividade Prática em Dupla (Pair Programming) • Valor: 2,5 pts</p>
</div>

---

## 🌟 Destaques e Inovações do Projeto

- 🛡️ **Segurança Robusta**: Autenticação completa gerenciada pelo **Spring Security** com senhas criptografadas através de **BCrypt**.
- 🎨 **Interface High-Tech com Efeito UAU**:
  - **Three.js (WebGL 3D)**: Brasão oficial da PUC Minas renderizado em 3D interativo em tempo real via WebGL, com iluminação dinâmica que acompanha o movimento do mouse, reflexos metálicos (PBR) e rotação 360° com arrasto.
  - **Tilt.js (Vanilla-Tilt)**: Efeito de inclinação 3D com reflexo de vidro (*glare*) nos cards ao passar o cursor.
  - **GSAP (GreenSock)**: Animações fluidas de entrada e levitação suave.
  - **Zero Dependência Externa de CDN**: Todas as bibliotecas de animação e 3D (`three.min.js`, `GLTFLoader.js`, `gsap.min.js`, `vanilla-tilt.min.js`) estão embarcadas localmente no projeto (`/static/js/vendor/`), funcionando 100% offline.
- 👤 **Cadastro Completo com Validações**:
  - Validação de campos obrigatórios via **Jakarta Bean Validation**.
  - Verificação de senhas coincidentes.
  - Bloqueio de e-mails ou nomes de usuário duplicados.
  - Medidor dinâmico de força da senha em tempo real.
- 📧 **Recuperação de Senha**: Simulação e envio de token de segurança com registro estruturado em log e suporte a SMTP real via `application.properties`.
- ⚡ **Área Logada Segura (`/home`)**: Dashboard com dados do usuário autenticado, estatísticas de segurança e encerramento seguro de sessão (Logout).

---

## 🌐 Endpoints da Aplicação

| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/login` | Exibe a tela de login interativa com Brasão 3D | Público |
| `POST` | `/login` | Processamento de autenticação via Spring Security | Público |
| `GET` | `/register` | Exibe a tela de cadastro de novos usuários | Público |
| `POST` | `/register` | Processa e valida os dados de cadastro | Público |
| `GET` | `/recoverpassword` | Exibe a tela para recuperação de senha | Público |
| `POST` | `/recoverpassword` | Processa o envio de código/token de recuperação | Público |
| `GET` | `/home` | Dashboard restrito do usuário autenticado | Protegido (`ROLE_USER`) |
| `POST` | `/logout` | Encerra a sessão e limpa cookies e contexto | Protegido |
| `GET` | `/` | Redireciona automaticamente para `/home` | Protegido |
| `GET` | `/models/brasao_puc.glb` | Modelo 3D glTF binário do Brasão PUC Minas | Público |

---

## 🔑 Contas Pré-Cadastradas para Testes

Para agilizar a avaliação pelo professor, a aplicação já inicializa automaticamente com duas contas de teste prontas para uso:

| Perfil | Usuário / E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin` ou `admin@pucminas.br` | `puc123` |
| **Aluno** | `aluno` ou `aluno@sga.pucminas.br` | `puc123` |

> 💡 *Você também pode cadastrar qualquer novo usuário pela tela `/register` e autenticar-se imediatamente!*

---

## 🚀 Como Executar a Aplicação

### Pré-requisitos
- **Java 17, 21 ou 25** instalado no sistema.
- Navegador moderno com suporte a WebGL (Google Chrome, Microsoft Edge, Firefox, Safari ou Opera).

### Passo 1: Clonar o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd atividade2_login
```

### Passo 2: Executar com o Maven Wrapper
No Windows (PowerShell / Prompt de Comando):
```powershell
.\mvnw.cmd spring-boot:run
```

No Linux / macOS:
```bash
./mvnw spring-boot:run
```

### Passo 3: Acessar no Navegador
Abra o navegador e acesse:
```text
http://localhost:8080/login
```

---

## 🏗️ Estrutura Arquitetural do Projeto

```text
src/
└── main/
    ├── java/com/example/atividade2_login/
    │   ├── config/
    │   │   ├── SecurityConfig.java     # Configuração do Spring Security 7 & BCrypt
    │   │   └── WebConfig.java          # Mapeamento de recursos estáticos 3D
    │   ├── controller/
    │   │   └── AuthController.java     # Controle de rotas (/login, /register, etc.)
    │   ├── dto/
    │   │   └── RegisterDTO.java        # Objeto de transferência e validações
    │   ├── model/
    │   │   └── User.java               # Entidade de usuário
    │   ├── repository/
    │   │   └── UserRepository.java     # Persistência em memória thread-safe
    │   ├── service/
    │   │   ├── EmailService.java       # Serviço de envio e token de recuperação
    │   │   ├── UserDetailsServiceImpl.java # Integração com Spring Security
    │   │   └── UserService.java        # Regras de negócio e hash BCrypt
    │   └── Atividade2LoginApplication.java
    │
    └── resources/
        ├── static/
        │   ├── css/
        │   │   └── style.css           # Estilização Glassmorphism & Paleta PUC
        │   ├── js/
        │   │   ├── vendor/             # Three.js, GSAP, Tilt.js embarcados
        │   │   ├── puc3d.js            # Cena WebGL 3D, iluminação e controles
        │   │   └── app.js              # Interações de UI, tilt e validações
        │   ├── images/
        │   │   ├── brasao_puc.png      # Textura e brasão oficial em alta resolução
        │   │   └── brasao_puc.svg      # Vetor oficial da PUC Minas
        │   └── models/
        │       └── brasao_puc.glb      # Modelo 3D binário oficial otimizado
        │
        └── templates/
            ├── login.html              # Tela de Login com 3D Three.js & Tilt
            ├── register.html           # Tela de Cadastro com medidor de força
            ├── recoverpassword.html    # Tela de Recuperação de Senha
            └── home.html               # Painel Restrito do Aluno
```

---

## 👥 Integrantes da Dupla (Pair Programming)

- **Marcelo Gomes de Oliveira Junior**
- **Victor Cândido Leite**

*Pontifícia Universidade Católica de Minas Gerais — ICEI*
