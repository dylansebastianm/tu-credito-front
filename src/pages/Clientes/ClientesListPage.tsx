/**
 * Clientes List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { Breadcrumb } from '../../components/ui/Breadcrumb/Breadcrumb';
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
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { getErrorMessage } from '../../utils/error';
import { Alert } from '../../components/ui/Alert/Alert';
import styles from './Clientes.module.css';

/**
 * ClientesListPage component
 * Página de lista de clientes
 */
export function ClientesListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoPersona, setFilterTipoPersona] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const pageSize = 20;

  useEffect(() => {
    setDocumentMeta({
      title: 'Clientes',
      description: 'Gestión de clientes',
    });
  }, []);

  const loadClientes = useCallback(async () => {
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
      const errorMessage = getErrorMessage(err) || 'Error al cargar los clientes. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error loading clientes:', err);
    }
  }, [searchTerm, filterTipoPersona, currentPage]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadClientes();
      } else {
        setCurrentPage(1);
      }
    }, searchTerm ? 500 : 0); // Sin debounce si searchTerm está vacío

    return () => clearTimeout(timer);
  }, [searchTerm, filterTipoPersona, currentPage, loadClientes]);

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
      setAlertMessage('Cliente eliminado exitosamente');
      setShowAlert(true);
      // Recargar la lista
      await loadClientes();
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al eliminar el cliente. Por favor, intenta nuevamente.';
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
    <>
      <Alert
        type="success"
        title={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <div className={styles.container}>
        <Breadcrumb
        items={[
          { label: 'Inicio', route: ROUTES.DASHBOARD },
          { label: 'Clientes' },
        ]}
      />

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
            <div style={{ marginBottom: '16px' }}>
              Mostrando {clientes.length} de {totalCount} clientes
            </div>
            {totalCount > pageSize && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / pageSize)}
                onPageChange={setCurrentPage}
              />
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
          {clientes.length === 0 ? (
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
    </>
  );
}
