export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDeliveryTime(min: number, max: number): string {
  return `${min}-${max} min`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function isWithinBusinessHours(abertura: string, fechamento: string, now = new Date()): boolean {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [horaAtual, minutoAtual] = formatter.format(now).split(":").map(Number);
  const [horaAbertura, minutoAbertura] = abertura.split(":").map(Number);
  const [horaFechamento, minutoFechamento] = fechamento.split(":").map(Number);

  const minutosAtual = horaAtual * 60 + minutoAtual;
  const minutosAbertura = horaAbertura * 60 + minutoAbertura;
  const minutosFechamento = horaFechamento * 60 + minutoFechamento;

  if (minutosFechamento < minutosAbertura) {
    return minutosAtual >= minutosAbertura || minutosAtual <= minutosFechamento;
  }

  return minutosAtual >= minutosAbertura && minutosAtual <= minutosFechamento;
}

export function getFinalPrice(preco: number, precoPromocional: number | null): number {
  return precoPromocional !== null && precoPromocional < preco ? precoPromocional : preco;
}
