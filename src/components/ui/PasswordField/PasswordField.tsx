import { useState } from 'react';
import TextField from '@/components/ui/TextField/TextField';
import './PasswordField.scss';

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  disabled?: boolean;
  name?: string;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete,
  disabled,
  name,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? 'Ocultar senha' : 'Mostrar senha';

  return (
    <TextField
      id={id}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      hint={hint}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      disabled={disabled}
      spellCheck={false}
      trailing={
        <button
          type="button"
          className="password-field__toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={toggleLabel}
          aria-pressed={visible}
          title={toggleLabel}
          disabled={disabled}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 3l18 18M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6M9.9 5.2A10.4 10.4 0 0112 5c6 0 10 7 10 7a18.4 18.4 0 01-4.2 4.6M6.1 6.1A18.5 18.5 0 002 12s4 7 10 7a10.4 10.4 0 005.1-1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      }
    />
  );
}

export default PasswordField;
