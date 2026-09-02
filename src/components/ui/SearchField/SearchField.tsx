import type { SubmitEvent } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import TextField from '@/components/ui/TextField/TextField';
import './SearchField.scss';

type SearchFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  describedBy?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit?: () => void;
};

function SearchField({
  id,
  label,
  value,
  placeholder,
  hint,
  describedBy,
  disabled,
  onChange,
  onSubmit,
}: SearchFieldProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.();
  }

  return (
    <form className="search-field" role="search" onSubmit={handleSubmit}>
      <TextField
        id={id}
        name="search"
        type="search"
        label={label}
        value={value}
        placeholder={placeholder}
        hint={hint}
        disabled={disabled}
        {...(describedBy ? { 'aria-describedby': describedBy } : {})}
        onChange={onChange}
        autoComplete="off"
        spellCheck={false}
        trailing={
          value ? (
            <button
              type="button"
              className="search-field__action"
              onClick={() => onChange('')}
              aria-label="Limpar busca"
              disabled={disabled}
            >
              <Icon name="close" />
            </button>
          ) : (
            <span className="search-field__action" aria-hidden="true">
              <Icon name="search" />
            </span>
          )
        }
      />
    </form>
  );
}

export default SearchField;
