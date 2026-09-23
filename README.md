# Sonari — Landing Page

Landing page do aplicativo de streaming de música **Sonari** ("Sua Música, Sua Forma"),
desenvolvida para o Check-Point 05 da disciplina de Engenharia de Software — Front-end Design
(Prof. Lucas Sousa).

## Sobre a aplicação

O Sonari é um app de música voltado para quem busca qualidade de som superior, playlists
personalizadas e descoberta de novos artistas. A página apresenta o produto em uma
experiência de rolagem única, com as seções:

- **Hero** — título de impacto, descrição, CTA "Ouvir Agora" e mockup interativo do player
- **Apresentação/Benefícios** — os quatro diferenciais do app, com ícones Font Awesome
- **Funcionalidades** — seis cards com os principais recursos
- **Depoimentos** — citações de usuários com avatar e avaliação
- **Formulário de contato** — captação de e-mails, com validação em JavaScript
- **Rodapé** — contato, redes sociais e política de privacidade

## Tecnologias usadas

- **HTML5** — estrutura semântica (`header`, `section`, `article`, `figure`, `footer`)
- **CSS3** — componentes, animações (`@keyframes`) e ajustes finos em `assets/css/styles.css`
- **Tailwind CSS** (via CDN, com tema customizado de cores e fontes) — layout responsivo
- **Font Awesome 6** — ícones
- **Google Fonts** — tipografias Outfit (títulos) e Inter (textos)
- **JavaScript (vanilla)** — menu fixo com transparência ao rolar, menu mobile, destaque do
  link ativo, animações de entrada com `IntersectionObserver`, player de demonstração e
  validação do formulário

## Estrutura de arquivos

```
.
├── index.html            # estrutura e conteúdo da página
├── assets/
│   ├── css/styles.css    # estilos complementares ao Tailwind
│   └── js/main.js        # interações e validações
└── README.md
```

## Responsividade

Layout construído mobile-first com os breakpoints do Tailwind (`sm`, `md`, `lg`): grids de
uma coluna no celular passam a 2–4 colunas no desktop, e o menu principal vira um menu
sanduíche abaixo de `lg`.

## Como executar localmente

Basta abrir o `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Deploy (GitHub Pages)

O site é publicado pelo GitHub Pages a partir da branch `main` (pasta raiz):
**Settings → Pages → Source: Deploy from a branch → main / (root)**.

Link publicado: https://beatrizaalbuquerque.github.io/sonarimusic/

## Integrantes do grupo

- Beatriz Albuquerque
