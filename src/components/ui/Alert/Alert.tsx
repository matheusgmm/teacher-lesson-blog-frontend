import type { ReactNode } from 'react';
import './Alert.scss';

type AlertProps = {
  children: ReactNode;
  variant?: 'error' | 'success' | 'info';
};

function Alert({ children, variant = 'info' }: AlertProps) {
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`alert alert--${variant}`} role={role}>
      {children}
    </div>
  );
}

export default Alert;
