import Icon from '@/components/ui/Icon/Icon';
import { getPageItems, getRangeLabel } from '@/utils/pagination';
import './Pagination.scss';

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

function Pagination({
  page,
  totalPages,
  total,
  limit,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  if (total === 0 && totalPages <= 1) {
    return null;
  }

  const current = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const items = getPageItems(current, totalPages);
  const atStart = current <= 1;
  const atEnd = current >= totalPages;

  return (
    <nav className="pagination" aria-label="Paginação">
      <p className="pagination__summary">{getRangeLabel(current, limit, total)}</p>

      {totalPages > 1 ? (
        <div className="pagination__controls">
          <button
            type="button"
            className="pagination__nav"
            onClick={() => onPageChange(current - 1)}
            disabled={disabled || atStart}
            aria-label="Página anterior"
          >
            <Icon name="chevronLeft" />
            <span>Anterior</span>
          </button>

          <ul className="pagination__pages">
            {items.map((item, index) => (
              <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
                {item === 'ellipsis' ? (
                  <span className="pagination__ellipsis" aria-hidden="true">
                    …
                  </span>
                ) : item === current ? (
                  <span className="pagination__page is-current" aria-current="page">
                    {item}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="pagination__page"
                    onClick={() => onPageChange(item)}
                    disabled={disabled}
                    aria-label={`Ir para a página ${item}`}
                  >
                    {item}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="pagination__nav"
            onClick={() => onPageChange(current + 1)}
            disabled={disabled || atEnd}
            aria-label="Próxima página"
          >
            <span>Próxima</span>
            <Icon name="chevronRight" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}

export default Pagination;
