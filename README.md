# CAIN RPG — Digital Character Sheet & Campaign Companion

[![Language: PT / EN](https://img.shields.io/badge/Language-PT%20%7C%20EN-blue.svg)](https://github.com/LPfontes/cain-sheets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CAIN RPG](https://img.shields.io/badge/RPG-CAIN_by_Tom_Bloom-red.svg)](https://tombloom.itch.io/cain)

[Português](#português) | [English](#english)

---

<a name="português"></a>
## 🇧🇷 Português

**CAIN Sheets** é uma aplicação web interativa e moderna desenvolvida para o RPG de mesa **CAIN**, criado por **Tom Bloom**. Ela funciona tanto como uma ficha digital interativa para Exorcistas quanto como um painel de gerenciamento de campanha para Mestres de Jogo (gerenciando Pecados e Investigações).

### 🌟 Funcionalidades Principais

- 📜 **Ficha Digital de Exorcistas:**
  - Gerenciamento completo de atributos, perícias, estresse, semente profana e marcadores de pecado.
  - Painel de Talismãs (Pressão, Tensão, Execução) e cálculo automático de estresse.
  - Inventário dinâmico, marcas de pecado, agendas e blasfêmias.
- 👹 **Gerenciador de Pecados e Investigações:**
  - Crie, edite, exporte e importe fichas de Pecados para encontros e campanhas.
  - Estruture investigações e mistérios de forma organizada.
- 🌐 **Suporte Bilingüe Completo (PT / EN):**
  - Alternância instantânea de idioma entre Português do Brasil e Inglês americano.
  - Detecção e popup de escolha de idioma no primeiro acesso.
- 📦 **Gerenciador de Pacotes de Conteúdo (Content Packs):**
  - Integração dinâmica com o repositório remoto [`cain-data`](https://github.com/LPfontes/cain-data) para download de regras oficiais, agendas, blasfêmias, virtudes e equipamentos.
- 🧰 **Toolbox / Guia de Regras Deslizante:**
  - Painel lateral interativo acessível em qualquer tela para rápida consulta de perícias, estresse, habilidades e regras do sistema.
- ☁️ **Sincronização na Nuvem e Backup:**
  - Suporte à sincronização via Firebase com autenticação Google e backup/restauração local via arquivos `.json`.
- 🧙‍♂️ **Assistente de Criação (Wizard):**
  - Guiador passo a passo de 5 etapas para criação rápida e guiada de novos Exorcistas.

### 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/LPfontes/cain-sheets.git
   cd cain-sheets
   ```

2. **Execute um servidor HTTP local:**
   Você pode usar qualquer servidor HTTP simples. Por exemplo, utilizando o `serve`:
   ```bash
   npx serve .
   ```
   Ou com o Python:
   ```bash
   python -m http.server 8000
   ```

3. **Acesse no navegador:**
   Abra `http://localhost:3000` (ou a porta correspondente).

### 📖 Sobre o Sistema CAIN
**CAIN** é um RPG de mesa sobre exorcistas psíquicos caçando monstros e lidando com forças profanas, escrito e ilustrado por **Tom Bloom**.
- Adquira o jogo oficial no itch.io: [https://tombloom.itch.io/cain](https://tombloom.itch.io/cain)

---

<a name="english"></a>
## 🇺🇸 English

**CAIN Sheets** is a modern interactive web application built for the **CAIN** tabletop RPG by **Tom Bloom**. It serves both as a digital character sheet for Exorcists and a campaign management dashboard for Game Masters (managing Sins and Investigations).

### 🌟 Key Features

- 📜 **Digital Exorcist Character Sheet:**
  - Complete management of attributes, skills, stress, profane seed, and sin marks.
  - Talisman Board (Pressure, Tension, Execution) with automatic stress calculation.
  - Dynamic inventory, sin marks, agendas, and blasphemies.
- 👹 **Sin & Investigation Manager:**
  - Create, edit, export, and import Sin sheets for encounters and campaign prep.
  - Structure mystery investigations effortlessly.
- 🌐 **Full Bilingual Support (PT / EN):**
  - Instant language toggling between Brazilian Portuguese and US English.
  - First-time visit language selection modal.
- 📦 **Content Pack Manager:**
  - Dynamic integration with the [`cain-data`](https://github.com/LPfontes/cain-data) remote repository to fetch official rules, agendas, blasphemies, virtues, and equipment.
- 🧰 **Global Slide-out Toolbox / Rules Guide:**
  - Accessible drawer on any screen for quick lookup of skills, stress, abilities, and system rules.
- ☁️ **Cloud Sync & Backup:**
  - Firebase cloud sync integration with Google Sign-In and complete local `.json` backup/restore.
- 🧙‍♂️ **Character Creation Wizard:**
  - 5-step interactive wizard for building new Exorcists step-by-step.

### 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LPfontes/cain-sheets.git
   cd cain-sheets
   ```

2. **Start a local HTTP server:**
   You can use any simple static server, for instance using `serve`:
   ```bash
   npx serve .
   ```
   Or using Python:
   ```bash
   python -m http.server 8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000` (or your server's assigned port).

### 📖 About CAIN RPG
**CAIN** is a tabletop RPG about psychic exorcists hunting monsters and dealing with profane forces, written and illustrated by **Tom Bloom**.
- Purchase the official game on itch.io: [https://tombloom.itch.io/cain](https://tombloom.itch.io/cain)

---

### 📄 License / Licença
This project is open-source under the [MIT License](LICENSE).
