import { useState, type SubmitEvent } from 'react';
import { createComment } from '@/api/comments.api';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import TextArea from '@/components/ui/TextArea/TextArea';
import { toCommentErrorMessage } from '@/utils/comment-errors';
import {
  COMMENT_CONTENT_MAX,
  COMMENT_CONTENT_MIN,
  validateCommentContent,
} from '@/utils/validation';
import './CommentForm.scss';

type CommentFormProps = {
  postId: number;
  onCreated: () => void;
};

function CommentForm({ postId, onCreated }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextError = validateCommentContent(content);
    setError(nextError);
    setApiError(null);

    if (nextError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createComment(postId, { content: content.trim() });
      setContent('');
      onCreated();
    } catch (caught) {
      setApiError(toCommentErrorMessage(caught));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <TextArea
        id={`comment-new-${postId}`}
        name="content"
        label="Escrever um comentário"
        value={content}
        placeholder="Compartilhe uma dúvida, um ajuste de aula ou um retorno da turma."
        hint={`${content.trim().length}/${COMMENT_CONTENT_MAX} · mínimo ${COMMENT_CONTENT_MIN} caracteres`}
        maxLength={COMMENT_CONTENT_MAX}
        rows={4}
        compact
        error={error}
        disabled={isSubmitting}
        required
        onChange={(value) => {
          setContent(value);
          setError(undefined);
        }}
      />

      <div className="comment-form__actions">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Publicando…' : 'Publicar comentário'}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
