/**
 * Credito Create Page - Tu Crédito Frontend
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { setDocumentMeta } from '../../utils/meta';
import { creditosService } from '../../services/creditos.service';
import { clientesService } from '../../services/clientes.service';
import { bancosService } from '../../services/bancos.service';
import type { CreditoCreate, Credito, CreditoListItem } from '../../types/credito';
import type { ClienteListItem } from '../../types/cliente';
import type { Banco } from '../../types/banco';
import { formatCurrency, calculateCuotaMensual, calculateMontoTotal } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { getErrorMessage } from '../../utils/error';
import { BackButton } from '../../components/ui/BackButton/BackButton';
import { Alert } from '../../components/ui/Alert/Alert';
import { Select } from '../../components/ui/Select/Select';
import { Input } from '../../components/ui/Input/Input';
import { isRequired, isPositiveNumber, isInRange } from '../../utils/validation';
import styles from './Creditos.module.css';

/**
 * CreditoCreatePage component
 * Página de creación/edición de crédito
 */
export function CreditoCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const existingCredito = location.state?.credito as Credito | CreditoListItem | undefined;
  const isEdit = existingCredito !== undefined;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState<CreditoCreate>({
    cliente: 0,
    banco: 0,
    descripcion: '',
    monto: '',
    pago_minimo: '',
    pago_maximo: '',
    plazo_meses: 12,
    tipo_credito: 'COMERCIAL',
    tasa_interes: '12.00', // Tasa por defecto 12%
  });

  // Cargar opciones de clientes y bancos
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [clientesRes, bancosRes] = await Promise.all([
          clientesService.getAll({ page_size: 100, ordering: 'nombre_completo' }),
          bancosService.getAll({ page_size: 100, ordering: 'nombre' }),
        ]);
        setClientes(clientesRes.results);
        setBancos(bancosRes.results);
      } catch (err) {
        console.error('Error loading options:', err);
        setError('Error al cargar clientes y bancos');
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Cargar datos del crédito si estamos editando
  useEffect(() => {
    const loadCredito = async () => {
      if (isEdit && existingCredito && 'id' in existingCredito) {
        try {
          // Si es CreditoListItem, necesitamos cargar el detalle completo
          const fullCredito =
            'banco_info' in existingCredito || 'cliente_info' in existingCredito
              ? (existingCredito as Credito)
              : await creditosService.getById(existingCredito.id);

          setFormData({
            cliente: fullCredito.cliente,
            banco: fullCredito.banco,
            descripcion: fullCredito.descripcion,
            monto: fullCredito.monto,
            pago_minimo: fullCredito.pago_minimo,
            pago_maximo: fullCredito.pago_maximo,
            plazo_meses: fullCredito.plazo_meses,
            tipo_credito: fullCredito.tipo_credito,
            tasa_interes: fullCredito.tasa_interes,
          });
        } catch (err) {
          console.error('Error loading credito for edit:', err);
          setError('Error al cargar los datos del crédito');
        }
      }
    };

    loadCredito();
  }, [isEdit, existingCredito]);

  useEffect(() => {
    setDocumentMeta({
      title: isEdit ? 'Editar Crédito' : 'Nuevo Crédito',
      description: isEdit ? 'Modificar datos del crédito' : 'Crear nuevo crédito',
    });
  }, [isEdit]);

  const handleSave = async () => {
    // Validaciones de campos requeridos - errores individuales
    const newFieldErrors: Record<string, string> = {};

    if (!isPositiveNumber(formData.cliente)) {
      newFieldErrors.cliente = 'Debe seleccionar un cliente';
    }

    if (!isPositiveNumber(formData.banco)) {
      newFieldErrors.banco = 'Debe seleccionar un banco';
    }

    if (!isRequired(formData.descripcion)) {
      newFieldErrors.descripcion = 'La descripción es requerida';
    }

    if (!isPositiveNumber(formData.monto)) {
      newFieldErrors.monto = 'El monto es requerido y debe ser mayor a 0';
    }

    if (!isPositiveNumber(formData.pago_minimo)) {
      newFieldErrors.pago_minimo = 'El pago mínimo es requerido y debe ser mayor a 0';
    }

    if (!isPositiveNumber(formData.pago_maximo)) {
      newFieldErrors.pago_maximo = 'El pago máximo es requerido y debe ser mayor a 0';
    }

    if (isPositiveNumber(formData.pago_minimo) && isPositiveNumber(formData.pago_maximo)) {
      const pagoMin = parseFloat(formData.pago_minimo);
      const pagoMax = parseFloat(formData.pago_maximo);
      if (pagoMin > pagoMax) {
        newFieldErrors.pago_maximo = 'El pago mínimo no puede ser mayor que el pago máximo';
      }
    }

    if (!isPositiveNumber(formData.plazo_meses)) {
      newFieldErrors.plazo_meses = 'El plazo en meses es requerido y debe ser mayor a 0';
    } else if (!isInRange(formData.plazo_meses, 1, 600)) {
      newFieldErrors.plazo_meses = 'El plazo en meses debe estar entre 1 y 600 meses';
    }

    if (!isPositiveNumber(formData.tasa_interes)) {
      newFieldErrors.tasa_interes = 'La tasa de interés es requerida y debe ser mayor a 0';
    } else if (!isInRange(parseFloat(formData.tasa_interes), 0.01, 100)) {
      newFieldErrors.tasa_interes = 'La tasa de interés debe estar entre 0.01% y 100%';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    setError(null);

    try {
      if (isEdit && existingCredito && 'id' in existingCredito) {
        await creditosService.update(existingCredito.id, formData);
        setAlertMessage('Crédito actualizado exitosamente');
      } else {
        await creditosService.create(formData);
        setAlertMessage('Crédito creado exitosamente');
      }
      setShowAlert(true);
      setTimeout(() => {
        navigate(ROUTES.CREDITOS);
      }, 500);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al guardar el crédito. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error saving credito:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calcular valores financieros estimados para mostrar (preview antes de guardar)
  // El backend calculará automáticamente los valores finales al guardar usando la fórmula de amortización
  const montoNum = parseFloat(formData.monto) || 0;
  const tasaInteresNum = parseFloat(formData.tasa_interes) || 12;
  const cuotaMensual =
    montoNum > 0 && formData.plazo_meses > 0 && tasaInteresNum > 0
      ? calculateCuotaMensual(montoNum, tasaInteresNum, formData.plazo_meses)
      : 0;
  const montoTotal = cuotaMensual > 0 ? calculateMontoTotal(cuotaMensual, formData.plazo_meses) : 0;

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
            <BackButton onClick={() => navigate(ROUTES.CREDITOS)} />
            <div>
              <h1 className={styles.formTitle}>
                {isEdit ? 'Editar Crédito' : 'Nuevo Crédito'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEdit
                  ? 'Modifica los datos del crédito'
                  : 'Completa los datos del nuevo crédito'}
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className={styles.alert}>
            <p className={styles.alertText}>{error}</p>
          </div>
        )}

        <div className={styles.form}>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Información del Crédito</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Select
                  label="Cliente"
                  required
                  value={formData.cliente ? String(formData.cliente) : ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData({ ...formData, cliente: newValue ? parseInt(newValue, 10) : 0 });
                    if (fieldErrors.cliente) {
                      setFieldErrors({ ...fieldErrors, cliente: '' });
                    }
                  }}
                  options={[
                    { value: '0', label: 'Seleccionar cliente' },
                    ...clientes.map((c) => ({
                      value: String(c.id),
                      label: c.nombre_completo,
                    })),
                  ]}
                  error={fieldErrors.cliente || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, cliente: error || '' });
                  }}
                  disabled={loadingOptions}
                  validateNotZero
                  placeholder="Seleccionar cliente"
                />
              </div>
              <div className={styles.formField}>
                <Select
                  label="Banco"
                  required
                  value={formData.banco ? String(formData.banco) : ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData({ ...formData, banco: newValue ? parseInt(newValue, 10) : 0 });
                    if (fieldErrors.banco) {
                      setFieldErrors({ ...fieldErrors, banco: '' });
                    }
                  }}
                  options={[
                    { value: '0', label: 'Seleccionar banco' },
                    ...bancos.map((b) => ({
                      value: String(b.id),
                      label: b.nombre,
                    })),
                  ]}
                  error={fieldErrors.banco || null}
                  onValidationChange={(error) => {
                    setFieldErrors({ ...fieldErrors, banco: error || '' });
                  }}
                  disabled={loadingOptions}
                  validateNotZero
                  placeholder="Seleccionar banco"
                />
              </div>
              <div className={styles.formField}>
                <Select
                  label="Tipo de Crédito"
                  required
                  value={formData.tipo_credito}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_credito: e.target.value as 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL',
                    })
                  }
                  options={[
                    { value: 'AUTOMOTRIZ', label: 'Automotriz' },
                    { value: 'HIPOTECARIO', label: 'Hipotecario' },
                    { value: 'COMERCIAL', label: 'Comercial' },
                  ]}
                  placeholder="Seleccionar tipo"
                />
              </div>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>
                  Descripción <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => {
                      setFormData({ ...formData, descripcion: e.target.value });
                      if (fieldErrors.descripcion) {
                        setFieldErrors({ ...fieldErrors, descripcion: '' });
                      }
                    }}
                    placeholder="Descripción del crédito"
                    className={`${styles.formInput} ${fieldErrors.descripcion ? styles.formInputError : ''}`}
                    required
                  />
                  {fieldErrors.descripcion && (
                    <span className={styles.fieldError}>{fieldErrors.descripcion}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Condiciones Financieras</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Input
                  label="Monto del Crédito (USD)"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto ? String(formData.monto) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, monto: e.target.value });
                    if (fieldErrors.monto) {
                      setFieldErrors({ ...fieldErrors, monto: '' });
                    }
                  }}
                  placeholder="Ej: 100000.00"
                  error={fieldErrors.monto || null}
                  onValidationChange={(error: string | null) => {
                    setFieldErrors({ ...fieldErrors, monto: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Pago Mínimo (USD)"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.pago_minimo ? String(formData.pago_minimo) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, pago_minimo: e.target.value });
                    if (fieldErrors.pago_minimo) {
                      setFieldErrors({ ...fieldErrors, pago_minimo: '' });
                    }
                  }}
                  placeholder="Ej: 100.00"
                  error={fieldErrors.pago_minimo || null}
                  onValidationChange={(error: string | null) => {
                    setFieldErrors({ ...fieldErrors, pago_minimo: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Pago Máximo (USD)"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.pago_maximo ? String(formData.pago_maximo) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, pago_maximo: e.target.value });
                    if (fieldErrors.pago_maximo) {
                      setFieldErrors({ ...fieldErrors, pago_maximo: '' });
                    }
                  }}
                  placeholder="Ej: 500.00"
                  error={fieldErrors.pago_maximo || null}
                  onValidationChange={(error: string | null) => {
                    setFieldErrors({ ...fieldErrors, pago_maximo: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Plazo (meses)"
                  required
                  type="number"
                  min="1"
                  value={formData.plazo_meses ? String(formData.plazo_meses) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      plazo_meses: val ? parseInt(val, 10) : 0,
                    });
                    if (fieldErrors.plazo_meses) {
                      setFieldErrors({ ...fieldErrors, plazo_meses: '' });
                    }
                  }}
                  placeholder="Ej: 12"
                  error={fieldErrors.plazo_meses || null}
                  onValidationChange={(error: string | null) => {
                    setFieldErrors({ ...fieldErrors, plazo_meses: error || '' });
                  }}
                />
              </div>
              <div className={styles.formField}>
                <Input
                  label="Tasa de Interés Anual (%)"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.tasa_interes ? String(formData.tasa_interes) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, tasa_interes: e.target.value });
                    if (fieldErrors.tasa_interes) {
                      setFieldErrors({ ...fieldErrors, tasa_interes: '' });
                    }
                  }}
                  placeholder="Ej: 12.00"
                  error={fieldErrors.tasa_interes || null}
                  onValidationChange={(error: string | null) => {
                    setFieldErrors({ ...fieldErrors, tasa_interes: error || '' });
                  }}
                />
              </div>
            </div>

            {cuotaMensual > 0 && (
              <div className={styles.calculationBox}>
                <h4 className={styles.calculationTitle}>Cálculo Estimado del Crédito</h4>
                <div className={styles.calculationGrid}>
                  <div className={styles.calculationItem}>
                    <span className={styles.calculationLabel}>Cuota Mensual Estimada</span>
                    <span className={styles.calculationValue}>
                      {formatCurrency(cuotaMensual)}
                    </span>
                  </div>
                  <div className={styles.calculationItem}>
                    <span className={styles.calculationLabel}>Total Estimado</span>
                    <span className={styles.calculationValueLarge}>
                      {formatCurrency(montoTotal)}
                    </span>
                  </div>
                </div>
                <p className={styles.calculationNote}>
                  * Los valores mostrados son estimaciones basadas en las condiciones ingresadas. Las tasas y condiciones finales están sujetas a aprobación y pueden variar según el análisis crediticio.
                </p>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              onClick={() => navigate(ROUTES.CREDITOS)}
              className={styles.secondaryButton}
            >
              <FaTimes />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loadingOptions}
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
      </div>
    </>
  );
}
