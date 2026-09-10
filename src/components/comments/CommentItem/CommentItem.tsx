import { useState, type SubmitEvent } from 'react';
import { deleteComment, updateComment } from '@/api/comments.api';
import Alert from '@/components/ui/Alert/Alert';
import Avatar from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import TextArea from '@/components/ui/TextArea/TextArea';
import type { User } from '@/types/auth';
import type { Comment } from '@/types/comment';
import { toCommentErrorMessage } from '@/utils/comment-errors';
import { formatDateTime } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import {
  COMMENT_CONTENT_MAX,
  COMMENT_CONTENT_MIN,
  validateCommentContent,
} from '@/utils/validation';
import './CommentItem.scss';

type CommentItemProps = {
  comment: Comment;
  currentUser: User | null;
  onChanged: () => void;
};

function wasEdited(comment: Comment): boolean {
  const created = new Date(comment.created_at).getTime();
  const updated = new Date(comment.updated_at).getTime();
  return Number.isFinite(created) && Number.isFinite(updated) && updated - created > 2000;
}

function CommentItem({ comment, currentUser, onChanged }: CommentItemProps) {
  const authorName = comment.author?.name ?? 'Pessoa da comunidade';
  const authorRole = comment.author?.role ?? 'USER';
  const isAuthor = Boolean(currentUser && currentUser.id === comment.user_id);
  const canDelete = Boolean(isAuthor || currentUser?.role === 'ADMIN');
  const postedAt = formatDateTime(comment.created_at);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [error, setError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextError = validateCommentContent(draft);
    setError(nextError);
    setApiError(null);

    if (nextError) {
      return;
    }

    setIsSaving(true);

    try {
      await updateComment(comment.post_id, comment.id, { content: draft.trim() });
      setEditing(false);
      onChanged();
    } catch (caught) {
      setApiError(toCommentErrorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setApiError(null);

    try {
      await deleteComment(comment.post_id, comment.id);
      onChanged();
    } catch (caught) {
      setApiError(toCommentErrorMessage(caught));
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="comment-item">
      <Avatar name={authorName} role={authorRole} size="sm" />

      <div className="comment-item__body">
        <header className="comment-item__header">
          <p className="comment-item__author">{authorName}</p>
          <span className={`comment-item__role comment-item__role--${authorRole.toLowerCase()}`}>
            {getRoleLabel(authorRole)}
          </span>
          {postedAt ? (
            <time className="comment-item__time" dateTime={comment.created_at}>
              {postedAt}
            </time>
          ) : null}
          {wasEdited(comment) ? <span className="comment-item__edited">editado</span> : null}
        </header>

        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        {editing ? (
          <form className="comment-item__edit" onSubmit={handleSave} noValidate>
            <TextArea
              id={`comment-edit-${comment.id}`}
              name="content"
              label="Editar comentário"
              value={draft}
              hint={`${draft.trim().length}/${COMMENT_CONTENT_MAX} · mínimo ${COMMENT_CONTENT_MIN} caracteres`}
              maxLength={COMMENT_CONTENT_MAX}
              rows={4}
              compact
              error={error}
              disabled={isSaving}
              required
              onChange={(value) => {
                setDraft(value);
                setError(undefined);
              }}
            />
            <div className="comment-item__actions">
              <Button type="submit" loading={isSaving} disabled={isDeleting}>
                {isSaving ? 'Salvando…' : 'Salvar'}
              </Button>
              <button
                type="button"
                className="comment-item__text-btn"
                onClick={() => {
                  setEditing(false);
                  setDraft(comment.content);
                  setError(undefined);
                  setApiError(null);
                }}
                disabled={isSaving}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <p className="comment-item__content">{comment.content}</p>
        )}

        {!editing && (isAuthor || canDelete) ? (
          <div className="comment-item__actions">
            {isAuthor ? (
              <button
                type="button"
                className="comment-item__text-btn"
                onClick={() => {
                  setEditing(true);
                  setConfirmingDelete(false);
                  setApiError(null);
                }}
                disabled={isDeleting}
              >
                Editar
              </button>
            ) : null}

            {canDelete ? (
              confirmingDelete ? (
                <>
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? 'Removendo…' : 'Sim, remover'}
                  </Button>
                  <button
                    type="button"
                    className="comment-item__text-btn"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="comment-item__text-btn comment-item__text-btn--danger"
                  onClick={() => setConfirmingDelete(true)}
                  disabled={isSaving}
                >
                  Remover
                </button>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default CommentItem;
