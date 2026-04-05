export function formatRubAmount(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function reviewsLabel(count: number): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return `${count} отзывов`;
  if (n1 > 1 && n1 < 5) return `${count} отзыва`;
  if (n1 === 1) return `${count} отзыв`;
  return `${count} отзывов`;
}
