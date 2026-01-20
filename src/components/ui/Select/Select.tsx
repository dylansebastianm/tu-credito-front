import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { SelectHTMLAttributes, ChangeEvent } from 'react';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { isPositiveNumber } from '../../../utils/validation';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  required?: boolean;
  error?: string | null;
  onValidationChange?: (error: string | null) => void;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  showRequiredIndicator?: boolean;
  validateNotZero?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  clearable?: boolean;
}

/**
 * Select component con validación integrada y dropdown personalizado
 * Muestra search bar si hay más de 10 opciones
 */
export function Select({
  label,
  required = false,
  error: externalError,
  onValidationChange,
  onChange,
  options,
  showRequiredIndicator = true,
  validateNotZero = false,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  clearable = true,
  className,
  id,
  value,
  disabled,
  ...props
}: SelectProps): React.JSX.Element {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalError, setInternalError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  // Si hay un valor válido seleccionado (no vacío y no '0'), limpiar el error interno
  // El error externo puede venir del formulario padre, pero si el valor es válido, no debería mostrarse
  const hasValidValue = value && value !== '' && value !== '0';
  const error = hasValidValue ? null : (externalError || internalError);

  const selectedOption = options.find(opt => opt.value === value) || null;

  // Mostrar search solo si hay más de 10 opciones
  const showSearch = options.length > 10;

  const filteredOptions = showSearch
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const validateValue = useCallback(
    (val: string | number | readonly string[] | undefined): string | null => {
      const stringValue = String(val || '');

      // Validación de requerido
      if (required && (!stringValue || stringValue === '0' || stringValue === '')) {
        return `${label || 'Este campo'} es requerido`;
      }

      // Validar que no sea 0 si validateNotZero está activado
      if (validateNotZero && (!isPositiveNumber(stringValue) || stringValue === '0')) {
        return `Debe seleccionar un ${label || 'valor'}`;
      }

      return null;
    },
    [required, validateNotZero, label]
  );

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);

    // Validar al cerrar
    const currentValue = value !== undefined ? value : '';
    const validationError = validateValue(currentValue);
    setInternalError(validationError);
    onValidationChange?.(validationError);
  };

  const handleSelect = (option: SelectOption) => {
    // Crear un evento sintético compatible con ChangeEvent<HTMLSelectElement>
    const syntheticEvent = {
      target: {
        value: option.value,
        name: props.name || '',
      },
      currentTarget: {
        value: option.value,
        name: props.name || '',
      },
    } as ChangeEvent<HTMLSelectElement>;

    // Validar el nuevo valor - si es válido, limpiar el error
    const validationError = validateValue(option.value);
    setInternalError(validationError);
    // Notificar al padre que el error se limpió si el valor es válido
    onValidationChange?.(validationError);

    // Llamar al onChange del padre con el evento sintético
    onChange?.(syntheticEvent);
    handleClose();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const syntheticEvent = {
      target: {
        value: '',
        name: props.name || '',
      },
      currentTarget: {
        value: '',
        name: props.name || '',
      },
    } as ChangeEvent<HTMLSelectElement>;

    onChange?.(syntheticEvent);

    if (required) {
      const validationError = validateValue('');
      setInternalError(validationError);
      onValidationChange?.(validationError);
    } else {
      setInternalError(null);
      onValidationChange?.(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          handleOpen();
        }
        break;
      case 'Escape':
        handleClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          setHighlightedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Tab':
        handleClose();
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsListRef.current) {
      const highlightedElement = optionsListRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`${styles.wrapper} ${className || ''}`} ref={wrapperRef}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && showRequiredIndicator && (
            <span className={styles.required}>*</span>
          )}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <div
          id={selectId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-listbox`}
          tabIndex={disabled ? -1 : 0}
          className={`
            ${styles.trigger} 
            ${isOpen ? styles.open : ''} 
            ${error && !isOpen ? styles.error : ''} 
            ${disabled ? styles.disabled : ''}
          `}
          onClick={() => (isOpen ? handleClose() : handleOpen())}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            // No validar si el dropdown está abierto o si el foco se mueve al dropdown
            if (isOpen) return;
            
            // Verificar si el foco se mueve a un elemento dentro del dropdown
            const relatedTarget = e.relatedTarget as Node | null;
            if (relatedTarget && wrapperRef.current?.contains(relatedTarget)) {
              return;
            }
            
            // Validar al perder el foco solo si el dropdown está cerrado
            const currentValue = value !== undefined ? value : '';
            const validationError = validateValue(currentValue);
            setInternalError(validationError);
            onValidationChange?.(validationError);
          }}
        >
          <span
            className={`${styles.triggerText} ${
              !selectedOption ? styles.placeholder : ''
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {clearable && selectedOption && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Limpiar selección"
            >
              <FiX size={16} />
            </button>
          )}

          <FiChevronDown
            size={18}
            className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`}
          />
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            {showSearch && (
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <FaSearch size={16} className={styles.searchIcon} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div
              ref={optionsListRef}
              className={styles.optionsList}
              role="listbox"
              id={`${selectId}-listbox`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    className={`
                      ${styles.option} 
                      ${option.value === value ? styles.selected : ''}
                      ${index === highlightedIndex ? styles.highlighted : ''}
                    `}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.value === value && (
                      <FiCheck size={16} className={styles.checkIcon} />
                    )}
                    {option.label}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        )}

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    </div>
  );
}
