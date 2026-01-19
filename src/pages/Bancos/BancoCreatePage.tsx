/**
 * Banco Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { type MockBanco } from '../../data/mock-data';
import { ROUTES } from '../../app/config/constants';
import styles from './Bancos.module.css';

/**
 * BancoCreatePage component
 * Página de creación de banco
 */
export function BancoCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MockBanco>>({
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    tasaInteresMin: 8,
    tasaInteresMax: 20,
    plazoMinimo: 6,
    plazoMaximo: 60,
    montoMinimo: 10000,
    montoMaximo: 500000,
    estado: 'activo',
  });

  useEffect(() => {
    setDocumentMeta({
      title: 'Nuevo Banco',
      description: 'Crear nuevo banco',
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // TODO: Implementar lógica real con servicio
    setSaving(false);
    navigate(ROUTES.BANCOS);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.BANCOS)}
          className={styles.secondaryButton}
        >
          <ArrowLeft className={styles.buttonIcon} />
          Volver
        </button>
        <h1 className={styles.title}>Nuevo Banco</h1>
        <p className={styles.subtitle}>Completa los datos del nuevo banco</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Nombre del Banco
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre del banco"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Código
              </label>
              <input
                type="text"
                value={formData.codigo || ''}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                placeholder="Ej: BN001"
                className={styles.formInput}
              />
            </div>
            <div className={`${styles.formField} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>Dirección</label>
              <input
                type="text"
                value={formData.direccion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                placeholder="Dirección completa"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Estado</label>
              <select
                value={formData.estado || 'activo'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estado: e.target.value as MockBanco['estado'],
                  })
                }
                className={styles.formSelect}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contacto@banco.com"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Teléfono</label>
              <input
                type="text"
                value={formData.telefono || ''}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="+52 55 1234 5678"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Sitio Web</label>
              <input
                type="text"
                value={formData.sitioWeb || ''}
                onChange={(e) =>
                  setFormData({ ...formData, sitioWeb: e.target.value })
                }
                placeholder="https://www.banco.com"
                className={styles.formInput}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#374151',
              }}
            >
              Tasas de Interés
            </h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Tasa Mínima (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tasaInteresMin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasaInteresMin: Number(e.target.value),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Tasa Máxima (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tasaInteresMax || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasaInteresMax: Number(e.target.value),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Plazo Mínimo (meses)</label>
                <input
                  type="number"
                  value={formData.plazoMinimo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazoMinimo: Number(e.target.value),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Plazo Máximo (meses)</label>
                <input
                  type="number"
                  value={formData.plazoMaximo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazoMaximo: Number(e.target.value),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#374151',
              }}
            >
              Montos
            </h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Monto Mínimo (MXN)</label>
                <input
                  type="number"
                  value={formData.montoMinimo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      montoMinimo: Number(e.target.value),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Monto Máximo (MXN)</label>
                <input
                  type="number"
                  value={formData.montoMaximo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      montoMaximo: Number(e.target.value),
                    })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              onClick={() => navigate(ROUTES.BANCOS)}
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
