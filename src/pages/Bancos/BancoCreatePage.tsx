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
    // Validaciones básicas
    if (!formData.nombre || !formData.nombre.trim()) {
      setError('El nombre del banco es requerido');
      return;
    }

    if (!formData.codigo || !formData.codigo.trim()) {
      setError('El código del banco es requerido');
      return;
    }

    // Validar tasas
    if (formData.tasa_interes_min && formData.tasa_interes_max) {
      if (formData.tasa_interes_min > formData.tasa_interes_max) {
        setError('La tasa mínima no puede ser mayor que la tasa máxima');
        return;
      }
    }

    // Validar plazos
    if (formData.plazo_minimo && formData.plazo_maximo) {
      if (formData.plazo_minimo > formData.plazo_maximo) {
        setError('El plazo mínimo no puede ser mayor que el plazo máximo');
        return;
      }
    }

    // Validar montos
    if (formData.monto_minimo && formData.monto_maximo) {
      if (formData.monto_minimo > formData.monto_maximo) {
        setError('El monto mínimo no puede ser mayor que el monto máximo');
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);

      if (isEdit && existingBanco) {
        await bancosService.updateFull(existingBanco.id, formData);
      } else {
        await bancosService.create(formData);
      }

      navigate(ROUTES.BANCOS);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Error al guardar el banco. Por favor, intenta nuevamente.'
      );
      console.error('Error saving banco:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
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
                <label className={styles.formLabel}>
                  Nombre del Banco <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Nombre del banco"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Código <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  placeholder="Ej: BN001"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Tipo <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo: e.target.value as 'PRIVADO' | 'GOBIERNO',
                    })
                  }
                  className={styles.formSelect}
                  required
                >
                  <option value="PRIVADO">Privado</option>
                  <option value="GOBIERNO">Gobierno</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Estado</label>
                <select
                  value={formData.estado || 'activo'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as 'activo' | 'inactivo',
                    })
                  }
                  className={styles.formSelect}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
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
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Contacto</h3>
            <div className={styles.formGrid}>
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
                <label className={styles.formLabel}>Tasa Mínima (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.tasa_interes_min || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasa_interes_min: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Tasa Máxima (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.tasa_interes_max || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasa_interes_max: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Plazo Mínimo (meses)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.plazo_minimo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazo_minimo: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Plazo Máximo (meses)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.plazo_maximo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazo_maximo: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Montos</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Monto Mínimo (MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto_minimo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto_minimo: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Monto Máximo (MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto_maximo || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto_maximo: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.formInput}
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
  );
}
