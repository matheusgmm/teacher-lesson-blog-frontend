import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Alert from '@/components/ui/Alert/Alert';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Pagination from '@/components/ui/Pagination/Pagination';
import SearchField from '@/components/ui/SearchField/SearchField';
import UserCard from '@/components/users/UserCard/UserCard';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUsers } from '@/hooks/useUsers';
import './UsersPage.scss';

const PAGE_SIZE = 10;
const FILTERS_HINT_ID = 'users-filters-hint';

function UsersPage() {
  const location = useLocation();
  const deletedName = (location.state as { deletedName?: string } | null)?.deletedName;
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const [draft, setDraft] = useState(search);
  const [draftSearch, setDraftSearch] = useState(search);

  if (search !== draftSearch) {
    setDraftSearch(search);
    setDraft(search);
  }

  const debouncedDraft = useDebouncedValue(draft);
  const { users, meta, isLoading, error } = useUsers(search, page, PAGE_SIZE);
  const hasQuery = search.length > 0;

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
    <section className="users-page">
      <div className="users-page__toolbar">
        <div className="users-page__filters">
          <SearchField
            id="users-search"
            label="Buscar na comunidade"
            value={draft}
            placeholder="Nome ou e-mail"
            describedBy={FILTERS_HINT_ID}
            onChange={setDraft}
            onSubmit={applySearchNow}
          />

          <div className="users-page__action">
            <span className="users-page__action-label" aria-hidden="true">
              &nbsp;
            </span>
            <Link className="users-page__compose" to="/users/new">
              Nova pessoa
            </Link>
          </div>
        </div>

        <p id={FILTERS_HINT_ID} className="users-page__hint">
          A busca olha nome e e-mail. A lista atualiza sozinha.
        </p>
      </div>

      {deletedName ? (
        <Alert variant="success">{deletedName} foi removida da comunidade.</Alert>
      ) : null}

      {error ? <Alert variant="error">{error}</Alert> : null}

      {isLoading ? (
        <div className="users-page__list" aria-busy="true" aria-live="polite">
          <span className="visually-hidden">Carregando comunidade</span>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="user-skeleton" />
          ))}
        </div>
      ) : null}

      {!isLoading && users.length === 0 ? (
        <EmptyState
          kicker="Comunidade"
          title={hasQuery ? 'Nenhuma pessoa encontrada' : 'Ainda não há pessoas cadastradas'}
          description={
            hasQuery
              ? `Não encontramos resultados para “${search}”. Tente outro nome ou e-mail.`
              : 'Quando alguém for cadastrado, o perfil aparece aqui para a gestão da comunidade.'
          }
          action={!hasQuery ? <Link to="/users/new">Cadastrar a primeira pessoa</Link> : null}
        />
      ) : null}

      {!isLoading && users.length > 0 ? (
        <>
          <div className="users-page__list" aria-live="polite">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
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

export default UsersPage;
