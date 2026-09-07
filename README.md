# Campus Connect

**Campus Connect** é uma aplicação projetada para facilitar a comunicação entre coordenadores de grupos de cursos e seus discentes em um ambiente universitário. Composta por três componentes principais - uma API, uma interface web e um aplicativo móvel - o **Campus Connect** oferece uma solução abrangente para gerenciar mensagens e notificações.

## Funcionalidades Principais

1. **Mensagens e Notificações**:
   - Coordenadores podem enviar mensagens importantes para todos os discentes de um grupo específico.
   - Notificações instantâneas são enviadas para dispositivos móveis dos discentes, garantindo que eles estejam sempre atualizados.

2. **Gerenciamento de Grupos**:
   - Coordenadores podem criar e gerenciar grupos de cursos.
   - Discentes podem se inscrever em grupos relevantes.

## 🔗 Ecossistema do Projeto (Arquitetura Fullstack)

O **Campus Connect** é composto por 3 camadas integradas:

1. 💻 **Interface Web (Este Repositório):** Desenvolvida em Angular e TypeScript para gestão administrativa de coordenadores e acesso web de discentes.
2. ⚙️ **Backend & Mensageria:** **[Campus Connect API (Java 21, Spring Boot, PostgreSQL, Docker, FCM)](https://github.com/cc-tcc-udf/message-api)** — Processa autenticação JWT, regras de negócio e despacho de push notifications.
3. 📱 **Aplicativo Móvel:** **[Campus Connect Mobile (Flutter / Dart)](https://github.com/cc-tcc-udf/message-mobile)** — Aplicativo multiplataforma para recebimento de notificações push em tempo real.

---

## 🛠️ Tecnologias da Interface Web

- **Framework:** Angular
- **Linguagem:** TypeScript
- **Estilização:** CSS / PrimeNG
- **Comunicação:** Integração RESTful com a API Java Spring Boot

## Configuração

1. Clone repositórios.
2. Configure a API com as credenciais de banco de dados e autenticação.
3. Inicie a API, a interface web e o aplicativo móvel.

## Equipe

> - [Taui Silva](https://github.com/tauisilva) 🐲🦄🦕🦖🐳
> - [Johnatan Santos](https://github.com/Johnatan-Caetano) 👻🦁🦐🦜
> - [Carla Mariana](https://github.com/TekhneDev) 🦝🦙🐍

**Campus Connect** é uma ferramenta essencial para coordenadores e discentes se conectarem e compartilharem informações de forma eficiente. Esperamos que esta aplicação torne a experiência universitária mais colaborativa e produtiva! 🎓📱🌟
