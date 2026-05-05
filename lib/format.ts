export function formatPrice(amount: number): string {
  return amount.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
