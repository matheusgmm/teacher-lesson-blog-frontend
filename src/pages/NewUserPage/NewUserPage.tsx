import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '@/api/users.api';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import PasswordField from '@/components/ui/PasswordField/PasswordField';
import SelectField from '@/components/ui/SelectField/SelectField';
import TextField from '@/components/ui/TextField/TextField';
import type { UserRole } from '@/types/auth';
import { toUserErrorMessage } from '@/utils/user-errors';
import {
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';
import './NewUserPage.scss';

type NewUserField = 'name' | 'email' | 'password' | 'confirmPassword' | 'role';
type NewUserErrors = Partial<Record<NewUserField, string>>;

function NewUserPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [errors, setErrors] = useState<NewUserErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: NewUserField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): NewUserErrors {
    return {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirm(password, confirmPassword),
    };
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    const hasError = Boolean(
      nextErrors.name
      || nextErrors.email
      || nextErrors.password
      || nextErrors.confirmPassword,
    );
    setErrors(nextErrors);
    setApiError(null);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createUser({
        name: name.trim(),
        email: normalizeEmail(email),
        password,
        role,
      });

      navigate(`/users/${response.data.id}`, {
        replace: true,
        state: { created: true, from: '/users' },
      });
    } catch (error) {
      setApiError(toUserErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="new-user-page">
      <Link className="new-user-page__back" to="/users">
        <Icon name="chevronLeft" />
        Voltar à comunidade
      </Link>

      <header className="new-user-page__header">
        <p className="new-user-page__kicker">Comunidade</p>
        <h2 className="new-user-page__title">Nova pessoa</h2>
        <p className="new-user-page__lead">
          Cadastre um docente ou estudante. A pessoa já consegue entrar no portal com o e-mail
          e a senha definidos aqui.
        </p>
      </header>

      <form className="new-user-page__form" onSubmit={handleSubmit} noValidate>
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <TextField
          id="new-user-name"
          name="name"
          label="Nome completo"
          value={name}
          autoComplete="name"
          disabled={isSubmitting}
          required
          error={errors.name}
          onChange={(value) => {
            setName(value);
            clearFieldError('name');
          }}
        />

        <TextField
          id="new-user-email"
          name="email"
          type="email"
          label="E-mail"
          value={email}
          autoComplete="off"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isSubmitting}
          required
          error={errors.email}
          onChange={(value) => {
            setEmail(value);
            clearFieldError('email');
          }}
        />

        <SelectField
          id="new-user-role"
          name="role"
          label="Perfil"
          value={role}
          hint="Membros leem as aulas. Administradores publicam e gerem a comunidade."
          disabled={isSubmitting}
          onChange={(value) => setRole(value as UserRole)}
        >
          <option value="USER">Membro</option>
          <option value="ADMIN">Administrador</option>
        </SelectField>

        <PasswordField
          id="new-user-password"
          name="password"
          label="Senha"
          value={password}
          hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
        />

        <PasswordField
          id="new-user-confirm"
          name="confirmPassword"
          label="Confirmar senha"
          value={confirmPassword}
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            clearFieldError('confirmPassword');
          }}
        />

        <div className="new-user-page__actions">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Cadastrando…' : 'Cadastrar pessoa'}
          </Button>
          <Link className="new-user-page__cancel" to="/users">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}

export default NewUserPage;
