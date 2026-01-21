import React from 'react';
import type { InputHTMLAttributes, ChangeEvent } from 'react';
import {
  getEmailError,
  getPhoneError,
  isRequired,
  isPositiveNumber,
  isInRange,
} from '../../../utils/validation';
import styles from './Input.module.css';

export type ValidationType = 'email' | 'phone' | 'required' | 'positiveNumber' | 'range' | 'custom';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  required?: boolean;
  validationType?: ValidationType;
  customValidation?: (value: string) => string | null;
  error?: string | null;
  onValidationChange?: (error: string | null) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  // Para validación de rango
  minValue?: number;
  maxValue?: number;
  // Para mostrar el asterisco de requerido
  showRequiredIndicator?: boolean;
}

/**
 * Input component con validación integrada
 * Maneja validaciones de email, teléfono, requerido, números positivos y rangos
 */
export function Input({
  label,
  required = false,
  validationType,
  customValidation,
  error: externalError,
  onValidationChange,
  onChange,
  minValue,
  maxValue,
  showRequiredIndicator = true,
  className,
  id,
  value,
  ...props
}: InputProps): React.JSX.Element {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const [internalError, setInternalError] = React.useState<string | null>(null);

  // El error puede venir de fuera (validación del formulario) o ser interno
  const error = externalError || internalError;

  const validateValue = (val: string): string | null => {
    // Si hay una validación personalizada, usarla primero
    if (customValidation) {
      const customError = customValidation(val);
      if (customError) return customError;
    }

    // Validación de requerido - debe ejecutarse primero
    if (required && !isRequired(val)) {
      return `${label || 'Este campo'} es requerido`;
    }

    // Si el campo está vacío y no es requerido, no validar más
    if (!val || !val.trim()) {
      return null;
    }

    // Para campos numéricos, validar que sea un número válido
    if (props.type === 'number') {
      const numValue = parseFloat(val);
      if (isNaN(numValue)) {
        return `${label || 'Este campo'} debe ser un número válido`;
      }
      if (props.min !== undefined && numValue < parseFloat(String(props.min))) {
        return `${label || 'Este campo'} debe ser mayor o igual a ${props.min}`;
      }
      if (props.max !== undefined && numValue > parseFloat(String(props.max))) {
        return `${label || 'Este campo'} debe ser menor o igual a ${props.max}`;
      }
      // Si es requerido y el valor es 0 o negativo (y min no lo permite), validar
      if (required && numValue <= 0 && (props.min === undefined || parseFloat(String(props.min)) > 0)) {
        return `${label || 'Este campo'} debe ser mayor a 0`;
      }
    }

    // Validaciones específicas por tipo
    switch (validationType) {
      case 'email':
        return getEmailError(val);
      case 'phone':
        return getPhoneError(val);
      case 'positiveNumber':
        if (!isPositiveNumber(val)) {
          return `${label || 'Este campo'} debe ser un número mayor a 0`;
        }
        break;
      case 'range':
        if (minValue !== undefined && maxValue !== undefined) {
          if (!isInRange(val, minValue, maxValue)) {
            return `${label || 'Este campo'} debe estar entre ${minValue} y ${maxValue}`;
          }
        }
        break;
      case 'required':
        if (!isRequired(val)) {
          return `${label || 'Este campo'} es requerido`;
        }
        break;
    }

    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Si es un campo de teléfono, solo permitir números y el símbolo "+"
    if (props.type === 'tel' || validationType === 'phone') {
      // Remover todos los caracteres excepto números y "+"
      newValue = newValue.replace(/[^0-9+]/g, '');
      // Crear un nuevo evento con el valor filtrado
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: newValue },
      } as ChangeEvent<HTMLInputElement>;
      
      // Actualizar el valor del input
      if (e.target.value !== newValue) {
        e.target.value = newValue;
      }
      
      // Llamar al onChange con el evento modificado
      onChange?.(syntheticEvent);
      
      // Validar en tiempo real si hay un error previo o si el campo es requerido y está vacío
      if (error || (required && !newValue.trim())) {
        const validationError = validateValue(newValue);
        setInternalError(validationError);
        onValidationChange?.(validationError);
      }
      return;
    }

    // Si es un campo numérico, solo permitir números, punto decimal y signo negativo
    if (props.type === 'number') {
      // Permitir números, punto decimal, signo negativo al inicio, y 'e'/'E' para notación científica
      // Pero bloquear letras comunes que no sean parte de números válidos
      newValue = newValue.replace(/[^0-9.\-eE]/g, '');
      
      // Crear un nuevo evento con el valor filtrado
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: newValue },
      } as ChangeEvent<HTMLInputElement>;
      
      // Actualizar el valor del input
      if (e.target.value !== newValue) {
        e.target.value = newValue;
      }
      
      // Llamar al onChange con el evento modificado
      onChange?.(syntheticEvent);
      
      // Validar en tiempo real si hay un error previo o si el campo es requerido y está vacío
      if (error || (required && !newValue.trim())) {
        const validationError = validateValue(newValue);
        setInternalError(validationError);
        onValidationChange?.(validationError);
      }
      return;
    }

    // Para otros tipos de input, comportamiento normal
    // Validar en tiempo real si hay un error previo o si el campo es requerido y está vacío
    if (error || (required && !newValue.trim())) {
      const validationError = validateValue(newValue);
      setInternalError(validationError);
      onValidationChange?.(validationError);
    }

    // Llamar al onChange del padre
    onChange?.(e);
  };

  const handleBlur = () => {
    // Validar al perder el foco - siempre validar si es requerido
    const currentValue = value !== undefined ? String(value) : '';
    const validationError = validateValue(currentValue);
    setInternalError(validationError);
    onValidationChange?.(validationError);
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && showRequiredIndicator && (
            <span className={styles.required}>*</span>
          )}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          onKeyDown={(e) => {
            // Para campos de teléfono, prevenir teclas que no sean números, "+", o teclas de control
            if ((props.type === 'tel' || validationType === 'phone') && e.key !== '+' && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End' && !e.ctrlKey && !e.metaKey) {
              // Permitir solo números
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }
            // Para campos numéricos, prevenir letras (excepto 'e', 'E', '.', '-' que son válidos en números)
            if (props.type === 'number' && !e.ctrlKey && !e.metaKey) {
              const validKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
              if (!validKeys.includes(e.key) && !/[0-9.eE\-]/.test(e.key)) {
                e.preventDefault();
              }
            }
            // Llamar al onKeyDown del padre si existe
            props.onKeyDown?.(e);
          }}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    </div>
  );
}
