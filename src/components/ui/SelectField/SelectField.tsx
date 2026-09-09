import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import Icon from '@/components/ui/Icon/Icon';
import '@/components/ui/TextField/TextField.scss';
import './SelectField.scss';

type OptionItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'value' | 'onChange'>;

function readOptions(children: ReactNode): OptionItem[] {
  const items: OptionItem[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>(child)) {
      return;
    }

    if (child.type !== 'option') {
      return;
    }

    const label = typeof child.props.children === 'string'
      ? child.props.children
      : String(child.props.children ?? '');

    items.push({
      value: String(child.props.value ?? ''),
      label,
      disabled: child.props.disabled,
    });
  });

  return items;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  children,
  disabled,
  name,
}: SelectFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const options = useMemo(() => readOptions(children), [children]);
  const selectedIndex = Math.max(0, options.findIndex((item) => item.value === value));
  const selected = options[selectedIndex];
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const activeOption = options[activeIndex];

  function openMenu() {
    setActiveIndex(selectedIndex);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function moveActive(delta: number) {
    if (options.length === 0) {
      return;
    }

    let next = activeIndex;

    for (let step = 0; step < options.length; step += 1) {
      next = (next + delta + options.length) % options.length;

      if (!options[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  }

  function selectAt(index: number) {
    const option = options[index];

    if (!option || option.disabled) {
      return;
    }

    onChange(option.value);
    closeMenu();
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!open) {
        openMenu();
        return;
      }

      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Home' && open) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End' && open) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!open) {
        openMenu();
        return;
      }

      selectAt(activeIndex);
    }
  }

  const rootClass = [
    'text-field',
    'text-field--select',
    open ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const controlClass = [
    'text-field__control',
    error ? 'text-field__control--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={rootClass}>
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>

      {name ? <input type="hidden" name={name} value={value} /> : null}

      <div className={controlClass}>
        <button
          ref={triggerRef}
          type="button"
          id={id}
          className="text-field__select"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-activedescendant={open && activeOption ? `${id}-option-${activeOption.value}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onClick={() => {
            if (disabled) {
              return;
            }

            if (open) {
              closeMenu();
              return;
            }

            openMenu();
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="text-field__select-value">{selected?.label ?? ''}</span>
          <Icon name="chevronRight" className="text-field__select-chevron" />
        </button>

        {open ? (
          <ul id={listId} className="text-field__menu" role="listbox" aria-labelledby={id}>
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li
                  key={option.value}
                  id={`${id}-option-${option.value}`}
                  className={[
                    'text-field__option',
                    isSelected ? 'is-selected' : '',
                    isActive ? 'is-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || disabled}
                  onMouseEnter={() => {
                    if (!option.disabled && !disabled) {
                      setActiveIndex(index);
                    }
                  }}
                  onClick={() => selectAt(index)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        ) : null}
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

export default SelectField;
