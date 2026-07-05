import { Restaurant, Product, Category, City, Banner, Coupon } from "@/lib/types";
import restaurantsJson from "@/data/restaurants.json";
import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";
import citiesJson from "@/data/cities.json";
import bannersJson from "@/data/banners.json";
import couponsJson from "@/data/coupons.json";

export function getAllRestaurants(): Restaurant[] {
  return restaurantsJson as Restaurant[];
}

export function getAllProducts(): Product[] {
  return productsJson as Product[];
}

export function getAllCategories(): Category[] {
  return categoriesJson as Category[];
}

export function getAllCities(): City[] {
  return citiesJson as City[];
}

export function getAllBanners(): Banner[] {
  return bannersJson as Banner[];
}

export function getAllCoupons(): Coupon[] {
  return couponsJson as Coupon[];
}
