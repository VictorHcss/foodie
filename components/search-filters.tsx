"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  RESTAURANT_CATEGORIES,
  CATEGORY_LABELS,
  type SearchFilters,
  type RestaurantCategory,
  type PriceRange,
} from "@/lib/types";

const PRICE_RANGES: PriceRange[] = ["$", "$$", "$$$"];
const CITIES = ["Governador Valadares", "Belo Horizonte", "São Paulo", "Rio de Janeiro"];

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<RestaurantCategory[]>([...RESTAURANT_CATEGORIES]);
  const [cities, setCities] = useState<string[]>([...CITIES]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([...PRICE_RANGES]);
  const [minRating, setMinRating] = useState(0);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const toggleCategory = (category: RestaurantCategory) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleCity = (city: string) => {
    setCities((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  const togglePriceRange = (range: PriceRange) => {
    setPriceRanges((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setCategories([...RESTAURANT_CATEGORIES]);
    setCities([...CITIES]);
    setPriceRanges([...PRICE_RANGES]);
    setMinRating(0);
    setIsOpenNow(false);
    setIsFeatured(false);
    onFiltersChange({});
  };

  const applyFilters = () => {
    onFiltersChange({
      search: searchText,
      categories: categories.length === RESTAURANT_CATEGORIES.length ? undefined : categories,
      cities: cities.length === CITIES.length ? undefined : cities,
      priceRanges: priceRanges.length === PRICE_RANGES.length ? undefined : priceRanges,
      minRating: minRating > 0 ? minRating : undefined,
      isOpenNow: isOpenNow || undefined,
      isFeatured: isFeatured || undefined,
    });
  };

  const hasActiveFilters =
    searchText.length > 0 ||
    categories.length !== RESTAURANT_CATEGORIES.length ||
    cities.length !== CITIES.length ||
    priceRanges.length !== PRICE_RANGES.length ||
    minRating > 0 ||
    isOpenNow ||
    isFeatured;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Busque por restaurante, comida..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyFilters();
            }
          }}
          className="pl-10 h-12 text-base pr-24"
        />
        <Button
          onClick={applyFilters}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9"
        >
          Buscar
        </Button>
      </div>

      {/* Filter Button */}
      <div className="flex flex-wrap gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Categorias</Label>
                <div className="grid grid-cols-2 gap-2">
                  {RESTAURANT_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={category}
                        checked={categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {CATEGORY_LABELS[category]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Cidades</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CITIES.map((city) => (
                    <div key={city} className="flex items-center gap-2">
                      <Checkbox
                        id={city}
                        checked={cities.includes(city)}
                        onCheckedChange={() => toggleCity(city)}
                      />
                      <Label htmlFor={city} className="text-sm">
                        {city}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Preço</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRICE_RANGES.map((range) => (
                    <div key={range} className="flex items-center gap-2">
                      <Checkbox
                        id={range}
                        checked={priceRanges.includes(range)}
                        onCheckedChange={() => togglePriceRange(range)}
                      />
                      <Label htmlFor={range} className="text-sm">
                        {range}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium">Avaliação mínima</Label>
                <div className="mt-2">
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span className="font-medium">{minRating} estrelas</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              {/* Open Now & Featured */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="open-now"
                    checked={isOpenNow}
                    onCheckedChange={(checked) => setIsOpenNow(checked === true)}
                  />
                  <Label htmlFor="open-now" className="text-sm">
                    Abertos agora
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked === true)}
                  />
                  <Label htmlFor="featured" className="text-sm">
                    Em destaque
                  </Label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                )}
                <Button size="sm" onClick={applyFilters} className="flex-1">
                  Aplicar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
