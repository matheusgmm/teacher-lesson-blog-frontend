import { useState, type SubmitEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { updatePost } from '@/api/posts.api';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Icon from '@/components/ui/Icon/Icon';
import TextArea from '@/components/ui/TextArea/TextArea';
import TextField from '@/components/ui/TextField/TextField';
import { useAuth } from '@/hooks/useAuth';
import { usePost } from '@/hooks/usePost';
import { toPostErrorMessage } from '@/utils/post-errors';
import {
  POST_DESCRIPTION_MAX,
  POST_DESCRIPTION_MIN,
  POST_TITLE_MAX,
  validatePostDescription,
  validatePostTitle,
} from '@/utils/validation';
import '@/pages/NewPostPage/NewPostPage.scss';

type EditPostField = 'title' | 'description';
type EditPostErrors = Partial<Record<EditPostField, string>>;

function parsePostId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function EditPostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: rawId } = useParams();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const id = parsePostId(rawId);
  const { post, isLoading, error, notFound } = usePost(id);

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<EditPostErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (post && post.id !== sourceId) {
    setSourceId(post.id);
    setTitle(post.title);
    setDescription(post.description);
    setErrors({});
    setApiError(null);
  }

  const backTo = id ? `/posts/${id}` : '/posts';
  const isAuthor = Boolean(user && post && user.id === post.user_id);

  function clearFieldError(field: EditPostField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): EditPostErrors {
    return {
      title: validatePostTitle(title),
      description: validatePostDescription(description),
    };
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!post) {
      return;
    }

    const nextErrors = validate();
    const hasError = Boolean(nextErrors.title || nextErrors.description);
    setErrors(nextErrors);
    setApiError(null);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePost(post.id, {
        title: title.trim(),
        description: description.trim(),
      });

      navigate(`/posts/${post.id}`, {
        replace: true,
        state: { updated: true, from: from ?? '/posts' },
      });
    } catch (caught) {
      setApiError(toPostErrorMessage(caught));
    } finally {
      setIsSubmitting(false);
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
      <section className="new-post-page">
        <Link className="new-post-page__back" to={backTo}>
          <Icon name="chevronLeft" />
          Voltar à aula
        </Link>
        <Alert variant="error">{error}</Alert>
      </section>
    );
  }

  if (isLoading || !post) {
    return (
      <section className="new-post-page" aria-busy="true">
        <span className="visually-hidden">Carregando aula</span>
        <p className="new-post-page__lead">Carregando aula…</p>
      </section>
    );
  }

  if (!isAuthor) {
    return (
      <EmptyState
        kicker="Aula"
        title="Você não pode editar esta aula"
        description="Somente quem publicou consegue alterar o conteúdo. Você ainda pode removê-la da lista, se precisar."
        action={<Link to={backTo}>Voltar à aula</Link>}
      />
    );
  }

  return (
    <section className="new-post-page">
      <Link className="new-post-page__back" to={backTo}>
        <Icon name="chevronLeft" />
        Voltar à aula
      </Link>

      <header className="new-post-page__header">
        <p className="new-post-page__kicker">Editar</p>
        <h2 className="new-post-page__title">Atualizar aula</h2>
        <p className="new-post-page__lead">
          Ajuste o título ou o conteúdo. A versão nova substitui a anterior na lista da comunidade.
        </p>
      </header>

      <form className="new-post-page__form" onSubmit={handleSubmit} noValidate>
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <TextField
          id="edit-post-title"
          name="title"
          label="Título"
          value={title}
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
          id="edit-post-description"
          name="description"
          label="Conteúdo da aula"
          value={description}
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
            {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
          </Button>
          <Link className="new-post-page__cancel" to={backTo}>
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}

export default EditPostPage;
