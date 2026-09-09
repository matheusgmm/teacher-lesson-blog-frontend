import { Link, useLocation } from 'react-router-dom';
import type { Post, PostStatus } from '@/types/post';
import { excerpt, formatDate } from '@/utils/format';
import './PostCard.scss';

type PostCardProps = {
  post: Post;
};

const STATUS_LABEL: Record<PostStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicada',
  ARCHIVED: 'Arquivada',
  DELETED: 'Removida',
};

function PostCard({ post }: PostCardProps) {
  const location = useLocation();
  const author = post.author?.name ?? 'Autor não informado';
  const publishedAt = formatDate(post.created_at);

  return (
    <article className="post-card">
      <Link
        className="post-card__content"
        to={`/posts/${post.id}`}
        state={{ from: `${location.pathname}${location.search}` }}
      >
        <header className="post-card__header">
          <h2 className="post-card__title">{post.title}</h2>
          {post.status !== 'PUBLISHED' ? (
            <span className={`post-card__status post-card__status--${post.status.toLowerCase()}`}>
              {STATUS_LABEL[post.status]}
            </span>
          ) : null}
        </header>

        <p className="post-card__excerpt">{excerpt(post.description)}</p>

        <footer className="post-card__meta">
          <span>{author}</span>
          {publishedAt ? <time dateTime={post.created_at}>{publishedAt}</time> : null}
        </footer>
      </Link>
    </article>
  );
}

export default PostCard;
