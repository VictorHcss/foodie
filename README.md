# Foodie — Descubra seu próximo prato favorito

O **Foodie** é uma aplicação web de delivery desenvolvida com Next.js, React e Tailwind CSS. O projeto simula a experiência de explorar restaurantes, encontrar pratos, personalizar pedidos e acompanhar compras em uma interface moderna e responsiva.

O objetivo é construir uma experiência de navegação intuitiva, reunindo descoberta de restaurantes, busca de produtos e gerenciamento de pedidos em um único lugar.

## ✨ Funcionalidades

- **Exploração de restaurantes:** navegação por restaurantes, categorias e pratos.
- **Busca e filtros:** pesquisa, filtragem e ordenação de resultados.
- **Páginas de restaurantes:** visualização dos estabelecimentos e seus produtos.
- **Sacola de compras:** gerenciamento dos itens selecionados.
- **Cupons de desconto:** aplicação de regras de desconto e validação de cupons.
- **Conta de usuário:** telas de login, cadastro e perfil.
- **Pedidos:** visualização do histórico e acompanhamento simulado do status dos pedidos.
- **Favoritos e avaliações:** interação com pratos e restaurantes.
- **Persistência local:** os dados das interações são mantidos no navegador.
- **Interface responsiva:** experiência adaptável a diferentes tamanhos de tela.
- **Tema claro e escuro:** suporte aos dois temas visuais.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| Next.js 15 | Estrutura da aplicação e roteamento |
| React 19 | Construção da interface por componentes |
| TypeScript | Tipagem estática, conforme utilizada no código |
| Tailwind CSS 4 | Estilização da interface |
| shadcn/ui | Componentes de interface reutilizáveis |
| Context API | Gerenciamento compartilhado da conta e da sacola |
| Local Storage / armazenamento no navegador | Persistência das interações de demonstração |

## Como executar localmente

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Git, caso queira clonar o repositório.

### 1. Clone o repositório

```bash
git clone https://github.com/VictorHcss/foodie
```

Entre na pasta do projeto:

```bash
cd foodie
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 4. Acesse a aplicação

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🧪 Como testar

É possível explorar a aplicação utilizando a conta de demonstração:

- **E-mail:** `joao@example.com`
- **Senha:** `senha123`

Também é possível utilizar o botão **"Preencher para mim"** na tela de login.

### Cupons de demonstração

| Cupom | Regra |
|---|---|
| `BEMVINDO10` | 10% de desconto em pedidos a partir de R$ 30 |
| `FRETEGRATIS` | Até R$ 8 de desconto na entrega, em pedidos a partir de R$ 50 |
| `PIZZA15` | Cupom expirado em 30/09/2026 |

Os cupons servem para testar as regras de desconto implementadas no projeto.

## 📁 Estrutura do projeto

```text
foodie/
├── app/                    # Páginas, rotas e estilos globais
├── components/             # Componentes da interface
│   └── ui/                 # Componentes base de interface
├── contexts/               # Estado compartilhado da aplicação
├── data/                   # Dados de demonstração
├── lib/
│   ├── visual.ts           # Cores e ícones das categorias
│   ├── pricing.ts          # Preços, adicionais e cupons
│   └── restaurant-search.ts # Busca, filtros e ordenação
├── public/
│   └── images/             # Imagens utilizadas na aplicação
└── README.md
```

A estrutura acima destaca os principais diretórios e módulos. Arquivos adicionais podem existir no repositório.

## Imagens dos restaurantes e pratos

As imagens podem ser organizadas por categoria em:

```text
public/images/categories/<categoria>/
```

Os nomes dos arquivos devem corresponder aos caminhos definidos nos arquivos `data/restaurants.json` e `data/products.json`.

Por exemplo:

```text
public/images/categories/pizza/item-01.jpg
```

Quando uma imagem não estiver disponível, a interface utiliza uma representação ilustrada baseada na categoria do item.

## ⚙️ Como os dados funcionam

O Foodie utiliza dados de demonstração armazenados na pasta `data/`. As interações do usuário, como conta, sacola, pedidos, favoritos e avaliações, são mantidas localmente no navegador.

**Importante:** a versão atual não deve ser considerada um serviço de delivery em produção. Os dados e fluxos simulados não representam necessariamente restaurantes, pedidos ou transações reais. A persistência local também não equivale a uma conta sincronizada entre dispositivos.

## Próximas evoluções

Possíveis melhorias para as próximas versões:

- Integração com uma API de receitas, restaurantes ou produtos.
- Backend e banco de dados para persistência centralizada.
- Autenticação real e gerenciamento seguro de usuários.
- Testes automatizados para funcionalidades críticas.
- Melhorias contínuas de acessibilidade, desempenho e experiência mobile.
- Publicação de uma demonstração online.

Esta lista representa possibilidades futuras, não funcionalidades já implementadas.

##  Sobre o projeto

O Foodie é um projeto de desenvolvimento web criado para praticar e demonstrar habilidades em construção de interfaces, organização de componentes, gerenciamento de estado e implementação de fluxos interativos.

O projeto continua evoluindo com foco em usabilidade, qualidade do código e experiência do usuário.

---

**Victor H.**
