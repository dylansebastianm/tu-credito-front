/**
 * Clientes List Page - Tu Crédito Frontend
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
  Users,
} from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockClientes, type MockCliente } from '../../data/mock-data';
import { getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Clientes.module.css';

/**
 * ClientesListPage component
 * Página de lista de clientes
 */
export function ClientesListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<MockCliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  useEffect(() => {
    setDocumentMeta({
      title: 'Clientes',
      description: 'Gestión de clientes',
    });
  }, []);

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.dni.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado =
        filterEstado === 'all' || cliente.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [clientes, searchTerm, filterEstado]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
        return styles.badgeGreen;
      case 'inactivo':
        return styles.badgeRed;
      case 'pendiente':
        return styles.badgeYellow;
      default:
        return styles.badgeGray;
    }
  };

  const handleViewDetail = (cliente: MockCliente) => {
    navigate(ROUTES.CLIENTE_DETAIL(cliente.id));
  };

  const handleEdit = (cliente: MockCliente) => {
    navigate(ROUTES.CLIENTE_DETAIL(cliente.id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Clientes</h1>
            <p className={styles.subtitle}>Gestión de clientes del sistema</p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => navigate(ROUTES.CLIENTE_NUEVO)}
              className={styles.primaryButton}
            >
              <Plus className={styles.buttonIcon} />
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o DNI..."
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
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Créditos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <Users className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>No se encontraron clientes</p>
                      <p className={styles.emptyText}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className={styles.cellPrimary}>
                        {cliente.nombre} {cliente.apellido}
                      </div>
                      <div className={styles.cellSecondary}>{cliente.dni}</div>
                    </td>
                    <td>{cliente.email}</td>
                    <td>{cliente.ciudad}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${getEstadoBadgeClass(cliente.estado)}`}
                      >
                        {getEstadoLabel(cliente.estado)}
                      </span>
                    </td>
                    <td>{cliente.creditosActivos}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleViewDetail(cliente)}
                          className={styles.actionButton}
                          title="Ver detalle"
                        >
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleEdit(cliente)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
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
            Mostrando {filteredClientes.length} de {clientes.length} clientes
          </span>
        </div>
      </div>
    </div>
  );
}
