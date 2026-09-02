const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const shortFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
});

export function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
  );
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseIsoDate(value: string): Date | null {
  if (!isIsoDate(value)) {
    return null;
  }

  const [, year, month, day] = ISO_DATE.exec(value) ?? [];
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function readIsoDateParam(value: string | null): string | null {
  if (!value || !isIsoDate(value)) {
    return null;
  }

  return value;
}

export function formatIsoDateShort(value: string): string {
  const date = parseIsoDate(value);

  if (!date) {
    return '';
  }

  return shortFormatter.format(date);
}

export function formatIsoDateRange(from: string | null, to: string | null): string {
  if (!from && !to) {
    return 'Qualquer data';
  }

  const start = from ? formatIsoDateShort(from) : '';
  const end = to ? formatIsoDateShort(to) : '';

  if (start && end && from === to) {
    return start;
  }

  if (start && end) {
    return `${start} – ${end}`;
  }

  if (start) {
    return `Desde ${start}`;
  }

  return `Até ${end}`;
}

export function getMonthCells(view: Date): Array<string | null> {
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: firstWeekday }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toIsoDate(new Date(year, month, day)));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function shiftMonth(view: Date, offset: number): Date {
  return new Date(view.getFullYear(), view.getMonth() + offset, 1);
}
