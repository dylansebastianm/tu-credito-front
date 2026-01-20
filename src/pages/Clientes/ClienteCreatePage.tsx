/**
 * Cliente Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { setDocumentMeta } from '../../utils/meta';
import { clientesService } from '../../services/clientes.service';
import type { Cliente, ClienteCreate, ClienteListItem } from '../../types/cliente';
import { ROUTES } from '../../app/config/constants';
import { ApiError } from '../../utils/error';
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
    // Validaciones básicas
    if (!formData.nombre_completo.trim()) {
      setError('El nombre completo es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!formData.fecha_nacimiento) {
      setError('La fecha de nacimiento es requerida');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit && existingCliente && 'id' in existingCliente) {
        await clientesService.update(existingCliente.id, formData);
      } else {
        await clientesService.create(formData);
      }
      navigate(ROUTES.CLIENTES);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al guardar el cliente. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error saving cliente:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <span className={styles.breadcrumbLink} onClick={() => navigate(ROUTES.DASHBOARD)}>Inicio</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbLink} onClick={() => navigate(ROUTES.CLIENTES)}>Clientes</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? 'Editar' : 'Nuevo'}</span>
      </nav>

      <button onClick={() => navigate(ROUTES.CLIENTES)} className={styles.backButton}>
        <FaArrowLeft />
        Volver
      </button>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <p className={styles.formSubtitle}>
            {isEdit ? 'Modifica los datos del cliente' : 'Completa los datos del nuevo cliente'}
          </p>
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
                <label className={styles.formLabel}>
                  Nombre Completo <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre_completo: e.target.value })
                  }
                  placeholder="Nombre completo del cliente"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Fecha de Nacimiento <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_nacimiento: e.target.value })
                  }
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Tipo de Persona</label>
                <select
                  value={formData.tipo_persona}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_persona: e.target.value as 'NATURAL' | 'JURIDICO',
                    })
                  }
                  className={styles.formSelect}
                >
                  <option value="NATURAL">Persona Natural</option>
                  <option value="JURIDICO">Persona Jurídica</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nacionalidad</label>
                <input
                  type="text"
                  value={formData.nacionalidad || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, nacionalidad: e.target.value })
                  }
                  placeholder="Ej: Mexicana"
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Contacto</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className={styles.formInput}
                  required
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
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>Dirección</label>
                <input
                  type="text"
                  value={formData.direccion || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Calle y número, Colonia, Ciudad"
                  className={styles.formInput}
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
  );
}
