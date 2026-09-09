import { useState, type SubmitEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteUser, updateUser } from '@/api/users.api';
import Alert from '@/components/ui/Alert/Alert';
import Avatar from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Icon from '@/components/ui/Icon/Icon';
import PasswordField from '@/components/ui/PasswordField/PasswordField';
import SelectField from '@/components/ui/SelectField/SelectField';
import TextField from '@/components/ui/TextField/TextField';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import type { UpdateUserPayload, User, UserRole } from '@/types/auth';
import { formatLongDate } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import { toUserErrorMessage } from '@/utils/user-errors';
import { resolveUsersBackPath } from '@/utils/user-navigation';
import {
  normalizeEmail,
  validateCurrentPassword,
  validateEmail,
  validateName,
  validateOptionalPassword,
  validatePasswordConfirm,
} from '@/utils/validation';
import './UserDetailPage.scss';

type LocationState = {
  from?: string;
  created?: boolean;
};

type EditField = 'name' | 'email' | 'currentPassword' | 'password' | 'confirmPassword';
type EditErrors = Partial<Record<EditField, string>>;

function parseUserId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function UserDetailPage() {
  const navigate = useNavigate();
  const { user: sessionUser, updateSessionUser } = useAuth();
  const { id: rawId } = useParams();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;
  const backTo = resolveUsersBackPath(locationState.from);
  const id = parseUserId(rawId);
  const { user, isLoading, error, notFound } = useUser(id);

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<EditErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(locationState.created ? 'created' : null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (user && user.id !== sourceId) {
    setSourceId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setErrors({});
    setFormError(null);
    setConfirmingDelete(false);
  }

  const isSelf = Boolean(sessionUser && user && sessionUser.id === user.id);

  function clearFieldError(field: EditField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): EditErrors {
    return {
      name: validateName(name),
      email: validateEmail(email),
      currentPassword: isSelf && password
        ? validateCurrentPassword(currentPassword)
        : undefined,
      password: validateOptionalPassword(password),
      confirmPassword: password
        ? validatePasswordConfirm(password, confirmPassword)
        : undefined,
    };
  }

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const nextErrors = validate();
    const hasError = Boolean(
      nextErrors.name
      || nextErrors.email
      || nextErrors.currentPassword
      || nextErrors.password
      || nextErrors.confirmPassword,
    );
    setErrors(nextErrors);
    setFormError(null);

    if (hasError) {
      return;
    }

    const payload: UpdateUserPayload = {
      name: name.trim(),
      email: normalizeEmail(email),
    };

    if (!isSelf) {
      payload.role = role;
    }

    if (password) {
      payload.password = password;

      if (isSelf) {
        payload.currentPassword = currentPassword;
      }
    }

    setIsSaving(true);

    try {
      const response = await updateUser(user.id, payload);
      const nextUser = response.data as User;

      setSourceId(nextUser.id);
      setName(nextUser.name);
      setEmail(nextUser.email);
      setRole(nextUser.role);
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setSuccess('updated');

      if (isSelf) {
        updateSessionUser(nextUser);
      }
    } catch (caught) {
      setFormError(toUserErrorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || isSelf) {
      return;
    }

    setIsDeleting(true);
    setFormError(null);

    try {
      await deleteUser(user.id);
      navigate('/users', {
        replace: true,
        state: { deletedName: user.name },
      });
    } catch (caught) {
      setFormError(toUserErrorMessage(caught));
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (notFound && !isLoading) {
    return (
      <EmptyState
        kicker="Comunidade"
        title="Esta pessoa não está disponível"
        description="O perfil pode ter sido removido ou o endereço está incompleto. Volte à lista para escolher outra pessoa."
        action={<Link to="/users">Ver comunidade</Link>}
      />
    );
  }

  if (error) {
    return (
      <section className="user-detail">
        <Link className="user-detail__back" to={backTo}>
          <Icon name="chevronLeft" />
          Voltar à comunidade
        </Link>
        <Alert variant="error">{error}</Alert>
      </section>
    );
  }

  if (isLoading || !user) {
    return (
      <section className="user-detail" aria-busy="true">
        <span className="visually-hidden">Carregando pessoa</span>
        <div className="user-detail__skeleton user-detail__skeleton--title" />
        <div className="user-detail__skeleton user-detail__skeleton--meta" />
        <div className="user-detail__skeleton user-detail__skeleton--body" />
      </section>
    );
  }

  const joinedAt = formatLongDate(user.created_at);

  return (
    <section className="user-detail">
      <Link className="user-detail__back" to={backTo}>
        <Icon name="chevronLeft" />
        Voltar à comunidade
      </Link>

      {success === 'created' ? (
        <Alert variant="success">Pessoa cadastrada. O perfil já aparece na comunidade.</Alert>
      ) : null}

      {success === 'updated' ? (
        <Alert variant="success">Dados atualizados.</Alert>
      ) : null}

      {formError ? <Alert variant="error">{formError}</Alert> : null}

      <header className="user-detail__header">
        <Avatar name={name} role={role} />
        <div className="user-detail__heading">
          <p className="user-detail__kicker">Pessoa</p>
          <h2 className="user-detail__title">{name}</h2>
          <p className="user-detail__meta">
            <span className={`user-detail__role user-detail__role--${role.toLowerCase()}`}>
              {getRoleLabel(role)}
            </span>
            {joinedAt ? (
              <>
                <span aria-hidden="true">·</span>
                <span>Na comunidade desde {joinedAt}</span>
              </>
            ) : null}
          </p>
        </div>
      </header>

      <form className="user-detail__form" onSubmit={handleSave} noValidate>
        <TextField
          id="user-name"
          name="name"
          label="Nome completo"
          value={name}
          autoComplete="name"
          disabled={isSaving || isDeleting}
          required
          error={errors.name}
          onChange={(value) => {
            setName(value);
            clearFieldError('name');
            setSuccess(null);
          }}
        />

        <TextField
          id="user-email"
          name="email"
          type="email"
          label="E-mail"
          value={email}
          autoComplete="off"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isSaving || isDeleting}
          required
          error={errors.email}
          onChange={(value) => {
            setEmail(value);
            clearFieldError('email');
            setSuccess(null);
          }}
        />

        <SelectField
          id="user-role"
          name="role"
          label="Perfil"
          value={role}
          disabled={isSelf || isSaving || isDeleting}
          hint={isSelf ? 'Você não pode alterar o próprio perfil por aqui.' : undefined}
          onChange={(value) => {
            setRole(value as UserRole);
            setSuccess(null);
          }}
        >
          <option value="USER">Membro</option>
          <option value="ADMIN">Administrador</option>
        </SelectField>

        <PasswordField
          id="user-password"
          name="password"
          label="Nova senha"
          value={password}
          hint="Deixe em branco para manter a senha atual."
          autoComplete="new-password"
          disabled={isSaving || isDeleting}
          error={errors.password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError('password');
            setSuccess(null);
          }}
        />

        {isSelf && password ? (
          <PasswordField
            id="user-current-password"
            name="currentPassword"
            label="Senha atual"
            value={currentPassword}
            autoComplete="current-password"
            disabled={isSaving || isDeleting}
            error={errors.currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              clearFieldError('currentPassword');
              setSuccess(null);
            }}
          />
        ) : null}

        {password ? (
          <PasswordField
            id="user-confirm"
            name="confirmPassword"
            label="Confirmar nova senha"
            value={confirmPassword}
            autoComplete="new-password"
            disabled={isSaving || isDeleting}
            error={errors.confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              clearFieldError('confirmPassword');
            }}
          />
        ) : null}

        <div className="user-detail__actions">
          <Button type="submit" loading={isSaving} disabled={isDeleting}>
            {isSaving ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </div>
      </form>

      <section className="user-detail__danger" aria-labelledby="user-delete-title">
        <h3 id="user-delete-title">Remover da comunidade</h3>
        {isSelf ? (
          <p>
            Você não pode remover a própria conta. Peça a outro administrador se precisar
            encerrar este acesso.
          </p>
        ) : (
          <>
            <p>
              A pessoa deixa de entrar no portal. As aulas que ela publicou continuam visíveis.
            </p>
            {confirmingDelete ? (
              <div className="user-detail__confirm">
                <p>
                  Remover <strong>{name}</strong>? Esta ação não restaura o acesso
                  automaticamente.
                </p>
                <div className="user-detail__actions">
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? 'Removendo…' : 'Sim, remover'}
                  </Button>
                  <button
                    type="button"
                    className="user-detail__cancel-delete"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <Button
                variant="danger"
                disabled={isSaving}
                onClick={() => setConfirmingDelete(true)}
              >
                Remover da comunidade
              </Button>
            )}
          </>
        )}
      </section>
    </section>
  );
}

export default UserDetailPage;
