/**
 * Credito Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
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
import { ApiError } from '../../utils/error';
import { BackButton } from '../../components/ui/BackButton/BackButton';
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
  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState<CreditoCreate>({
    cliente: 0,
    banco: 0,
    descripcion: '',
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
    // Validaciones básicas
    if (!formData.cliente || formData.cliente === 0) {
      setError('Debe seleccionar un cliente');
      return;
    }

    if (!formData.banco || formData.banco === 0) {
      setError('Debe seleccionar un banco');
      return;
    }

    if (!formData.descripcion.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!formData.pago_minimo || parseFloat(formData.pago_minimo) <= 0) {
      setError('El pago mínimo debe ser mayor a 0');
      return;
    }

    if (!formData.pago_maximo || parseFloat(formData.pago_maximo) <= 0) {
      setError('El pago máximo debe ser mayor a 0');
      return;
    }

    if (parseFloat(formData.pago_minimo) > parseFloat(formData.pago_maximo)) {
      setError('El pago mínimo no puede ser mayor al pago máximo');
      return;
    }

    if (!formData.plazo_meses || formData.plazo_meses <= 0) {
      setError('El plazo en meses debe ser mayor a 0');
      return;
    }

    if (!formData.tasa_interes || parseFloat(formData.tasa_interes) <= 0) {
      setError('La tasa de interés debe ser mayor a 0');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit && existingCredito && 'id' in existingCredito) {
        await creditosService.update(existingCredito.id, formData);
      } else {
        await creditosService.create(formData);
      }
      navigate(ROUTES.CREDITOS);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al guardar el crédito. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error saving credito:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calcular valores financieros estimados para mostrar (preview antes de guardar)
  // El backend calculará automáticamente los valores finales al guardar usando la fórmula de amortización
  const pagoMaximoNum = parseFloat(formData.pago_maximo) || 0;
  const tasaInteresNum = parseFloat(formData.tasa_interes) || 12;
  const cuotaMensual =
    pagoMaximoNum > 0 && formData.plazo_meses > 0 && tasaInteresNum > 0
      ? calculateCuotaMensual(pagoMaximoNum, tasaInteresNum, formData.plazo_meses)
      : 0;
  const montoTotal = cuotaMensual > 0 ? calculateMontoTotal(cuotaMensual, formData.plazo_meses) : 0;

  return (
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
                <label className={styles.formLabel}>
                  Cliente <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.cliente || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente: parseInt(e.target.value, 10) })
                  }
                  className={styles.formSelect}
                  disabled={loadingOptions}
                  required
                >
                  <option value="0">Seleccionar cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Banco <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.banco || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, banco: parseInt(e.target.value, 10) })
                  }
                  className={styles.formSelect}
                  disabled={loadingOptions}
                  required
                >
                  <option value="0">Seleccionar banco</option>
                  {bancos.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Tipo de Crédito <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.tipo_credito}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_credito: e.target.value as 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL',
                    })
                  }
                  className={styles.formSelect}
                  required
                >
                  <option value="AUTOMOTRIZ">Automotriz</option>
                  <option value="HIPOTECARIO">Hipotecario</option>
                  <option value="COMERCIAL">Comercial</option>
                </select>
              </div>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>
                  Descripción <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Descripción del crédito"
                  className={styles.formInput}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Condiciones Financieras</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Pago Mínimo (MXN) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.pago_minimo}
                  onChange={(e) =>
                    setFormData({ ...formData, pago_minimo: e.target.value })
                  }
                  placeholder="0.00"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Pago Máximo (MXN) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.pago_maximo}
                  onChange={(e) =>
                    setFormData({ ...formData, pago_maximo: e.target.value })
                  }
                  placeholder="0.00"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Plazo (meses) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.plazo_meses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazo_meses: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="12"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Tasa de Interés Anual (%) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.tasa_interes}
                  onChange={(e) =>
                    setFormData({ ...formData, tasa_interes: e.target.value })
                  }
                  placeholder="12.00"
                  className={styles.formInput}
                  required
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
  );
}
