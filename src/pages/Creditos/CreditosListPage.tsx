/**
 * Creditos List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCreditCard } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { setDocumentMeta } from '../../utils/meta';
import { mockCreditos, type MockCredito } from '../../data/mock-data';
import { formatCurrency, formatDate, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
import styles from './Creditos.module.css';

/**
 * CreditosListPage component
 * Página de lista de créditos
 */
export function CreditosListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [creditos, setCreditos] = useState<MockCredito[]>(mockCreditos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  useEffect(() => {
    setDocumentMeta({
      title: 'Créditos',
      description: 'Gestión de créditos',
    });
  }, []);

  const filteredCreditos = useMemo(() => {
    return creditos.filter((credito) => {
      const matchesSearch =
        credito.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credito.bancoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credito.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado =
        filterEstado === 'all' || credito.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [creditos, searchTerm, filterEstado]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'aprobado':
      case 'pagado':
        return styles.badgeGreen;
      case 'pendiente':
        return styles.badgeYellow;
      case 'rechazado':
      case 'vencido':
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  const handleViewDetail = (credito: MockCredito) => {
    navigate(ROUTES.CREDITO_DETAIL(credito.id));
  };

  const handleEdit = (credito: MockCredito) => {
    navigate(ROUTES.CREDITO_NUEVO, { state: { credito } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este crédito?')) {
      setCreditos(creditos.filter((c) => c.id !== id));
    }
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
        <span className={styles.breadcrumbCurrent}>Créditos</span>
      </nav>

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Créditos</h1>
            <p className={styles.subtitle}>Gestión de créditos del sistema</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.CREDITO_NUEVO)}
            className={styles.primaryButton}
          >
            <FaPlus />
            Nuevo Crédito
          </button>
        </div>
      </div>

      <Table
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: 'Buscar por cliente, banco o ID...',
        }}
        filter={{
          value: filterEstado,
          onChange: setFilterEstado,
          options: [
            { value: 'all', label: 'Todos los estados' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'aprobado', label: 'Aprobado' },
            { value: 'activo', label: 'Activo' },
            { value: 'rechazado', label: 'Rechazado' },
            { value: 'pagado', label: 'Pagado' },
            { value: 'vencido', label: 'Vencido' },
          ],
        }}
        footer={
          <>Mostrando {filteredCreditos.length} de {creditos.length} créditos</>
        }
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Banco</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCreditos.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className={styles.emptyState}>
                  <FaCreditCard className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>No hay créditos</p>
                  <p className={styles.emptyText}>
                    No se encontraron créditos con los filtros aplicados
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            filteredCreditos.map((credito) => (
              <tr key={credito.id}>
                <td className={styles.cellCode}>{credito.id}</td>
                <td>{credito.clienteNombre}</td>
                <td>{credito.bancoNombre}</td>
                <td className={styles.cellMoney}>{formatCurrency(credito.monto)}</td>
                <td>
                  <span
                    className={`${styles.badge} ${getEstadoBadgeClass(credito.estado)}`}
                  >
                    {getEstadoLabel(credito.estado)}
                  </span>
                </td>
                <td>{formatDate(credito.fechaSolicitud)}</td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      onClick={() => handleViewDetail(credito)}
                      className={styles.actionButton}
                      title="Ver detalle"
                    >
                      <HiOutlineEye />
                    </button>
                    <button
                      onClick={() => handleEdit(credito)}
                      className={styles.actionButton}
                      title="Editar"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      onClick={() => handleDelete(credito.id)}
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      title="Eliminar"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
