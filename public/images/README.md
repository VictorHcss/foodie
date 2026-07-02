# Pasta de Imagens

Use esta pasta para armazenar todas as imagens do projeto.

## Como adicionar imagens

1. Coloque as imagens nesta pasta
2. Atualize os dados em `data/restaurants.ts` com os caminhos das imagens

Exemplo:

```typescript
// Para restaurantes
coverImage: "/images/restaurante-napoli.jpg",
galleryImages: [
  "/images/restaurante-napoli-1.jpg",
  "/images/restaurante-napoli-2.jpg"
],

// Para itens do menu
image: "/images/pizza-calabresa.jpg"
```

## Estrutura recomendada

- `/images/restaurants/` - Imagens de capa e galerias dos restaurantes
- `/images/menu/` - Imagens dos itens do menu
- `/images/users/` - Imagens de perfil dos usuários
