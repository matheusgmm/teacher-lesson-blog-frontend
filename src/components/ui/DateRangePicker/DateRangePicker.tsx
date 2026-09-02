import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import {
  formatIsoDateRange,
  getMonthCells,
  parseIsoDate,
  shiftMonth,
  toIsoDate,
} from '@/utils/iso-date';
import './DateRangePicker.scss';

export type DateRange = {
  from: string | null;
  to: string | null;
};

type DateRangePickerProps = {
  id: string;
  label: string;
  from: string | null;
  to: string | null;
  describedBy?: string;
  onChange: (range: DateRange) => void;
};

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const monthTitleFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

const dayLabelFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatMonthTitle(date: Date): string {
  const title = monthTitleFormatter.format(date);
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function orderedRange(start: string, end: string): DateRange {
  return start <= end ? { from: start, to: end } : { from: end, to: start };
}

function DateRangePicker({
  id,
  label,
  from,
  to,
  describedBy,
  onChange,
}: DateRangePickerProps) {
  const dialogLabelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pickingEnd, setPickingEnd] = useState(false);
  const [hoverIso, setHoverIso] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(() => parseIsoDate(from ?? '') ?? new Date());

  const todayIso = toIsoDate(new Date());
  const cells = useMemo(() => getMonthCells(viewDate), [viewDate]);
  const preview = pickingEnd && from && hoverIso ? orderedRange(from, hoverIso) : { from, to };
  const summary = formatIsoDateRange(from, to);
  const hasRange = Boolean(from || to);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
      setPickingEnd(false);
      setHoverIso(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      setOpen(false);
      setPickingEnd(false);
      setHoverIso(null);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function toggleOpen() {
    setViewDate(parseIsoDate(from ?? '') ?? new Date());
    setPickingEnd(false);
    setHoverIso(null);
    setOpen((current) => !current);
  }

  function handleDayClick(iso: string) {
    if (!pickingEnd || !from) {
      onChange({ from: iso, to: iso });
      setPickingEnd(true);
      setHoverIso(iso);
      return;
    }

    onChange(orderedRange(from, iso));
    setPickingEnd(false);
    setHoverIso(null);
    setOpen(false);
  }

  function handleClear() {
    onChange({ from: null, to: null });
    setPickingEnd(false);
    setHoverIso(null);
  }

  return (
    <div ref={rootRef} className="date-range-picker">
      <label className="date-range-picker__label" htmlFor={id}>
        {label}
      </label>

      <div
        className={`date-range-picker__control${open ? ' is-open' : ''}${hasRange ? ' is-filled' : ''}`}
      >
        <button
          type="button"
          id={id}
          className="date-range-picker__trigger"
          aria-describedby={describedBy}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={toggleOpen}
        >
          <span className="date-range-picker__value">{summary}</span>
          {hasRange ? null : (
            <span className="date-range-picker__icon" aria-hidden="true">
              <Icon name="calendar" />
            </span>
          )}
        </button>
        {hasRange ? (
          <button
            type="button"
            className="date-range-picker__icon"
            aria-label="Limpar período"
            onClick={handleClear}
          >
            <Icon name="close" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          className="date-range-picker__popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby={dialogLabelId}
        >
          <div className="date-range-picker__header">
            <button
              type="button"
              className="date-range-picker__nav"
              onClick={() => setViewDate((current) => shiftMonth(current, -1))}
              aria-label="Mês anterior"
            >
              <Icon name="chevronLeft" />
            </button>
            <p id={dialogLabelId} className="date-range-picker__month">
              {formatMonthTitle(viewDate)}
            </p>
            <button
              type="button"
              className="date-range-picker__nav"
              onClick={() => setViewDate((current) => shiftMonth(current, 1))}
              aria-label="Próximo mês"
            >
              <Icon name="chevronRight" />
            </button>
          </div>

          <p className="date-range-picker__hint">
            {pickingEnd
              ? 'Agora escolha a data final do período.'
              : 'Escolha o início e o fim do período.'}
          </p>

          <div className="date-range-picker__weekdays" aria-hidden="true">
            {WEEKDAYS.map((weekday, index) => (
              <span key={`${weekday}-${index}`}>{weekday}</span>
            ))}
          </div>

          <div className="date-range-picker__grid">
            {cells.map((iso, index) => {
              if (!iso) {
                return <span key={`empty-${index}`} className="date-range-picker__empty" />;
              }

              const date = parseIsoDate(iso);
              const selected = iso === preview.from || iso === preview.to;
              const inRange = Boolean(
                preview.from && preview.to && iso >= preview.from && iso <= preview.to,
              );
              const classes = [
                'date-range-picker__day',
                selected ? 'is-selected' : '',
                inRange && !selected ? 'is-in-range' : '',
                iso === todayIso ? 'is-today' : '',
                iso === preview.from ? 'is-start' : '',
                iso === preview.to ? 'is-end' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={iso}
                  type="button"
                  className={classes}
                  aria-pressed={selected}
                  aria-label={date ? dayLabelFormatter.format(date) : iso}
                  onMouseEnter={() => setHoverIso(iso)}
                  onFocus={() => setHoverIso(iso)}
                  onClick={() => handleDayClick(iso)}
                >
                  {Number(iso.slice(-2))}
                </button>
              );
            })}
          </div>

          <div className="date-range-picker__footer">
            <button
              type="button"
              className="date-range-picker__clear"
              onClick={handleClear}
              disabled={!hasRange}
            >
              Limpar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DateRangePicker;
