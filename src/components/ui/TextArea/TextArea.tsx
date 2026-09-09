import type { TextareaHTMLAttributes } from 'react';
import '@/components/ui/TextField/TextField.scss';

type TextAreaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value' | 'onChange'>;

function TextArea({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  rows = 10,
  ...rest
}: TextAreaProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>

      <div
        className={`text-field__control text-field__control--multiline${error ? ' text-field__control--error' : ''}`}
      >
        <textarea
          id={id}
          className="text-field__textarea"
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...rest}
        />
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

export default TextArea;
