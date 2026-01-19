/**
 * Bancos List Page - Tu Crédito Frontend
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
  Building2,
} from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockBancos, type MockBanco } from '../../data/mock-data';
import { formatPercent, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Bancos.module.css';

/**
 * BancosListPage component
 * Página de lista de bancos
 */
export function BancosListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [bancos, setBancos] = useState<MockBanco[]>(mockBancos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  useEffect(() => {
    setDocumentMeta({
      title: 'Bancos',
      description: 'Gestión de bancos',
    });
  }, []);

  const filteredBancos = useMemo(() => {
    return bancos.filter((banco) => {
      const matchesSearch =
        banco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banco.codigo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = filterEstado === 'all' || banco.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [bancos, searchTerm, filterEstado]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
        return styles.badgeGreen;
      case 'inactivo':
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  const handleViewDetail = (banco: MockBanco) => {
    navigate(ROUTES.BANCO_DETAIL(banco.id));
  };

  const handleEdit = (banco: MockBanco) => {
    navigate(ROUTES.BANCO_DETAIL(banco.id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este banco?')) {
      setBancos(bancos.filter((b) => b.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Bancos</h1>
            <p className={styles.subtitle}>Gestión de bancos del sistema</p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => navigate(ROUTES.BANCO_NUEVO)}
              className={styles.primaryButton}
            >
              <Plus className={styles.buttonIcon} />
              Nuevo Banco
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
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
          <option value="all">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>Tasa Interés</th>
                <th>Créditos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBancos.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <Building2 className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>No se encontraron bancos</p>
                      <p className={styles.emptyText}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBancos.map((banco) => (
                  <tr key={banco.id}>
                    <td>
                      <div className={styles.cellPrimary}>{banco.nombre}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{banco.codigo}</td>
                    <td>
                      {formatPercent(banco.tasaInteresMin)} -{' '}
                      {formatPercent(banco.tasaInteresMax)}
                    </td>
                    <td>{banco.creditosActivos}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${getEstadoBadgeClass(banco.estado)}`}
                      >
                        {getEstadoLabel(banco.estado)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleViewDetail(banco)}
                          className={styles.actionButton}
                          title="Ver detalle"
                        >
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleEdit(banco)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(banco.id)}
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
            Mostrando {filteredBancos.length} de {bancos.length} bancos
          </span>
        </div>
      </div>
    </div>
  );
}
