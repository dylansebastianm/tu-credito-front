/**
 * Credito Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { setDocumentMeta } from '../../utils/meta';
import { mockClientes, mockBancos, type MockCredito } from '../../data/mock-data';
import { formatCurrency, calculateCuotaMensual, calculateMontoTotal } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Creditos.module.css';

/**
 * CreditoCreatePage component
 * Página de creación/edición de crédito
 */
export function CreditoCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.credito !== undefined;
  const existingCredito = location.state?.credito as MockCredito | undefined;

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MockCredito>>({
    clienteId: existingCredito?.clienteId || '',
    bancoId: existingCredito?.bancoId || '',
    monto: existingCredito?.monto || 0,
    tasaInteres: existingCredito?.tasaInteres || 12,
    plazoMeses: existingCredito?.plazoMeses || 12,
    estado: existingCredito?.estado || 'pendiente',
    proposito: existingCredito?.proposito || '',
    observaciones: existingCredito?.observaciones || '',
    cuotaMensual: existingCredito?.cuotaMensual || 0,
    montoTotal: existingCredito?.montoTotal || 0,
  });

  useEffect(() => {
    setDocumentMeta({
      title: isEdit ? 'Editar Crédito' : 'Nuevo Crédito',
      description: isEdit ? 'Modificar datos del crédito' : 'Crear nuevo crédito',
    });
  }, [isEdit]);

  useEffect(() => {
    if (formData.monto && formData.tasaInteres && formData.plazoMeses) {
      const cuota = calculateCuotaMensual(
        formData.monto,
        formData.tasaInteres,
        formData.plazoMeses
      );
      const total = calculateMontoTotal(cuota, formData.plazoMeses);
      setFormData((prev) => ({
        ...prev,
        cuotaMensual: cuota,
        montoTotal: total,
      }));
    }
  }, [formData.monto, formData.tasaInteres, formData.plazoMeses]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // TODO: Implementar lógica real con servicio
    setSaving(false);
    navigate(ROUTES.CREDITOS);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <span
          className={styles.breadcrumbLink}
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Inicio
        </span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span
          className={styles.breadcrumbLink}
          onClick={() => navigate(ROUTES.CREDITOS)}
        >
          Créditos
        </span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? 'Editar' : 'Nuevo'}
        </span>
      </nav>

      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.CREDITOS)}
          className={styles.secondaryButton}
        >
          <FaArrowLeft />
          Volver
        </button>
        <h1 className={styles.title}>
          {isEdit ? 'Editar Crédito' : 'Nuevo Crédito'}
        </h1>
        <p className={styles.subtitle}>
          {isEdit
            ? 'Modifica los datos del crédito'
            : 'Completa los datos del nuevo crédito'}
        </p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Información del Crédito</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Cliente <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.clienteId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteId: e.target.value })
                  }
                  className={styles.formSelect}
                >
                  <option value="">Seleccionar cliente</option>
                  {mockClientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Banco <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.bancoId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bancoId: e.target.value })
                  }
                  className={styles.formSelect}
                >
                  <option value="">Seleccionar banco</option>
                  {mockBancos.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Condiciones Financieras</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Monto (MXN) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.monto || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: Number(e.target.value) })
                  }
                  placeholder="0.00"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Tasa de Interés (%) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tasaInteres || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasaInteres: Number(e.target.value),
                    })
                  }
                  placeholder="12.0"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Plazo (meses) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.plazoMeses || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazoMeses: Number(e.target.value),
                    })
                  }
                  placeholder="12"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Estado</label>
                <select
                  value={formData.estado || 'pendiente'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as MockCredito['estado'],
                    })
                  }
                  className={styles.formSelect}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="activo">Activo</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="pagado">Pagado</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
            </div>

            {formData.cuotaMensual && formData.cuotaMensual > 0 && (
              <div className={styles.calculationBox}>
                <h4 className={styles.calculationTitle}>Cálculo del Crédito</h4>
                <div className={styles.calculationGrid}>
                  <div className={styles.calculationItem}>
                    <span className={styles.calculationLabel}>Cuota Mensual</span>
                    <span className={styles.calculationValue}>
                      {formatCurrency(formData.cuotaMensual)}
                    </span>
                  </div>
                  <div className={styles.calculationItem}>
                    <span className={styles.calculationLabel}>Total Intereses</span>
                    <span className={styles.calculationValue}>
                      {formatCurrency(
                        (formData.montoTotal || 0) - (formData.monto || 0)
                      )}
                    </span>
                  </div>
                  <div className={styles.calculationItem}>
                    <span className={styles.calculationLabel}>Monto Total</span>
                    <span className={styles.calculationValueLarge}>
                      {formatCurrency(formData.montoTotal || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Información Adicional</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>Propósito del Crédito</label>
                <input
                  type="text"
                  value={formData.proposito || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, proposito: e.target.value })
                  }
                  placeholder="Ej: Compra de vivienda, capital de trabajo..."
                  className={styles.formInput}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>Observaciones</label>
                <textarea
                  value={formData.observaciones || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  placeholder="Notas o comentarios adicionales..."
                  className={styles.formTextarea}
                />
              </div>
            </div>
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
    </div>
  );
}
