# Áurea Lítera — Aplicativo de Livraria

O **Áurea Lítera** é um aplicativo mobile desenvolvido com React Native e Expo, que simula uma livraria moderna com suporte à venda de livros digitais (eBooks) e físicos. O usuário pode navegar pelo catálogo, comprar livros, acompanhar pedidos, ler eBooks diretamente no app e gerenciar o próprio perfil.


## Status do Projeto

O projeto está em desenvolvimento ativo. A aplicação já conta com fluxo completo de autenticação, catálogo de livros integrado a uma API Node.js, carrinho de compras, checkout, leitor de PDF e painel administrativo.


## Telas desenvolvidas

### Login
Tela de acesso ao aplicativo.
- Validação de e-mail e senha (regex)
- Botão de acesso com estado ativo/inativo
- Integração com API para autenticação
- Links para Cadastro e Recuperação de senha

### Cadastro
Criação de novos usuários.
- Campos: nome, e-mail, senha e confirmação de senha
- Validação completa dos campos
- Requisitos de senha segura (maiúscula, número, caractere especial, mínimo 6 caracteres)
- Feedback visual de erros
- Integração com API

### Esqueci a Senha
Início do fluxo de recuperação de acesso.
- Validação de e-mail
- Envio de solicitação à API
- Navega para a tela de redefinição de senha

### Nova Senha
Redefinição de senha após recuperação.
- Campos de nova senha e confirmação
- Validação de senha segura e igualdade dos campos
- Integração com API para atualização

### Home
Tela principal do aplicativo.
- Carrossel de destaque
- Vitrine de livros em destaque e mais vendidos (dados da API + livros fixos)
- Barra de busca
- Navegação para Categoria, Perfil, Carrinho e Biblioteca
- Indicador de itens no carrinho

### Categoria
Listagem de livros por categoria.
- Categorias: Terror, Autoajuda, Ficção, Romance, Fantasia, Suspense, Biografia, Infantil, Outros
- Ícones próprios por categoria
- Busca por título dentro da categoria
- Livros carregados da API + livros fixos mesclados
- Navegação para detalhes do livro

### Detalhes do Livro
Exibição completa das informações de um livro.
- Capa, título, autor, categoria, formato, páginas, avaliação e descrição
- Suporte a livros do banco (campos em inglês) e livros fixos (campos em português)
- Botão "Adicionar ao Carrinho" com verificação de duplicidade
- Botão "Ler agora" para eBooks

### Carrinho
Gerenciamento dos itens selecionados.
- Lista de livros com imagem, título, preço e quantidade
- Controles de adicionar/remover unidades
- Remoção de item com confirmação
- Exibição do total
- Navegação para Checkout
- Usa `CartContext` global

### Checkout
Resumo do pedido antes do pagamento.
- Lista dos itens do carrinho separados por tipo (eBook / Físico)
- Cálculo de frete (R$ 12,90) aplicado apenas a livros físicos
- Total consolidado
- Integração com API para registro do pedido
- Limpeza do carrinho após confirmação
- Navegação para Pagamento

### Pagamento
Seleção do método de pagamento.
- Opções: Pix, Cartão de crédito (até 12x sem juros) e Boleto bancário
- Exibição do valor total
- Limpeza do carrinho ao confirmar

### Biblioteca (Meus Livros)
Acervo de eBooks adquiridos pelo usuário.
- Lista de livros com ciclo de status: Não iniciado → Lendo → Concluído
- Botão "Ler" para abrir o leitor de PDF
- Indicadores visuais de progresso por cor

### Leitor de PDF
Leitura de eBooks dentro do aplicativo.
- Abertura de PDF via `expo-file-system` e `expo-sharing`
- Suporte a assets locais (`pdfAsset`)
- Fallback com mensagem caso o PDF não esteja disponível

### Meus Pedidos
Histórico de pedidos do usuário.
- Lista de pedidos com status, data, total e livros
- Código de rastreio para pedidos físicos
- Dados de mock (integração futura)

### Perfil
Gerenciamento da conta do usuário.
- Exibição e edição de nome, e-mail e foto
- Upload de foto via `expo-image-picker`
- Integração com API para salvar alterações
- Acesso ao painel Admin (para usuários administradores)
- Logout

### Admin — Gerenciar Livros
Painel exclusivo para administradores.
- Cadastro de novos livros: título, autor, preço, páginas, categoria, formato (eBook/Físico), descrição, avaliação e imagem
- Upload de capa via galeria (`expo-image-picker`)
- Listagem e exclusão de livros cadastrados
- Integração completa com API


## Arquitetura

```
AureaLitera-PI/
├── App.js                  # Navegação e providers globais
├── app.config.js           # Configuração do Expo (inclui apiUrl via extra)
├── assets/                 # Imagens, fontes e PDFs
│   ├── fonts/              # Poppins-Bold, Poppins-SemiBold
│   └── books/              # PDFs de eBooks (ex: DomCasmurro.pdf)
└── src/
    ├── context/
    │   └── CartContext.js  # Estado global do carrinho
    └── screens/            # Todas as telas do app
```


## Tecnologias utilizadas

- **React Native** — framework mobile
- **Expo** (~54) — toolchain e módulos nativos
- **React Navigation** — navegação em pilha (Stack Navigator)
- **Node.js + API REST** — backend externo (endereço configurável via `.env`)
- **SQLite** — banco de dados no backend
- **expo-font** — fontes customizadas (Poppins)
- **expo-image-picker** — upload de imagens
- **expo-file-system + expo-sharing** — leitura e compartilhamento de PDFs
- **expo-linear-gradient** — gradientes visuais
- **@expo/vector-icons** — ícones (Ionicons)
- **CartContext** — gerenciamento de estado global do carrinho


## Como executar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/cintiacarvv/AureaLitera-PI.git
cd AureaLitera-PI
```

### 2. Configure e inicie o backend
```bash
cd backend
npm install
node server.js
```
O servidor iniciará na porta **3000**. Você verá a mensagem `Conectado ao banco de dados SQLite (Backend).` no terminal.

### 3. Configure o endereço da API
No arquivo `.env` na raiz do projeto, coloque o IP local da máquina onde o backend está rodando:
```
API_URL=http://<seu-ip-local>:3000
```
> Para descobrir seu IP local, use `ipconfig` (Windows) ou `ifconfig` / `ip a` (Linux/Mac).

### 4. Instale as dependências do app e inicie
Em outro terminal, a partir da raiz do projeto:
```bash
npm install
npx expo start
```

### 5. Abra no celular
Abra o **Expo Go** no celular e escaneie o QR code exibido no terminal.

> **Atenção:** o celular e o computador precisam estar na **mesma rede Wi-Fi** para que o app consiga se comunicar com o backend.


## Autores

- Cintia
- Laiane
- Melvin
- Vinicius