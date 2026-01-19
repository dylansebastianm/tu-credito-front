/**
 * Credito Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockClientes } from '../../data/mock-data';
import { mockBancos } from '../../data/mock-data';
import { type MockCredito } from '../../data/mock-data';
import { formatCurrency, calculateCuotaMensual, calculateMontoTotal } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Creditos.module.css';

/**
 * CreditoCreatePage component
 * Página de creación de crédito
 */
export function CreditoCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MockCredito>>({
    clienteId: '',
    bancoId: '',
    monto: 0,
    tasaInteres: 0,
    plazoMeses: 0,
    estado: 'pendiente',
    proposito: '',
    observaciones: '',
  });

  useEffect(() => {
    setDocumentMeta({
      title: 'Nuevo Crédito',
      description: 'Crear nuevo crédito',
    });
  }, []);

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
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.CREDITOS)}
          className={styles.secondaryButton}
        >
          <ArrowLeft className={styles.buttonIcon} />
          Volver
        </button>
        <h1 className={styles.title}>Nuevo Crédito</h1>
        <p className={styles.subtitle}>Completa los datos del nuevo crédito</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label
                className={`${styles.formLabel} ${styles.formLabelRequired}`}
              >
                Cliente
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
              <label
                className={`${styles.formLabel} ${styles.formLabelRequired}`}
              >
                Banco
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
            <div className={styles.formField}>
              <label
                className={`${styles.formLabel} ${styles.formLabelRequired}`}
              >
                Monto
              </label>
              <input
                type="number"
                value={formData.monto || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monto: Number(e.target.value),
                  })
                }
                placeholder="0.00"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label
                className={`${styles.formLabel} ${styles.formLabelRequired}`}
              >
                Tasa de Interés (%)
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
              <label
                className={`${styles.formLabel} ${styles.formLabelRequired}`}
              >
                Plazo (meses)
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
            <div className={`${styles.formField} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>Propósito</label>
              <input
                type="text"
                value={formData.proposito || ''}
                onChange={(e) =>
                  setFormData({ ...formData, proposito: e.target.value })
                }
                placeholder="Propósito del crédito"
                className={styles.formInput}
              />
            </div>
            <div className={`${styles.formField} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>Observaciones</label>
              <textarea
                value={formData.observaciones || ''}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                placeholder="Observaciones adicionales"
                className={`${styles.textarea} ${styles.formInput}`}
              />
            </div>
          </div>

          {formData.cuotaMensual && formData.cuotaMensual > 0 && (
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Cuota Mensual
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {formatCurrency(formData.cuotaMensual)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Monto Total
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#2563eb',
                  }}
                >
                  {formData.montoTotal ? formatCurrency(formData.montoTotal) : '$0.00'}
                </p>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button
              onClick={() => navigate(ROUTES.CREDITOS)}
              className={styles.secondaryButton}
            >
              <X className={styles.buttonIcon} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={styles.primaryButton}
            >
              {saving ? (
                <>
                  <Loader2 className={`${styles.buttonIcon} ${styles.spinner}`} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className={styles.buttonIcon} />
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
