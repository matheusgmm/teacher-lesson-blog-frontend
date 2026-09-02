import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout/AuthLayout';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import PasswordField from '@/components/ui/PasswordField/PasswordField';
import TextField from '@/components/ui/TextField/TextField';
import { useAuth } from '@/hooks/useAuth';
import { toAuthErrorMessage } from '@/utils/auth-errors';
import { normalizeEmail, validateEmail, validatePassword } from '@/utils/validation';
import './LoginPage.scss';

type LoginField = 'email' | 'password';
type LoginErrors = Partial<Record<LoginField, string>>;
type LocationState = {
  from?: string;
  registered?: boolean;
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: LoginField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): LoginErrors {
    return {
      email: validateEmail(email),
      password: validatePassword(password),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    const hasError = Boolean(nextErrors.email || nextErrors.password);
    setErrors(nextErrors);
    setApiError(null);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: normalizeEmail(email),
        password,
        rememberMe,
      });
      navigate(locationState.from || '/', { replace: true });
    } catch (error) {
      setApiError(toAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Use o e-mail da comunidade acadêmica para acessar as publicações."
    >
      {locationState.registered ? (
        <Alert variant="success">
          Conta criada. Entre com o e-mail e a senha que você acabou de cadastrar.
        </Alert>
      ) : null}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <TextField
          id="login-email"
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
          id="login-password"
          name="password"
          label="Senha"
          value={password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          error={errors.password}
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <Checkbox
          id="login-remember"
          label="Manter-me conectado neste dispositivo"
          checked={rememberMe}
          onChange={setRememberMe}
          disabled={isSubmitting}
        />

        <div className="auth-form__actions">
          <Button type="submit" fullWidth loading={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
          <p className="auth-form__switch">
            Ainda não tem conta? <Link to="/register">Criar cadastro</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
