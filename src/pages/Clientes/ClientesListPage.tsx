/**
 * Clientes List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { setDocumentMeta } from '../../utils/meta';
import { clientesService } from '../../services/clientes.service';
import type { ClienteListItem } from '../../types/cliente';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
import { ApiError } from '../../utils/error';
import styles from './Clientes.module.css';

/**
 * ClientesListPage component
 * Página de lista de clientes
 */
export function ClientesListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoPersona, setFilterTipoPersona] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setDocumentMeta({
      title: 'Clientes',
      description: 'Gestión de clientes',
    });
  }, []);

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof clientesService.getAll>[0] = {
        page: currentPage,
        page_size: pageSize,
        ordering: 'nombre_completo',
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filterTipoPersona !== 'all') {
        params.tipo_persona = filterTipoPersona as 'NATURAL' | 'JURIDICO';
      }

      const response = await clientesService.getAll(params);
      setClientes(response.results);
      setTotalCount(response.count);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al cargar los clientes. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error loading clientes:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterTipoPersona, currentPage]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadClientes();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewDetail = (cliente: ClienteListItem) => {
    navigate(ROUTES.CLIENTE_DETAIL(cliente.id.toString()));
  };

  const handleEdit = (cliente: ClienteListItem) => {
    navigate(ROUTES.CLIENTE_NUEVO, { state: { cliente } });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este cliente?')) {
      return;
    }

    try {
      await clientesService.delete(id);
      // Recargar la lista
      await loadClientes();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al eliminar el cliente. Por favor, intenta nuevamente.';
      alert(errorMessage);
      console.error('Error deleting cliente:', err);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Clientes</h1>
        </div>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={loadClientes} className={styles.primaryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <span className={styles.breadcrumbLink} onClick={() => navigate(ROUTES.DASHBOARD)}>Inicio</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Clientes</span>
      </nav>

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Clientes</h1>
            <p className={styles.subtitle}>Gestión de clientes del sistema</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.CLIENTE_NUEVO)}
            className={styles.primaryButton}
          >
            <FaPlus />
            Nuevo Cliente
          </button>
        </div>
      </div>

      <Table
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: 'Buscar por nombre, email o teléfono...',
        }}
        filter={{
          value: filterTipoPersona,
          onChange: setFilterTipoPersona,
          options: [
            { value: 'all', label: 'Todos los tipos' },
            { value: 'NATURAL', label: 'Persona Natural' },
            { value: 'JURIDICO', label: 'Persona Jurídica' },
          ],
        }}
        footer={
          <>
            {loading ? (
              'Cargando...'
            ) : (
              <>
                Mostrando {clientes.length} de {totalCount} clientes
                {totalCount > pageSize && (
                  <>
                    {' | '}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      Anterior
                    </button>
                    {' | Página '}
                    {currentPage}
                    {' | '}
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(Math.ceil(totalCount / pageSize), p + 1)
                        )
                      }
                      disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                      className={styles.paginationButton}
                    >
                      Siguiente
                    </button>
                  </>
                )}
              </>
            )}
          </>
        }
      >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Tipo</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                Cargando clientes...
              </td>
            </tr>
          ) : clientes.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className={styles.emptyState}>
                  <FaUsers className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>No se encontraron clientes</p>
                  <p className={styles.emptyText}>
                    {searchTerm || filterTipoPersona !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Crea tu primer cliente para comenzar'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <div className={styles.cellPrimary}>
                    {cliente.nombre_completo}
                  </div>
                </td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono || '—'}</td>
                <td>{cliente.edad} años</td>
                <td>
                  <span className={styles.badge}>
                    {cliente.tipo_persona_display || cliente.tipo_persona}
                  </span>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      onClick={() => handleViewDetail(cliente)}
                      className={styles.actionButton}
                      title="Ver detalle"
                    >
                      <HiOutlineEye />
                    </button>
                    <button
                      onClick={() => handleEdit(cliente)}
                      className={styles.actionButton}
                      title="Editar"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className={styles.actionButton}
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
