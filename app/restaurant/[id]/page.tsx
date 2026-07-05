"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Star,
  Clock,
  ShoppingCart,
} from "lucide-react";
import type { Restaurant, Product } from "@/lib/types";
import { getRestaurantById } from "@/services/restaurants.service";
import { getProductsByRestaurant } from "@/services/products.service";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { formatCurrency } from "@/utils/format";
import { CATEGORY_LABELS } from "@/lib/types";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const resolvedParams = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = getRestaurantById(resolvedParams.id);
        if (!data) {
          throw new Error("Restaurante não encontrado");
        }
        setRestaurant(data);
        const restaurantProducts = getProductsByRestaurant(resolvedParams.id);
        setProducts(restaurantProducts);
      } catch (err) {
        setError("Restaurante não encontrado");
        console.error("Error loading restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [resolvedParams.id]);

  const handleAddToCart = (product: Product) => {
    if (!restaurant) return;

    addItem({
      id: product.id,
      menuItem: {
        ...product,
        name: product.nome,
        description: product.descricao,
        isAvailable: product.disponivel,
        image: product.imagem,
        isFeatured: product.destaque,
      },
      restaurantId: restaurant.id,
    } as any, restaurant.id);
    
    toast({
      title: "Item adicionado!",
      description: `${product.nome} foi adicionado ao seu carrinho.`,
      action: (
        <ToastAction altText="Ver carrinho" onClick={openCart}>
          Ver carrinho
        </ToastAction>
      ),
    });
  };

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando restaurante...</span>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">{error}</p>
          <Button onClick={handleBack} variant="default">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  const categoryLabel = restaurant.categoriaSlug 
    ? (CATEGORY_LABELS[restaurant.categoriaSlug] || restaurant.categoriaSlug) 
    : "Restaurante";

  // Group menu items by category
  const menuByCategory = products.reduce(
    (acc, item) => {
      const category = item.categoria || item.category || "Outros";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <Button onClick={handleBack} variant="outline" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Restaurant Hero */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-lg overflow-hidden h-64 bg-gray-100">
              {restaurant.capa ? (
                <img
                  src={restaurant.capa}
                  alt={restaurant.nome}
                  className="w-full h-full object-cover"
                />
              ) : restaurant.coverImage ? (
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-4xl">🍽️</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="font-serif font-bold text-3xl text-foreground">
                    {restaurant.nome}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{categoryLabel}</Badge>
                    {restaurant.aberto ? (
                      <Badge variant="default">Aberto agora</Badge>
                    ) : (
                      <Badge variant="destructive">Fechado</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">
                      {restaurant.nota.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({restaurant.avaliacoes} avaliações)
                    </span>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {restaurant.faixaDePreco}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{restaurant.descricao}</p>
            </div>
          </div>

          {/* Restaurant Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-semibold text-xl text-card-foreground">
                  Informações
                </h3>

                <div className="space-y-3">
                  {restaurant.endereco && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.endereco}
                        </p>
                      </div>
                    </div>
                  )}

                  {restaurant.telefone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <a
                          href={`tel:${restaurant.telefone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {restaurant.telefone}
                        </a>
                      </div>
                    </div>
                  )}

                  {restaurant.horario && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Horário de Funcionamento</p>
                        <div className="text-sm text-muted-foreground">
                          <p>Abertura: {restaurant.horario.abertura}</p>
                          <p>Fechamento: {restaurant.horario.fechamento}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-8">
          <div>
            <h2 className="font-serif font-bold text-2xl text-foreground mb-2">
              Menu
            </h2>
            <p className="text-muted-foreground">
              Escolha seus pratos favoritos e adicione ao carrinho
            </p>
          </div>

          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-serif font-semibold text-xl text-foreground">
                {category}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="w-1/3 bg-gray-100">
                          {item.imagem ? (
                            <img
                              src={item.imagem}
                              alt={item.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : item.image ? (
                            <img
                              src={item.image}
                              alt={item.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400 text-2xl">🍽️</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground">
                              {item.nome}
                            </h4>
                            <p className="text-primary font-bold">
                              {formatCurrency(item.precoPromocional || item.preco || item.price || 0)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.descricao}
                          </p>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.disponivel}
                            size="sm"
                            className="mt-3 w-full"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.disponivel ? "Adicionar" : "Indisponível"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
