/**
 * Cliente Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { setDocumentMeta } from '../../utils/meta';
import { clientesService } from '../../services/clientes.service';
import type { Cliente, ClienteCreate, ClienteListItem } from '../../types/cliente';
import { ROUTES } from '../../app/config/constants';
import { getErrorMessage } from '../../utils/error';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { Alert } from '../../components/ui/Alert/Alert';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { getEmailError, getPhoneError, isRequired } from '../../utils/validation';
import styles from './Clientes.module.css';

/**
 * ClienteCreatePage component
 * Página de creación/edición de cliente
 */
export function ClienteCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const existingCliente = location.state?.cliente as Cliente | ClienteListItem | undefined;
  const isEdit = existingCliente !== undefined;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState<ClienteCreate>({
    nombre_completo: '',
    email: '',
    telefono: '',
    direccion: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    tipo_persona: 'NATURAL',
    banco: undefined,
  });

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    const loadCliente = async () => {
      if (isEdit && existingCliente && 'id' in existingCliente) {
        try {
          // Si es ClienteListItem, necesitamos cargar el detalle completo
          const fullCliente =
            'banco_info' in existingCliente || 'direccion' in existingCliente
              ? (existingCliente as Cliente)
              : await clientesService.getById(existingCliente.id);

          setFormData({
            nombre_completo: fullCliente.nombre_completo,
            email: fullCliente.email,
            telefono: fullCliente.telefono || '',
            direccion: fullCliente.direccion || '',
            nacionalidad: fullCliente.nacionalidad || '',
            fecha_nacimiento: fullCliente.fecha_nacimiento,
            tipo_persona: fullCliente.tipo_persona,
            banco: fullCliente.banco,
          });
        } catch (err) {
          console.error('Error loading cliente for edit:', err);
          setError('Error al cargar los datos del cliente');
        }
      }
    };

    loadCliente();
  }, [isEdit, existingCliente]);

  useEffect(() => {
    setDocumentMeta({
      title: isEdit ? 'Editar Cliente' : 'Nuevo Cliente',
      description: isEdit ? 'Modificar datos del cliente' : 'Crear nuevo cliente',
    });
  }, [isEdit]);

  const handleSave = async () => {
    // Validaciones de campos requeridos - errores individuales
    const newFieldErrors: Record<string, string> = {};

    if (!isRequired(formData.nombre_completo)) {
      newFieldErrors.nombre_completo = 'El nombre completo es requerido';
    }

    if (!isRequired(formData.fecha_nacimiento)) {
      newFieldErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    // Validar email
    const emailError = getEmailError(formData.email);
    if (emailError) {
      newFieldErrors.email = emailError;
    }

    // Validar teléfono (requerido)
    const phoneError = getPhoneError(formData.telefono || '');
    if (phoneError) {
      newFieldErrors.telefono = phoneError;
    }

    // Validar nacionalidad (requerido)
    if (!isRequired(formData.nacionalidad)) {
      newFieldErrors.nacionalidad = 'La nacionalidad es requerida';
    }

    // Validar dirección (requerido)
    if (!isRequired(formData.direccion)) {
      newFieldErrors.direccion = 'La dirección es requerida';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    setError(null);

    try {
      // Limpiar el objeto formData: eliminar campos undefined/null innecesarios
      const cleanFormData: ClienteCreate = {
        nombre_completo: formData.nombre_completo.trim(),
        email: formData.email.trim(),
        fecha_nacimiento: formData.fecha_nacimiento,
        tipo_persona: formData.tipo_persona,
      };

      // Agregar campos requeridos
      cleanFormData.telefono = (formData.telefono || '').trim();
      cleanFormData.direccion = (formData.direccion || '').trim();
      cleanFormData.nacionalidad = (formData.nacionalidad || '').trim();
      
      // Agregar campo opcional
      if (formData.banco) {
        cleanFormData.banco = formData.banco;
      }

      if (isEdit && existingCliente && 'id' in existingCliente) {
        await clientesService.update(existingCliente.id, cleanFormData);
        setAlertMessage('Cliente actualizado exitosamente');
      } else {
        await clientesService.create(cleanFormData);
        setAlertMessage('Cliente creado exitosamente');
      }
      setShowAlert(true);
      setTimeout(() => {
        navigate(ROUTES.CLIENTES);
      }, 500);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al guardar el cliente. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error saving cliente:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Alert
        type="success"
        title={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <div className={styles.container}>
        <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formHeaderLeft}>
            <BackButton onClick={() => navigate(ROUTES.CLIENTES)} />
            <div>
              <h1 className={styles.formTitle}>
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEdit ? 'Modifica los datos del cliente' : 'Completa los datos del nuevo cliente'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.alert}>
            <p className={styles.alertText}>{error}</p>
          </div>
        )}

        <div className={styles.formBody}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Información Personal</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <Input
                  label="Nombre Completo"
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre_completo: e.target.value });
                    if (fieldErrors.nombre_completo) {
                      setFieldErrors({ ...fieldErrors, nombre_completo: '' });
                    }
                  }}
                  placeholder="Nombre completo del cliente"
                  required
                  validationType="required"
                  error={fieldErrors.nombre_completo || null}
                  onValidationChange={(error) => {
                    if (error) {
                      setFieldErrors({ ...fieldErrors, nombre_completo: error });
                    } else {
                      const { nombre_completo, ...rest } = fieldErrors;
                      setFieldErrors(rest);
                    }
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Fecha de Nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => {
                    setFormData({ ...formData, fecha_nacimiento: e.target.value });
                    if (fieldErrors.fecha_nacimiento) {
                      setFieldErrors({ ...fieldErrors, fecha_nacimiento: '' });
                    }
                  }}
                  required
                  validationType="required"
                  error={fieldErrors.fecha_nacimiento || null}
                  onValidationChange={(error) => {
                    if (error) {
                      setFieldErrors({ ...fieldErrors, fecha_nacimiento: error });
                    } else {
                      const { fecha_nacimiento, ...rest } = fieldErrors;
                      setFieldErrors(rest);
                    }
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Select
                  label="Tipo de Persona"
                  value={formData.tipo_persona}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_persona: e.target.value as 'NATURAL' | 'JURIDICO',
                    })
                  }
                  options={[
                    { value: 'NATURAL', label: 'Persona Natural' },
                    { value: 'JURIDICO', label: 'Persona Jurídica' },
                  ]}
                  showRequiredIndicator={false}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Nacionalidad"
                  type="text"
                  value={formData.nacionalidad || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, nacionalidad: e.target.value });
                    if (fieldErrors.nacionalidad) {
                      setFieldErrors({ ...fieldErrors, nacionalidad: '' });
                    }
                  }}
                  placeholder="Ej: Mexicana"
                  required
                  validationType="required"
                  error={fieldErrors.nacionalidad || null}
                  onValidationChange={(error) => {
                    if (error) {
                      setFieldErrors({ ...fieldErrors, nacionalidad: error });
                    } else {
                      const { nacionalidad, ...rest } = fieldErrors;
                      setFieldErrors(rest);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Contacto</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: '' });
                    }
                  }}
                  placeholder="correo@ejemplo.com"
                  required
                  validationType="email"
                  error={fieldErrors.email || null}
                  onValidationChange={(error) => {
                    if (error) {
                      setFieldErrors({ ...fieldErrors, email: error });
                    } else {
                      const { email, ...rest } = fieldErrors;
                      setFieldErrors(rest);
                    }
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Teléfono"
                  type="tel"
                  value={formData.telefono || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, telefono: e.target.value });
                    if (fieldErrors.telefono) {
                      setFieldErrors({ ...fieldErrors, telefono: '' });
                    }
                  }}
                  placeholder="+52 55 1234 5678"
                  maxLength={20}
                  required
                  validationType="phone"
                  error={fieldErrors.telefono || null}
                  onValidationChange={(error) => {
                    if (error) {
                      setFieldErrors({ ...fieldErrors, telefono: error });
                    } else {
                      const { telefono, ...rest } = fieldErrors;
                      setFieldErrors(rest);
                    }
                  }}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <Input
                  label="Dirección"
                  type="text"
                  value={formData.direccion || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, direccion: e.target.value });
                    if (fieldErrors.direccion) {
                      setFieldErrors({ ...fieldErrors, direccion: '' });
                    }
                  }}
                  placeholder="Calle y número, Colonia, Ciudad"
                  required
                  validationType="required"
                  error={fieldErrors.direccion || null}
                  onValidationChange={(error) => {
                    if (error) {
                      setFieldErrors({ ...fieldErrors, direccion: error });
                    } else {
                      const { direccion, ...rest } = fieldErrors;
                      setFieldErrors(rest);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            onClick={() => navigate(ROUTES.CLIENTES)}
            className={styles.secondaryButton}
          >
            <FaTimes />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.primaryButton}
          >
            {saving ? (
              <>
                <span className={styles.spinner}></span>
                Guardando...
              </>
            ) : (
              <>
                <FaSave />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
