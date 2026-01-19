/**
 * Creditos List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CreditCard,
} from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockCreditos, type MockCredito } from '../../data/mock-data';
import { formatCurrency, formatDate, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
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
    navigate(ROUTES.CREDITO_DETAIL(credito.id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este crédito?')) {
      setCreditos(creditos.filter((c) => c.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Créditos</h1>
            <p className={styles.subtitle}>Gestión de créditos del sistema</p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => navigate(ROUTES.CREDITO_NUEVO)}
              className={styles.primaryButton}
            >
              <Plus className={styles.buttonIcon} />
              Nuevo Crédito
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por cliente, banco o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${styles.searchInput} ${styles.input}`}
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className={`${styles.filterSelect} ${styles.select}`}
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="activo">Activo</option>
          <option value="rechazado">Rechazado</option>
          <option value="pagado">Pagado</option>
          <option value="vencido">Vencido</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Banco</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCreditos.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <CreditCard className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>
                        No se encontraron créditos
                      </p>
                      <p className={styles.emptyText}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCreditos.map((credito) => (
                  <tr key={credito.id}>
                    <td className={styles.cellPrimary}>{credito.id}</td>
                    <td>{credito.clienteNombre}</td>
                    <td>{credito.bancoNombre}</td>
                    <td>{formatCurrency(credito.monto)}</td>
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
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleEdit(credito)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(credito.id)}
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          title="Eliminar"
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Mostrando {filteredCreditos.length} de {creditos.length} créditos
          </span>
        </div>
      </div>
    </div>
  );
}
