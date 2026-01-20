/**
 * Cliente Create Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
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
  const location = useLocation();
  const isEdit = location.state?.cliente !== undefined;
  const existingCliente = location.state?.cliente as MockCliente | undefined;

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<MockCliente>>({
    nombre: existingCliente?.nombre || '',
    apellido: existingCliente?.apellido || '',
    email: existingCliente?.email || '',
    telefono: existingCliente?.telefono || '',
    direccion: existingCliente?.direccion || '',
    ciudad: existingCliente?.ciudad || '',
    fechaNacimiento: existingCliente?.fechaNacimiento || '',
    dni: existingCliente?.dni || '',
    estado: existingCliente?.estado || 'pendiente',
  });

  useEffect(() => {
    setDocumentMeta({
      title: isEdit ? 'Editar Cliente' : 'Nuevo Cliente',
      description: isEdit ? 'Modificar datos del cliente' : 'Crear nuevo cliente',
    });
  }, [isEdit]);

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

        <div className={styles.formBody}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Información Personal</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nombre <span className={styles.required}>*</span></label>
                <input type="text" value={formData.nombre || ""} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Nombre" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Apellido <span className={styles.required}>*</span></label>
                <input type="text" value={formData.apellido || ""} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} placeholder="Apellido" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>DNI/CURP <span className={styles.required}>*</span></label>
                <input type="text" value={formData.dni || ""} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} placeholder="DNI o CURP" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Fecha de Nacimiento</label>
                <input type="date" value={formData.fechaNacimiento || ""} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Estado</label>
                <select value={formData.estado || "pendiente"} onChange={(e) => setFormData({ ...formData, estado: e.target.value as MockCliente["estado"] })} className={styles.formSelect}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Contacto</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Email <span className={styles.required}>*</span></label>
                <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="correo@ejemplo.com" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Teléfono</label>
                <input type="text" value={formData.telefono || ""} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} placeholder="+52 55 1234 5678" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Dirección</label>
                <input type="text" value={formData.direccion || ""} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} placeholder="Calle y numero" className={styles.formInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Ciudad</label>
                <input type="text" value={formData.ciudad || ""} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} placeholder="Ciudad" className={styles.formInput} />
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
