/**
 * Banco Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { setDocumentMeta } from '../../utils/meta';
import { ROUTES } from '../../app/config/constants';
import { bancosService } from '../../services/bancos.service';
import type { Banco, BancoCreate, BancoListItem } from '../../types/banco';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { Select } from '../../components/ui/Select/Select';
import { Input } from '../../components/ui/Input/Input';
import { Alert } from '../../components/ui/Alert/Alert';
import { isRequired, getEmailError, getPhoneError } from '../../utils/validation';
import { getErrorMessage } from '../../utils/error';
import styles from './Bancos.module.css';

/**
 * BancoCreatePage component
 * Página de creación/edición de banco
 */
export function BancoCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const existingBanco = location.state?.banco as Banco | BancoListItem | undefined;
  const isEdit = existingBanco !== undefined;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState<BancoCreate>({
    nombre: '',
    codigo: '',
    tipo: 'PRIVADO',
    direccion: '',
    telefono: '',
    email: '',
    sitio_web: '',
    tasa_interes_min: undefined,
    tasa_interes_max: undefined,
    plazo_minimo: undefined,
    plazo_maximo: undefined,
    monto_minimo: undefined,
    monto_maximo: undefined,
    estado: 'activo',
  });

  useEffect(() => {
    setDocumentMeta({
      title: isEdit ? 'Editar Banco' : 'Nuevo Banco',
      description: isEdit ? 'Modificar datos del banco' : 'Crear nuevo banco',
    });
  }, [isEdit]);

  // Cargar datos del banco si está editando
  useEffect(() => {
    const loadBanco = async () => {
      if (!isEdit || !existingBanco) return;

      // Si es BancoListItem, necesitamos cargar el completo
      if ('codigo' in existingBanco && existingBanco.codigo) {
        // Ya tiene los datos básicos, pero cargamos el completo para asegurar
        try {
          const bancoCompleto = await bancosService.getById(existingBanco.id);
          setFormData({
            nombre: bancoCompleto.nombre,
            codigo: bancoCompleto.codigo,
            tipo: bancoCompleto.tipo,
            direccion: bancoCompleto.direccion || '',
            telefono: bancoCompleto.telefono || '',
            email: bancoCompleto.email || '',
            sitio_web: bancoCompleto.sitio_web || '',
            tasa_interes_min: bancoCompleto.tasa_interes_min
              ? parseFloat(bancoCompleto.tasa_interes_min)
              : undefined,
            tasa_interes_max: bancoCompleto.tasa_interes_max
              ? parseFloat(bancoCompleto.tasa_interes_max)
              : undefined,
            plazo_minimo: bancoCompleto.plazo_minimo,
            plazo_maximo: bancoCompleto.plazo_maximo,
            monto_minimo: bancoCompleto.monto_minimo
              ? parseFloat(bancoCompleto.monto_minimo)
              : undefined,
            monto_maximo: bancoCompleto.monto_maximo
              ? parseFloat(bancoCompleto.monto_maximo)
              : undefined,
            estado: bancoCompleto.estado,
          });
        } catch (err) {
          console.error('Error loading banco:', err);
        }
      }
    };

    loadBanco();
  }, [isEdit, existingBanco]);

  const handleSave = async () => {
    // Validaciones de campos requeridos - errores individuales
    const newFieldErrors: Record<string, string> = {};

    if (!isRequired(formData.nombre)) {
      newFieldErrors.nombre = 'El nombre del banco es requerido';
    }

    if (!isRequired(formData.codigo)) {
      newFieldErrors.codigo = 'El código del banco es requerido';
    }

    // Validar tipo (requerido) - siempre tiene valor por defecto, pero verificamos que exista
    if (!formData.tipo) {
      newFieldErrors.tipo = 'El tipo de banco es requerido';
    }

    // Validar email (requerido)
    const emailError = getEmailError(formData.email || '');
    if (emailError) {
      newFieldErrors.email = emailError;
    }

    // Validar teléfono (requerido)
    const phoneError = getPhoneError(formData.telefono || '');
    if (phoneError) {
      newFieldErrors.telefono = phoneError;
    }

    // Validar dirección (requerido)
    if (!isRequired(formData.direccion)) {
      newFieldErrors.direccion = 'La dirección es requerida';
    }

    // Validar tasas
    if (formData.tasa_interes_min !== undefined && formData.tasa_interes_max !== undefined) {
      if (formData.tasa_interes_min > formData.tasa_interes_max) {
        newFieldErrors.tasa_interes_max = 'La tasa mínima no puede ser mayor que la tasa máxima';
      }
    }

    // Validar plazos
    if (formData.plazo_minimo !== undefined && formData.plazo_maximo !== undefined) {
      if (formData.plazo_minimo > formData.plazo_maximo) {
        newFieldErrors.plazo_maximo = 'El plazo mínimo no puede ser mayor que el plazo máximo';
      }
    }

    // Validar montos
    if (formData.monto_minimo !== undefined && formData.monto_maximo !== undefined) {
      if (formData.monto_minimo > formData.monto_maximo) {
        newFieldErrors.monto_maximo = 'El monto mínimo no puede ser mayor que el monto máximo';
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setFieldErrors({});

    try {
      setSaving(true);
      setError(null);

      // Limpiar el objeto formData: asegurar que los campos requeridos estén presentes
      const cleanFormData: BancoCreate = {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim(),
        tipo: formData.tipo,
        direccion: formData.direccion?.trim() || '',
        email: formData.email?.trim() || '',
        telefono: formData.telefono?.trim() || '',
        estado: formData.estado || 'activo',
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.sitio_web?.trim()) {
        cleanFormData.sitio_web = formData.sitio_web.trim();
      }
      if (formData.tasa_interes_min !== undefined) {
        cleanFormData.tasa_interes_min = formData.tasa_interes_min;
      }
      if (formData.tasa_interes_max !== undefined) {
        cleanFormData.tasa_interes_max = formData.tasa_interes_max;
      }
      if (formData.plazo_minimo !== undefined) {
        cleanFormData.plazo_minimo = formData.plazo_minimo;
      }
      if (formData.plazo_maximo !== undefined) {
        cleanFormData.plazo_maximo = formData.plazo_maximo;
      }
      if (formData.monto_minimo !== undefined) {
        cleanFormData.monto_minimo = formData.monto_minimo;
      }
      if (formData.monto_maximo !== undefined) {
        cleanFormData.monto_maximo = formData.monto_maximo;
      }

      if (isEdit && existingBanco) {
        await bancosService.updateFull(existingBanco.id, cleanFormData);
        setAlertMessage('Banco actualizado exitosamente');
      } else {
        await bancosService.create(cleanFormData);
        setAlertMessage('Banco creado exitosamente');
      }
      setShowAlert(true);
      setTimeout(() => {
        navigate(ROUTES.BANCOS);
      }, 500);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al guardar el banco. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error saving banco:', err);
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
      {error && (
        <div className={styles.alert}>
          <p className={styles.alertText}>{error}</p>
        </div>
      )}

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formHeaderLeft}>
            <BackButton onClick={() => navigate(ROUTES.BANCOS)} />
            <div>
              <h1 className={styles.formTitle}>
                {isEdit ? 'Editar Banco' : 'Nuevo Banco'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEdit
                  ? 'Modifica los datos del banco'
                  : 'Completa los datos del nuevo banco'}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Información General</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Input
                  label="Nombre del Banco"
                  required
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre: e.target.value });
                    if (fieldErrors.nombre) {
                      setFieldErrors({ ...fieldErrors, nombre: '' });
                    }
                  }}
                  placeholder="Nombre del banco"
                  error={fieldErrors.nombre || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, nombre: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Código"
                  required
                  value={formData.codigo}
                  onChange={(e) => {
                    setFormData({ ...formData, codigo: e.target.value });
                    if (fieldErrors.codigo) {
                      setFieldErrors({ ...fieldErrors, codigo: '' });
                    }
                  }}
                  placeholder="Ej: BN001"
                  error={fieldErrors.codigo || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, codigo: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Select
                  label="Tipo"
                  required
                  value={formData.tipo}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      tipo: e.target.value as 'PRIVADO' | 'GOBIERNO',
                    });
                    if (fieldErrors.tipo) {
                      setFieldErrors({ ...fieldErrors, tipo: '' });
                    }
                  }}
                  options={[
                    { value: 'PRIVADO', label: 'Privado' },
                    { value: 'GOBIERNO', label: 'Gobierno' },
                  ]}
                  placeholder="Seleccionar tipo"
                  error={fieldErrors.tipo || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, tipo: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Select
                  label="Estado"
                  value={formData.estado || 'activo'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as 'activo' | 'inactivo',
                    })
                  }
                  options={[
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
                  ]}
                  placeholder="Seleccionar estado"
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <Input
                  label="Dirección"
                  required
                  value={formData.direccion || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, direccion: e.target.value });
                    if (fieldErrors.direccion) {
                      setFieldErrors({ ...fieldErrors, direccion: '' });
                    }
                  }}
                  placeholder="Dirección completa"
                  error={fieldErrors.direccion || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, direccion: error || '' });
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
                  required
                  type="email"
                  validationType="email"
                  value={formData.email || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: '' });
                    }
                  }}
                  placeholder="contacto@banco.com"
                  error={fieldErrors.email || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, email: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Teléfono"
                  required
                  type="tel"
                  validationType="phone"
                  value={formData.telefono || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, telefono: e.target.value });
                    if (fieldErrors.telefono) {
                      setFieldErrors({ ...fieldErrors, telefono: '' });
                    }
                  }}
                  placeholder="+1 555 123 4567"
                  error={fieldErrors.telefono || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, telefono: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Sitio Web</label>
                <input
                  type="url"
                  value={formData.sitio_web || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, sitio_web: e.target.value })
                  }
                  placeholder="https://www.banco.com"
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Tasas de Interés</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Input
                  label="Tasa Mínima (%)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.tasa_interes_min !== undefined ? String(formData.tasa_interes_min) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      tasa_interes_min: val ? Number(val) : undefined,
                    });
                    if (fieldErrors.tasa_interes_min) {
                      setFieldErrors({ ...fieldErrors, tasa_interes_min: '' });
                    }
                  }}
                  placeholder="Ej: 5.50"
                  error={fieldErrors.tasa_interes_min || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, tasa_interes_min: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Tasa Máxima (%)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.tasa_interes_max !== undefined ? String(formData.tasa_interes_max) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      tasa_interes_max: val ? Number(val) : undefined,
                    });
                    if (fieldErrors.tasa_interes_max) {
                      setFieldErrors({ ...fieldErrors, tasa_interes_max: '' });
                    }
                  }}
                  placeholder="Ej: 15.75"
                  error={fieldErrors.tasa_interes_max || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, tasa_interes_max: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Plazo Mínimo (meses)"
                  type="number"
                  min="1"
                  value={formData.plazo_minimo !== undefined ? String(formData.plazo_minimo) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      plazo_minimo: val ? Number(val) : undefined,
                    });
                    if (fieldErrors.plazo_minimo) {
                      setFieldErrors({ ...fieldErrors, plazo_minimo: '' });
                    }
                  }}
                  placeholder="Ej: 12"
                  error={fieldErrors.plazo_minimo || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, plazo_minimo: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Plazo Máximo (meses)"
                  type="number"
                  min="1"
                  value={formData.plazo_maximo !== undefined ? String(formData.plazo_maximo) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      plazo_maximo: val ? Number(val) : undefined,
                    });
                    if (fieldErrors.plazo_maximo) {
                      setFieldErrors({ ...fieldErrors, plazo_maximo: '' });
                    }
                  }}
                  placeholder="Ej: 60"
                  error={fieldErrors.plazo_maximo || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, plazo_maximo: error || '' });
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Montos</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Input
                  label="Monto Mínimo (USD)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto_minimo !== undefined ? String(formData.monto_minimo) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      monto_minimo: val ? Number(val) : undefined,
                    });
                    if (fieldErrors.monto_minimo) {
                      setFieldErrors({ ...fieldErrors, monto_minimo: '' });
                    }
                  }}
                  placeholder="Ej: 1000.00"
                  error={fieldErrors.monto_minimo || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, monto_minimo: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Monto Máximo (USD)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto_maximo !== undefined ? String(formData.monto_maximo) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      monto_maximo: val ? Number(val) : undefined,
                    });
                    if (fieldErrors.monto_maximo) {
                      setFieldErrors({ ...fieldErrors, monto_maximo: '' });
                    }
                  }}
                  placeholder="Ej: 100000.00"
                  error={fieldErrors.monto_maximo || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, monto_maximo: error || '' });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            onClick={() => navigate(ROUTES.BANCOS)}
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
