# ⚡ Mini Pokédex – Caçador de Requisições

> Um aplicativo React Native robusto, focado em performance, resiliência de rede e uma experiência de usuário imersiva inspirada no anime.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-v0.76-blue)
![Expo](https://img.shields.io/badge/Expo-v52-black)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.3-blue)

---

## 📖 Sobre o Projeto

Este projeto é uma Pokédex moderna construída com **Expo** e **TypeScript**. O objetivo principal foi ir além do básico, implementando **padrões avançados de engenharia de software** para mobile, como cache offline, controle de concorrência, cancelamento de requisições e estratégias de retry.

Além da parte técnica, o projeto conta com um **Design System customizado** ("Anime Theme"), utilizando gradientes e elementos visuais que remetem à identidade visual clássica da franquia Pokémon.

---

## 📱 Screenshots

| Tela Inicial (Lista) | Busca & Filtro | Detalhes (Gradiente) | Modo Offline |
|:---:|:---:|:---:|:---:|
| *(Insira aqui um print da Home)* | *(Insira aqui um print da Busca/Filtro)* | *(Insira aqui um print dos Detalhes)* | *(Insira aqui um print do Banner Offline)* |

---

## 🚀 Funcionalidades & Pilares Técnicos

### 1. Robustez de Rede (`src/api/apiClient.ts`)
* **Custom Fetch Wrapper:** Um cliente HTTP próprio que gerencia timeouts e erros.
* **Retry com Backoff Exponencial:** Em caso de falha (5xx ou rede), o app tenta reconectar progressivamente (ex: 1s, 2s, 4s...) com *Jitter* para evitar sobrecarga.
* **Cancelamento de Requisição:** Uso de `AbortController` para cancelar requisições obsoletas (ex: ao digitar rápido na busca).

### 2. Performance & Concorrência (`src/hooks`)
* **Scroll Infinito:** Paginação eficiente na lista principal.
* **Worker Pool (Filtro por Tipo):** Ao filtrar por um tipo (ex: "Fire"), o app não faz 100 requisições simultâneas. Implementamos um "Worker Pool" que limita a 5 requisições paralelas, garantindo que a UI não trave e respeitando o *Rate Limit* da API.
* **Debounce na Busca:** Evita chamadas desnecessárias à API enquanto o usuário digita.

### 3. Cache & Offline First (`src/store/cache.ts`)
* **Estratégia Cache-then-Network:** O app exibe dados cacheados instantaneamente enquanto atualiza em segundo plano.
* **Persistência:** Uso do `AsyncStorage` com controle de **TTL (Time-To-Live)** de 30 minutos.
* **Proteção de Armazenamento:** Tratamento de erros para `SQLITE_FULL` (Disk Full), evitando crashes se o dispositivo estiver sem espaço.
* **Detecção Offline:** Banner visual automático quando a conexão cai (`NetInfo`).

### 4. UI/UX Imersiva
* **Tema Anime:** Paleta de cores baseada no logo oficial (Amarelo/Azul).
* **Glassmorphism:** Botões translúcidos e interfaces modernas.
* **Gradientes Dinâmicos:** A tela de detalhes adapta o gradiente baseada na cor do elemento.
* **Navegação Interna:** Botões "Anterior" e "Próximo" dentro do detalhe para navegação fluida.

---

## 🛠️ Tecnologias Utilizadas

* **Core:** React Native, Expo, TypeScript.
* **Navegação:** React Navigation (Native Stack).
* **Estilos:** StyleSheet, `expo-linear-gradient`.
* **Dados & Rede:** Fetch API, `@react-native-async-storage/async-storage`, `@react-native-community/netinfo`.

---

## ⚙️ Instalação e Execução

Pré-requisitos: Node.js instalado.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/MiniPokedex.git](https://github.com/seu-usuario/MiniPokedex.git)
    cd MiniPokedex
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o projeto:**
    ```bash
    npx expo start
    ```

4.  **No Celular:**
    * Baixe o app **Expo Go** (Android/iOS).
    * Escaneie o QR Code exibido no terminal.

---

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura modular limpa dentro de `src/`:

```plaintext
src/
├── api/
│   ├── apiClient.ts       # Cliente HTTP robusto (Retry/Timeout/Cache)
│   ├── pokemonApi.ts      # Endpoints da PokéAPI
│   └── apiTypes.ts        # Tipagem TypeScript das respostas
│
├── components/            # Componentes visuais reutilizáveis
│   ├── index.tsx          # Barrel file (PokemonCard, SearchBar, Skeleton...)
│   └── ...
│
├── constants/
│   └── theme.ts           # Design System (Cores, Estilos Comuns)
│
├── hooks/                 # Lógica de Negócio (Custom Hooks)
│   ├── index.ts           # Barrel file (usePokemonList, useNetworkStatus...)
│   └── ...
│
├── navigation/
│   └── AppNavigator.tsx   # Configuração de Rotas
│
├── screens/
│   ├── HomeScreen.tsx     # Tela Principal (Busca, Lista, Filtro)
│   └── DetailScreen.tsx   # Tela de Detalhes (Stats, Gradiente)
│
└── store/
    └── cache.ts           # Gerenciamento do AsyncStorage