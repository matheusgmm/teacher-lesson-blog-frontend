import type { InputHTMLAttributes, ReactNode } from 'react';
import './TextField.scss';

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'>;

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  trailing,
  type = 'text',
  ...rest
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>

      <div
        className={`text-field__control${error ? ' text-field__control--error' : ''}`}
      >
        <input
          id={id}
          className="text-field__input"
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...rest}
        />
        {trailing}
      </div>

      {hint && !error ? (
        <p id={hintId} className="text-field__hint">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default TextField;
