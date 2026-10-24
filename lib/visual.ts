import categoriesJson from "@/data/categories.json"
import type { Category } from "@/lib/types"

/**
 * Identidade visual por categoria. Enquanto as fotos reais não estiverem em
 * /public/images/categories, cada restaurante e prato ganha um "prato" ilustrado
 * com o emoji da categoria sobre a cor dela.
 */
type CategoryLook = { bg: string; fg: string }

const LOOKS: Record<string, CategoryLook> = {
  pizza: { bg: "#f6d7c3", fg: "#8a2f14" },
  hamburguer: { bg: "#f3dcae", fg: "#7a4a00" },
  sushi: { bg: "#d9e6e1", fg: "#1f4d40" },
  padaria: { bg: "#efe0c8", fg: "#6e4b1f" },
  churrasco: { bg: "#ecc9bf", fg: "#7d2412" },
  brasileira: { bg: "#d6e8c9", fg: "#2e5a1c" },
  mineira: { bg: "#e9dcc4", fg: "#5f4320" },
  mexicana: { bg: "#f5d2b8", fg: "#8c3b0e" },
  arabe: { bg: "#ecdcbf", fg: "#6b4a17" },
  oriental: { bg: "#f2cfcb", fg: "#8a2424" },
  cafeteria: { bg: "#e3d3c4", fg: "#4e3221" },
  sorveteria: { bg: "#f4d6e2", fg: "#863a5c" },
  acai: { bg: "#ddd0ea", fg: "#4b2a73" },
  marmita: { bg: "#e7e2cf", fg: "#4f4a26" },
  lanches: { bg: "#f2e2b4", fg: "#6f5200" },
  vegano: { bg: "#d3e9d2", fg: "#225a2a" },
  vegetariano: { bg: "#dcebc8", fg: "#3c5a14" },
  "frutos-do-mar": { bg: "#cfe2ec", fg: "#1b4b66" },
  italiana: { bg: "#e9d4cc", fg: "#7a2e1e" },
}

/** Emojis que funcionam melhor como "comida" do que os do JSON (ex.: bandeira). */
const EMOJI_OVERRIDE: Record<string, string> = { brasileira: "🍛", mineira: "🫕" }

const DEFAULT_LOOK: CategoryLook = { bg: "#ece8e1", fg: "#241c16" }

export const CATEGORIES: Category[] = (categoriesJson as Category[])
  .slice()
  .sort((a, b) => a.ordem - b.ordem)

export function getCategory(slug?: string): Category | undefined {
  if (!slug) return undefined
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryLook(slug?: string) {
  const category = getCategory(slug)
  const look = (slug && LOOKS[slug]) || DEFAULT_LOOK
  return {
    ...look,
    emoji: (slug && EMOJI_OVERRIDE[slug]) || category?.icone || "🍽️",
    label: category?.nome ?? "Restaurante",
  }
}

/** Escolhe um emoji mais específico para o prato quando o nome deixa claro. */
const DISH_HINTS: Array<[RegExp, string]> = [
  [/pizza/i, "🍕"],
  [/burger|hamb/i, "🍔"],
  [/sushi|hot roll|temaki|combinado|sashimi|uramaki/i, "🍣"],
  [/açaí|acai/i, "🍇"],
  [/sorvete|casquinha|picolé|milk ?shake|sundae|copo duplo/i, "🍦"],
  [/café|cappuccino|latte|expresso|espresso/i, "☕"],
  [/croissant/i, "🥐"],
  [/pão|baguete|bolo/i, "🍞"],
  [/camar|siri|moqueca|peixe|lula/i, "🦐"],
  [/taco|burrito|nacho|fajita|quesadilla|guacamole/i, "🌮"],
  [/esfiha|kibe|hommus|charuto|kafta|falafel|shawarma/i, "🥙"],
  [/picanha|costela|fraldinha|linguiça|espeto|maminha/i, "🍖"],
  [/frango/i, "🍗"],
  [/lasanha|fettuccine|penne|nhoque|macarr|espaguete|talharim/i, "🍝"],
  [/salada|bowl/i, "🥗"],
  [/feij|tropeiro|carreteiro|marmita|bife|parmegiana/i, "🍛"],
  [/coxinha|pastel|misto|bauru|sanduíche|sanduiche|x-/i, "🥪"],
  [/omelete|ovo/i, "🍳"],
  [/cheesecake|brownie|pudim|torta/i, "🍰"],
]

export function getDishEmoji(name: string, categorySlug?: string) {
  for (const [re, emoji] of DISH_HINTS) if (re.test(name)) return emoji
  return getCategoryLook(categorySlug).emoji
}

/** Iniciais do nome, usadas no "selo" do restaurante. */
export function initials(name: string) {
  return name
    .replace(/[&]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}
