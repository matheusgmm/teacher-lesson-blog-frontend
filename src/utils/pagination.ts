export type PageItem = number | 'ellipsis';

export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 0) {
    return [];
  }

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    items.push('ellipsis');
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < total - 1) {
    items.push('ellipsis');
  }

  items.push(total);
  return items;
}

export function getRangeLabel(page: number, limit: number, total: number): string {
  if (total === 0) {
    return 'Nenhum resultado';
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `${start}–${end} de ${total}`;
}
