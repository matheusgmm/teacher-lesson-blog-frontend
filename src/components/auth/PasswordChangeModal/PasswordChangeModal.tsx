import { useState, type SubmitEvent } from 'react';
import { updateMe } from '@/api/users.api';
import Alert from '@/components/ui/Alert/Alert';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import PasswordField from '@/components/ui/PasswordField/PasswordField';
import { toUserErrorMessage } from '@/utils/user-errors';
import {
  MIN_PASSWORD_LENGTH,
  validateCurrentPassword,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';
import './PasswordChangeModal.scss';

type PasswordFieldName = 'currentPassword' | 'password' | 'confirmPassword';
type PasswordErrors = Partial<Record<PasswordFieldName, string>>;

type PasswordChangeModalProps = {
  onClose: () => void;
};

function PasswordChangeModal({ onClose }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: PasswordFieldName) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): PasswordErrors {
    return {
      currentPassword: validateCurrentPassword(currentPassword),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirm(password, confirmPassword),
    };
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    const hasError = Boolean(
      nextErrors.currentPassword
      || nextErrors.password
      || nextErrors.confirmPassword,
    );
    setErrors(nextErrors);
    setApiError(null);
    setSuccess(false);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMe({
        password,
        currentPassword,
      });
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (error) {
      setApiError(toUserErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title="Alterar senha"
      description="Use a senha atual para definir uma nova. Depois, entre com ela nas próximas sessões."
      onClose={onClose}
    >
      <form className="password-change" onSubmit={handleSubmit} noValidate>
        {success ? <Alert variant="success">Senha atualizada.</Alert> : null}
        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <PasswordField
          id="profile-current-password"
          name="currentPassword"
          label="Senha atual"
          value={currentPassword}
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            clearFieldError('currentPassword');
            setSuccess(false);
          }}
        />

        <PasswordField
          id="profile-new-password"
          name="password"
          label="Nova senha"
          value={password}
          hint={`Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError('password');
            setSuccess(false);
          }}
        />

        <PasswordField
          id="profile-confirm-password"
          name="confirmPassword"
          label="Confirmar nova senha"
          value={confirmPassword}
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            clearFieldError('confirmPassword');
          }}
        />

        <div className="password-change__actions">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Salvando…' : 'Salvar senha'}
          </Button>
          <button
            type="button"
            className="password-change__cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Fechar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default PasswordChangeModal;
