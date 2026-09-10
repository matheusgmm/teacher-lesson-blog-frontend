import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deletePost } from '@/api/posts.api';
import CommentThread from '@/components/comments/CommentThread/CommentThread';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Icon from '@/components/ui/Icon/Icon';
import { useAuth } from '@/hooks/useAuth';
import { usePost } from '@/hooks/usePost';
import type { PostStatus } from '@/types/post';
import { formatLongDate } from '@/utils/format';
import { toPostErrorMessage } from '@/utils/post-errors';
import { resolvePostsBackPath } from '@/utils/post-navigation';
import './PostDetailPage.scss';

type LocationState = {
  from?: string;
  created?: boolean;
  updated?: boolean;
};

const STATUS_LABEL: Record<PostStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicada',
  ARCHIVED: 'Arquivada',
  DELETED: 'Removida',
};

function parsePostId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function PostDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: rawId } = useParams();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;
  const backTo = resolvePostsBackPath(locationState.from);
  const id = parsePostId(rawId);
  const { post, isLoading, error, notFound } = usePost(id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canManage = user?.role === 'ADMIN';
  const canEdit = Boolean(canManage && user && post && user.id === post.user_id);

  async function handleDelete() {
    if (!post || !canManage) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deletePost(post.id);
      navigate('/posts', {
        replace: true,
        state: { deletedTitle: post.title },
      });
    } catch (caught) {
      setDeleteError(toPostErrorMessage(caught));
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (notFound && !isLoading) {
    return (
      <EmptyState
        kicker="Aula"
        title="Esta aula não está disponível"
        description="Ela pode ter sido removida ou o endereço está incompleto. Volte à lista para escolher outra publicação."
        action={<Link to="/posts">Ver postagens</Link>}
      />
    );
  }

  if (error) {
    return (
      <section className="post-detail">
        <Link className="post-detail__back" to={backTo}>
          <Icon name="chevronLeft" />
          Voltar às postagens
        </Link>
        <Alert variant="error">{error}</Alert>
      </section>
    );
  }

  if (isLoading || !post) {
    return (
      <section className="post-detail" aria-busy="true">
        <span className="visually-hidden">Carregando aula</span>
        <div className="post-detail__skeleton post-detail__skeleton--title" />
        <div className="post-detail__skeleton post-detail__skeleton--meta" />
        <div className="post-detail__skeleton post-detail__skeleton--body" />
      </section>
    );
  }

  const publishedAt = formatLongDate(post.created_at);
  const author = post.author?.name ?? 'Autor não informado';

  return (
    <article className="post-detail">
      <Link className="post-detail__back" to={backTo}>
        <Icon name="chevronLeft" />
        Voltar às postagens
      </Link>

      {locationState.created ? (
        <Alert variant="success">Aula publicada. Ela já aparece na lista da comunidade.</Alert>
      ) : null}

      {locationState.updated ? (
        <Alert variant="success">Aula atualizada.</Alert>
      ) : null}

      {deleteError ? <Alert variant="error">{deleteError}</Alert> : null}

      <header className="post-detail__header">
        <p className="post-detail__kicker">Aula</p>
        <div className="post-detail__heading">
          <h2 className="post-detail__title">{post.title}</h2>
          {post.status !== 'PUBLISHED' ? (
            <span className={`post-detail__status post-detail__status--${post.status.toLowerCase()}`}>
              {STATUS_LABEL[post.status]}
            </span>
          ) : null}
        </div>
        <p className="post-detail__meta">
          <span>{author}</span>
          {publishedAt ? (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.created_at}>{publishedAt}</time>
            </>
          ) : null}
        </p>
      </header>

      <div className="post-detail__body">{post.description}</div>

      <CommentThread postId={post.id} />

      {canManage ? (
        <div className="post-detail__manage">
          {canEdit ? (
            <Link
              className="post-detail__edit"
              to={`/posts/${post.id}/edit`}
              state={{ from: `${location.pathname}` }}
            >
              Editar aula
            </Link>
          ) : (
            <p className="post-detail__hint">
              Somente quem publicou pode editar o conteúdo. Você ainda pode remover a aula.
            </p>
          )}

          <section className="post-detail__danger" aria-labelledby="post-delete-title">
            <h3 id="post-delete-title">Remover aula</h3>
            <p>
              A publicação some da lista da comunidade. Esta ação não restaura o texto automaticamente.
            </p>
            {confirmingDelete ? (
              <div className="post-detail__confirm">
                <p>
                  Remover <strong>{post.title}</strong>?
                </p>
                <div className="post-detail__actions">
                  <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
                    {isDeleting ? 'Removendo…' : 'Sim, remover'}
                  </Button>
                  <button
                    type="button"
                    className="post-detail__cancel-delete"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
                Remover aula
              </Button>
            )}
          </section>
        </div>
      ) : null}
    </article>
  );
}

export default PostDetailPage;
