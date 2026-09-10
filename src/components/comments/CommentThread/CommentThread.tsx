import { useState } from 'react';
import CommentForm from '@/components/comments/CommentForm/CommentForm';
import CommentItem from '@/components/comments/CommentItem/CommentItem';
import Alert from '@/components/ui/Alert/Alert';
import Pagination from '@/components/ui/Pagination/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import './CommentThread.scss';

const PAGE_SIZE = 10;

type CommentThreadProps = {
  postId: number;
};

function CommentThread({ postId }: CommentThreadProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { comments, meta, isLoading, error, reload } = useComments(postId, page, PAGE_SIZE);

  function handleCreated() {
    if (page !== 1) {
      setPage(1);
      return;
    }

    reload();
  }

  function handleChanged() {
    if (comments.length === 1 && page > 1) {
      setPage((current) => current - 1);
      return;
    }

    reload();
  }

  const total = meta?.total ?? 0;

  return (
    <section className="comment-thread" aria-labelledby="comments-title">
      <header className="comment-thread__header">
        <h3 id="comments-title" className="comment-thread__title">
          Comentários
        </h3>
        <p className="comment-thread__lead">
          A conversa fica nesta aula. Qualquer pessoa da comunidade pode participar.
          {total > 0 ? ` ${total} ${total === 1 ? 'comentário' : 'comentários'}.` : ''}
        </p>
      </header>

      <CommentForm postId={postId} onCreated={handleCreated} />

      {error ? <Alert variant="error">{error}</Alert> : null}

      {isLoading ? (
        <div className="comment-thread__list" aria-busy="true">
          <span className="visually-hidden">Carregando comentários</span>
          <div className="comment-thread__skeleton" />
          <div className="comment-thread__skeleton" />
        </div>
      ) : null}

      {!isLoading && comments.length === 0 ? (
        <p className="comment-thread__empty">
          Ainda não há comentários nesta aula. Seja a primeira pessoa a escrever.
        </p>
      ) : null}

      {!isLoading && comments.length > 0 ? (
        <>
          <div className="comment-thread__list">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={user}
                onChanged={handleChanged}
              />
            ))}
          </div>

          {meta ? (
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              disabled={isLoading}
              label="Paginação dos comentários"
              onPageChange={(nextPage) => {
                setPage(nextPage);
                document.getElementById('comments-title')?.scrollIntoView({ block: 'start' });
              }}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default CommentThread;
