import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  type = 'button',
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    fullWidth ? 'button--full' : '',
    loading ? 'button--loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      <span className="button__label">{children}</span>
    </button>
  );
}

export default Button;
