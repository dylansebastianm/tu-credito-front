/**
 * Cliente Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { type MockCliente } from '../../data/mock-data';
import { ROUTES } from '../../app/config/constants';
import styles from './Clientes.module.css';

/**
 * ClienteCreatePage component
 * Página de creación de cliente
 */
export function ClienteCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MockCliente>>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    fechaNacimiento: '',
    dni: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    setDocumentMeta({
      title: 'Nuevo Cliente',
      description: 'Crear nuevo cliente',
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // TODO: Implementar lógica real con servicio
    // Por ahora solo redirigir
    setSaving(false);
    navigate(ROUTES.CLIENTES);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.CLIENTES)}
          className={styles.secondaryButton}
        >
          <ArrowLeft className={styles.buttonIcon} />
          Volver
        </button>
        <h1 className={styles.title}>Nuevo Cliente</h1>
        <p className={styles.subtitle}>Completa los datos del nuevo cliente</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Apellido
              </label>
              <input
                type="text"
                value={formData.apellido || ''}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                placeholder="Apellido"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="correo@ejemplo.com"
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
              <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                DNI/CURP
              </label>
              <input
                type="text"
                value={formData.dni || ''}
                onChange={(e) =>
                  setFormData({ ...formData, dni: e.target.value })
                }
                placeholder="DNI o CURP"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.fechaNacimiento || ''}
                onChange={(e) =>
                  setFormData({ ...formData, fechaNacimiento: e.target.value })
                }
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Dirección</label>
              <input
                type="text"
                value={formData.direccion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                placeholder="Calle y numero"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Ciudad</label>
              <input
                type="text"
                value={formData.ciudad || ''}
                onChange={(e) =>
                  setFormData({ ...formData, ciudad: e.target.value })
                }
                placeholder="Ciudad"
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
                    estado: e.target.value as MockCliente['estado'],
                  })
                }
                className={styles.formSelect}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              onClick={() => navigate(ROUTES.CLIENTES)}
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
