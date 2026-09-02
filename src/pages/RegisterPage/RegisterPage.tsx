import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout/AuthLayout';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import PasswordField from '@/components/ui/PasswordField/PasswordField';
import TextField from '@/components/ui/TextField/TextField';
import { useAuth } from '@/hooks/useAuth';
import { toAuthErrorMessage } from '@/utils/auth-errors';
import {
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';
import './RegisterPage.scss';

type RegisterField = 'name' | 'email' | 'password' | 'confirmPassword';
type RegisterErrors = Partial<Record<RegisterField, string>>;

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: RegisterField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): RegisterErrors {
    return {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirm(password, confirmPassword),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      await register({
        name: name.trim(),
        email: normalizeEmail(email),
        password,
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (error) {
      setApiError(toAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Criar cadastro"
      subtitle="O registro público cria uma conta de estudante. Docentes administradores são provisionados à parte."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <TextField
          id="register-name"
          name="name"
          label="Nome completo"
          value={name}
          onChange={(value) => {
            setName(value);
            clearFieldError('name');
          }}
          error={errors.name}
          autoComplete="name"
          disabled={isSubmitting}
          required
        />

        <TextField
          id="register-email"
          name="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearFieldError('email');
          }}
          error={errors.email}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={isSubmitting}
          required
        />

        <PasswordField
          id="register-password"
          name="password"
          label="Senha"
          value={password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          error={errors.password}
          hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <PasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirmar senha"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <div className="auth-form__actions">
          <Button type="submit" fullWidth loading={isSubmitting}>
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </Button>
          <p className="auth-form__switch">
            Já tem cadastro? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
