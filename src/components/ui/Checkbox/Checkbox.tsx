import type { ReactNode } from 'react';
import './Checkbox.scss';

type CheckboxProps = {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

function Checkbox({ id, label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        className="checkbox__input"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      <span className="checkbox__box" aria-hidden="true" />
      <span className="checkbox__label">{label}</span>
    </label>
  );
}

export default Checkbox;
