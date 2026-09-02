import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PostCard from '@/components/posts/PostCard/PostCard';
import Alert from '@/components/ui/Alert/Alert';
import DateRangePicker from '@/components/ui/DateRangePicker/DateRangePicker';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Pagination from '@/components/ui/Pagination/Pagination';
import SearchField from '@/components/ui/SearchField/SearchField';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePosts } from '@/hooks/usePosts';
import { readIsoDateParam } from '@/utils/iso-date';
import './PostsPage.scss';

const PAGE_SIZE = 10;
const FILTERS_HINT_ID = 'posts-filters-hint';

function emptyDescription(search: string, hasDates: boolean): string {
  if (search && hasDates) {
    return `Não encontramos aulas para “${search}” neste período. Tente outra palavra-chave ou outro intervalo.`;
  }

  if (search) {
    return `Não encontramos resultados para “${search}”. Tente outra palavra-chave.`;
  }

  if (hasDates) {
    return 'Não encontramos aulas neste período. Experimente outro intervalo no calendário.';
  }

  return 'Quando as aulas forem publicadas, elas aparecem nesta lista para toda a comunidade autenticada.';
}

function PostsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const from = readIsoDateParam(searchParams.get('from'));
  const to = readIsoDateParam(searchParams.get('to'));
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const [draft, setDraft] = useState(search);
  const [draftSearch, setDraftSearch] = useState(search);

  if (search !== draftSearch) {
    setDraftSearch(search);
    setDraft(search);
  }

  const debouncedDraft = useDebouncedValue(draft);
  const { posts, meta, isLoading, error } = usePosts(search, page, PAGE_SIZE, from, to);
  const canPublish = user?.role === 'ADMIN';
  const hasDates = Boolean(from || to);
  const hasQuery = search.length > 0 || hasDates;

  useEffect(() => {
    const nextSearch = debouncedDraft.trim();

    setSearchParams((current) => {
      const currentSearch = current.get('search') ?? '';

      if (nextSearch === currentSearch) {
        return current;
      }

      const params = new URLSearchParams(current);

      if (nextSearch) {
        params.set('search', nextSearch);
      } else {
        params.delete('search');
      }

      params.delete('page');
      return params;
    }, { replace: true });
  }, [debouncedDraft, setSearchParams]);

  function applySearchNow() {
    const nextSearch = draft.trim();

    setSearchParams((current) => {
      const params = new URLSearchParams(current);

      if (nextSearch) {
        params.set('search', nextSearch);
      } else {
        params.delete('search');
      }

      params.delete('page');
      return params;
    }, { replace: true });
  }

  function handleDateChange(range: { from: string | null; to: string | null }) {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);

      if (range.from) {
        params.set('from', range.from);
      } else {
        params.delete('from');
      }

      if (range.to) {
        params.set('to', range.to);
      } else {
        params.delete('to');
      }

      params.delete('page');
      return params;
    });
  }

  function goToPage(nextPage: number) {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);

      if (nextPage <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(nextPage));
      }

      return params;
    });

    document.getElementById('conteudo')?.scrollIntoView({ block: 'start' });
  }

  return (
    <section className="posts-page">
      <div className="posts-page__toolbar">
        <div className="posts-page__filters">
          <SearchField
            id="posts-search"
            label="Buscar por palavra-chave"
            value={draft}
            placeholder="Título ou conteúdo da aula"
            describedBy={FILTERS_HINT_ID}
            onChange={setDraft}
            onSubmit={applySearchNow}
          />

          <DateRangePicker
            id="posts-date-range"
            label="Período"
            from={from}
            to={to}
            describedBy={FILTERS_HINT_ID}
            onChange={handleDateChange}
          />

          {canPublish ? (
            <div className="posts-page__action">
              <span className="posts-page__action-label" aria-hidden="true">
                &nbsp;
              </span>
              <Link className="posts-page__compose" to="/posts/new">
                Nova aula
              </Link>
            </div>
          ) : null}
        </div>

        <p id={FILTERS_HINT_ID} className="posts-page__hint">
          A busca olha título e descrição. O calendário filtra pela data de publicação. A lista atualiza sozinha.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {isLoading ? (
        <div className="posts-page__list" aria-busy="true" aria-live="polite">
          <span className="visually-hidden">Carregando postagens</span>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="post-skeleton" />
          ))}
        </div>
      ) : null}

      {!isLoading && posts.length === 0 ? (
        <EmptyState
          kicker="Lições"
          title={hasQuery ? 'Nenhuma aula encontrada' : 'Ainda não há postagens por aqui'}
          description={emptyDescription(search, hasDates)}
          action={
            canPublish && !hasQuery ? (
              <Link to="/posts/new">Escrever a primeira aula</Link>
            ) : null
          }
        />
      ) : null}

      {!isLoading && posts.length > 0 ? (
        <>
          <div className="posts-page__list" aria-live="polite">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {meta ? (
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              disabled={isLoading}
              onPageChange={goToPage}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default PostsPage;
