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
import type { Restaurant, MenuItem } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { getRestaurantById } from "@/data/restaurants";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const resolvedParams = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
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
      } catch (err) {
        setError("Restaurante não encontrado");
        console.error("Error loading restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [resolvedParams.id]);

  const handleAddToCart = (menuItem: MenuItem) => {
    if (!restaurant) return;

    addItem(menuItem, restaurant.id);
    toast({
      title: "Item adicionado!",
      description: `${menuItem.name} foi adicionado ao seu carrinho.`,
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

  const categoryLabel = restaurant.category
    ? (CATEGORY_LABELS as any)[restaurant.category] || restaurant.category
    : "Restaurante";

  // Group menu items by category
  const menuByCategory = restaurant.menu.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
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
              {restaurant.coverImage ? (
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
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
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{categoryLabel}</Badge>
                    {restaurant.isOpenNow ? (
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
                      {restaurant.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({restaurant.reviewCount} avaliações)
                    </span>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {restaurant.priceRange}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{restaurant.description}</p>
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
                  {restaurant.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {restaurant.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <a
                          href={`tel:${restaurant.phone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {restaurant.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {restaurant.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a
                          href={
                            restaurant.website.startsWith("http")
                              ? restaurant.website
                              : `https://${restaurant.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {restaurant.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {restaurant.openingHours.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Horário de Funcionamento</p>
                        <ul className="text-sm text-muted-foreground">
                          {restaurant.openingHours.map((hours, index) => (
                            <li key={index}>{hours}</li>
                          ))}
                        </ul>
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
            <h2 className="font-serif font-bold text-2xl text-foreground mb-2">Menu</h2>
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
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
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
                            <h4 className="font-semibold text-foreground">{item.name}</h4>
                            <p className="text-primary font-bold">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable}
                            size="sm"
                            className="mt-3 w-full"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.isAvailable ? "Adicionar" : "Indisponível"}
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
