import { Link, useLocation, useParams } from 'react-router-dom';
import Alert from '@/components/ui/Alert/Alert';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Icon from '@/components/ui/Icon/Icon';
import { usePost } from '@/hooks/usePost';
import type { PostStatus } from '@/types/post';
import { formatLongDate } from '@/utils/format';
import { resolvePostsBackPath } from '@/utils/post-navigation';
import './PostDetailPage.scss';

type LocationState = {
  from?: string;
  created?: boolean;
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
  const { id: rawId } = useParams();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;
  const backTo = resolvePostsBackPath(locationState.from);
  const id = parsePostId(rawId);
  const { post, isLoading, error, notFound } = usePost(id);

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
    </article>
  );
}

export default PostDetailPage;
