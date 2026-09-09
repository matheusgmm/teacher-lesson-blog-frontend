import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPost } from '@/api/posts.api';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import TextArea from '@/components/ui/TextArea/TextArea';
import TextField from '@/components/ui/TextField/TextField';
import { toPostErrorMessage } from '@/utils/post-errors';
import {
  POST_DESCRIPTION_MAX,
  POST_DESCRIPTION_MIN,
  POST_TITLE_MAX,
  validatePostDescription,
  validatePostTitle,
} from '@/utils/validation';
import './NewPostPage.scss';

type NewPostField = 'title' | 'description';
type NewPostErrors = Partial<Record<NewPostField, string>>;

function NewPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<NewPostErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: NewPostField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): NewPostErrors {
    return {
      title: validatePostTitle(title),
      description: validatePostDescription(description),
    };
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    const hasError = Boolean(nextErrors.title || nextErrors.description);
    setErrors(nextErrors);
    setApiError(null);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createPost({
        title: title.trim(),
        description: description.trim(),
      });

      navigate(`/posts/${response.data.id}`, {
        replace: true,
        state: { created: true, from: '/posts' },
      });
    } catch (error) {
      setApiError(toPostErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="new-post-page">
      <Link className="new-post-page__back" to="/posts">
        <Icon name="chevronLeft" />
        Voltar às postagens
      </Link>

      <header className="new-post-page__header">
        <p className="new-post-page__kicker">Publicar</p>
        <h2 className="new-post-page__title">Nova aula</h2>
        <p className="new-post-page__lead">
          Escreva um título claro e o conteúdo completo da lição. A publicação fica visível
          na lista para administradores e estudantes.
        </p>
      </header>

      <form className="new-post-page__form" onSubmit={handleSubmit} noValidate>
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <TextField
          id="new-post-title"
          name="title"
          label="Título"
          value={title}
          placeholder="Ex.: Rotina de leitura no início da aula"
          hint={`${title.trim().length}/${POST_TITLE_MAX}`}
          maxLength={POST_TITLE_MAX}
          error={errors.title}
          disabled={isSubmitting}
          autoComplete="off"
          required
          onChange={(value) => {
            setTitle(value);
            clearFieldError('title');
          }}
        />

        <TextArea
          id="new-post-description"
          name="description"
          label="Conteúdo da aula"
          value={description}
          placeholder="Descreva o objetivo, os passos e o que a turma deve observar."
          hint={`${description.trim().length}/${POST_DESCRIPTION_MAX} · mínimo ${POST_DESCRIPTION_MIN} caracteres`}
          maxLength={POST_DESCRIPTION_MAX}
          error={errors.description}
          disabled={isSubmitting}
          required
          onChange={(value) => {
            setDescription(value);
            clearFieldError('description');
          }}
        />

        <div className="new-post-page__actions">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Publicando…' : 'Publicar aula'}
          </Button>
          <Link className="new-post-page__cancel" to="/posts">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}

export default NewPostPage;
