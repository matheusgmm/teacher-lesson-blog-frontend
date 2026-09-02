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
  const author = post.author?.name ?? 'Autor não informado';
  const publishedAt = formatDate(post.created_at);

  return (
    <article className="post-card">
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
    </article>
  );
}

export default PostCard;
