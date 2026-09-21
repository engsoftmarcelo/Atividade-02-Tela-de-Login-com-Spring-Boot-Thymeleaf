# Atividade 02 - Sistema de Autenticação com Spring Boot e Thymeleaf

<div align="center">
  <img src="src/main/resources/static/images/brasao_puc.svg" alt="Brasão PUC Minas" width="110" />
  <h3>Pontifícia Universidade Católica de Minas Gerais</h3>
  <p><strong>Instituto de Ciências Exatas e Informática (ICEI) — Engenharia de Software</strong></p>
  <p>Disciplina: Desenvolvimento e Integração de Aplicações Web</p>
  <p>Atividade Prática em Dupla (Pair Programming) • Valor: 2,5 pontos</p>
</div>

---

## 👥 Integrantes da Dupla

- **Marcelo Gomes de Oliveira Junior**
- **Victor Cândido Leite**

---

## 📌 Visão Geral do Projeto

Este projeto consiste em uma aplicação web desenvolvida com **Spring Boot** e **Thymeleaf**, implementando um fluxo completo de **autenticação, cadastro de novos usuários e recuperação de senha**.

A interface visual foi concebida com identidade institucional própria, utilizando a paleta de cores da PUC Minas (azul marinho profundo e detalhes em âmbar/dourado), complementada pela renderização interativa em 3D do brasão institucional em WebGL (Three.js), com suporte a fallback automático para imagens convencionais caso o navegador do usuário não disponha de aceleração gráfica.

---

## 🛠️ Tecnologias Utilizadas

- **Java 17 / 21 / 25**: Linguagem base da aplicação.
- **Spring Boot 4 / Spring Framework**: Framework principal para inversão de controle e injeção de dependências.
- **Spring Security**: Mecanismo de autenticação, controle de sessões e autorização de endpoints.
- **BCrypt**: Algoritmo de hash criptográfico unidirecional com salt dinâmico para armazenamento seguro de senhas.
- **Jakarta Bean Validation**: Validação declarativa de integridade de dados nos formulários.
- **Thymeleaf**: Engine de renderização de templates HTML integrada ao Spring MVC.
- **Spring Mail**: Módulo para integração e despacho de mensagens via protocolo SMTP.
- **HTML5 / CSS3 / JavaScript**: Interface com design responsivo, estilização glassmorphism e Three.js para o elemento visual institucional.

---

## 🌐 Endpoints da Aplicação

| Método | Endpoint | Descrição | Nível de Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/login` | Renderiza a página de autenticação | Público |
| `POST` | `/login` | Processa as credenciais informadas (gerenciado pelo Spring Security) | Público |
| `GET` | `/register` | Renderiza o formulário de cadastro de usuário | Público |
| `POST` | `/register` | Valida os dados submetidos e cria o novo usuário | Público |
| `GET` | `/recoverpassword` | Renderiza a tela de solicitação de recuperação de senha | Público |
| `POST` | `/recoverpassword` | Processa a solicitação e dispara o token de recuperação | Público |
| `GET` | `/home` | Painel restrito com os dados do usuário autenticado | Autenticado (`ROLE_USER`) |
| `POST` | `/logout` | Encerra a sessão atual e invalida os cookies de autenticação | Autenticado |
| `GET` | `/` | Redireciona o fluxo para a área principal (`/home`) | Autenticado |

---

## 📋 Regras de Negócio e Validações

### 1. Autenticação (`/login`)
- Permite autenticação tanto pelo **nome de usuário** quanto pelo **endereço de e-mail institucional**.
- Validação de senha através de conferência de hash BCrypt.
- Exibição de alertas dinâmicos para credenciais incorretas (`?error=true`), encerramento de sessão (`?logout=true`), cadastro recém-concluído (`?registered=true`) e solicitação de recuperação de senha (`?recovered=true`).

### 2. Cadastro de Usuários (`/register`)
- **Campos obrigatórios**: Validação via Jakarta Bean Validation contra valores nulos ou em branco (`@NotBlank`).
- **Formato de e-mail**: Validação de conformidade estrutural de e-mail (`@Email`).
- **Unicidade de dados**: Bloqueio de cadastros com nome de usuário ou e-mail já registrados no repositório.
- **Conferência de senhas**: Validação que impede o envio de confirmação divergente da senha principal.
- **Política de tamanho**: Exigência de senha com tamanho mínimo de 6 caracteres.
- **Indicador de complexidade**: Script de apoio em tempo real para orientação do usuário quanto à força da senha digitada.

### 3. Recuperação de Senha (`/recoverpassword`)
- Busca de usuário pelo e-mail cadastrado.
- Geração de token alfanumérico seguro para redefinição.
- **Envio de e-mail flexível**:
  - Quando configuradas as credenciais SMTP no ambiente (`SPRING_MAIL_USERNAME` e `SPRING_MAIL_PASSWORD`), o sistema realiza o envio real da mensagem com o código.
  - Em ambiente de desenvolvimento/avaliação sem credenciais externas, o token é registrado diretamente nos logs da aplicação com formato padronizado, permitindo testes rápidos sem dependência de chaves de terceiros.

### 4. Área Protegida (`/home`)
- Acesso condicionado à presença de sessão ativa autenticada no Spring Security.
- Exibição do nome completo, username, e-mail e confirmação do método de proteção da conta (BCrypt).
- Botão de logout com submissão via método `POST` e proteção contra falsificação de requisições cross-site (CSRF).

---

## 🔑 Credenciais Pré-Cadastradas para Testes

Para facilitar a validação e avaliação da atividade, a aplicação inicializa automaticamente com duas contas de demonstração:

| Perfil | Usuário | E-mail | Senha |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin@pucminas.br` | `puc123` |
| **Aluno** | `aluno` | `aluno@sga.pucminas.br` | `puc123` |

> *Nota: É possível registrar novos usuários diretamente pela interface `/register` e utilizá-los imediatamente no login.*

---

## 🚀 Como Executar a Aplicação

### Pré-requisitos
- **Java JDK (versão 17, 21 ou superior)** instalado e configurado no PATH.
- Conexão de rede ativa na primeira execução para resolução inicial de dependências do Maven.

### Passo 1: Obter o Código-Fonte
Clone o repositório ou descompacte o arquivo do projeto no diretório desejado:
```bash
git clone <URL_DO_REPOSITORIO>
cd atividade2_login
```

### Passo 2: Executar o Projeto com o Maven Wrapper
No **Windows (PowerShell ou Prompt de Comando)**:
```powershell
.\mvnw.cmd spring-boot:run
```

No **Linux ou macOS**:
```bash
./mvnw spring-boot:run
```

### Passo 3: Acessar a Interface
Após a mensagem de inicialização do Spring Boot no terminal (`Started Atividade2LoginApplication`), abra o navegador de sua preferência no endereço:
```text
http://localhost:8080/login
```

---

## ⚙️ Configurações e Variáveis de Ambiente

Conforme boas práticas de segurança, nenhuma senha ou credencial sensível foi armazenada de forma estática no código-fonte. O arquivo `src/main/resources/application.properties` está preparado para receber credenciais via variáveis de ambiente:

| Variável de Ambiente | Descrição | Valor Padrão |
| :--- | :--- | :--- |
| `SPRING_MAIL_HOST` | Host do servidor SMTP | `smtp.gmail.com` |
| `SPRING_MAIL_PORT` | Porta de conexão SMTP (STARTTLS) | `587` |
| `SPRING_MAIL_USERNAME` | Usuário/E-mail para autenticação SMTP | *(vazio - modo log de dev)* |
| `SPRING_MAIL_PASSWORD` | Senha de aplicativo do provedor SMTP | *(vazio)* |

Caso as variáveis de e-mail não sejam declaradas, a aplicação executa normalmente em modo de desenvolvimento, exibindo o código de recuperação no terminal da aplicação para fins de conferência da banca avaliadora.

---

## 📂 Estrutura de Pacotes e Diretórios

A estrutura do projeto segue a arquitetura padrão em camadas recomendada para aplicações Spring Boot:

```text
src/
└── main/
    ├── java/com/example/atividade2_login/
    │   ├── config/
    │   │   ├── SecurityConfig.java         # Configurações de rotas, filtros e BCrypt
    │   │   └── WebConfig.java              # Mapeamento de recursos estáticos
    │   ├── controller/
    │   │   └── AuthController.java         # Endpoints de autenticação, registro e recuperação
    │   ├── dto/
    │   │   └── RegisterDTO.java            # DTO com regras de validação Jakarta
    │   ├── model/
    │   │   └── User.java                   # Entidade representativa de Usuário
    │   ├── repository/
    │   │   └── UserRepository.java         # Camada de persistência em memória thread-safe
    │   ├── service/
    │   │   ├── EmailService.java           # Lógica de despacho e token de recuperação
    │   │   ├── UserDetailsServiceImpl.java # Integração com UserDetailsService do Spring
    │   │   └── UserService.java            # Regras de negócio e hashing de senhas
    │   └── Atividade2LoginApplication.java # Classe principal de inicialização
    │
    └── resources/
        ├── static/
        │   ├── css/
        │   │   └── style.css               # Folha de estilos institucional
        │   ├── js/
        │   │   ├── puc3d.js                # Renderização WebGL 3D do brasão institucional
        │   │   ├── app.js                  # Interações de formulário e validações visuais
        │   │   └── vendor/                 # Bibliotecas de suporte empacotadas localmente
        │   ├── images/                     # Logotipos e brasão institucional em PNG/SVG
        │   └── models/                     # Modelo 3D oficial do brasão PUC Minas (.glb)
        │
        ├── templates/
        │   ├── login.html                  # Interface da tela de login
        │   ├── register.html               # Interface do formulário de cadastro
        │   ├── recoverpassword.html        # Interface de recuperação de senha
        │   └── home.html                   # Dashboard da área autenticada
        │
        └── application.properties          # Propriedades de configuração do sistema
```

