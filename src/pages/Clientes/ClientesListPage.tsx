/**
 * Clientes List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { setDocumentMeta } from '../../utils/meta';
import { mockClientes, type MockCliente } from '../../data/mock-data';
import { getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
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
        return styles.badgeSuccess;
      case 'inactivo':
        return styles.badgeDanger;
      case 'pendiente':
        return styles.badgeWarning;
      default:
        return styles.badgeDefault;
    }
  };

  const handleViewDetail = (cliente: MockCliente) => {
    navigate(ROUTES.CLIENTE_DETAIL(cliente.id));
  };

  const handleEdit = (cliente: MockCliente) => {
    navigate(ROUTES.CLIENTE_NUEVO, { state: { cliente } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

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
          placeholder: 'Buscar por nombre, email o DNI...',
        }}
        filter={{
          value: filterEstado,
          onChange: setFilterEstado,
          options: [
            { value: 'all', label: 'Todos los estados' },
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
            { value: 'pendiente', label: 'Pendiente' },
          ],
        }}
        footer={
          <>Mostrando {filteredClientes.length} de {clientes.length} clientes</>
        }
      >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Ciudad</th>
            <th>Estado</th>
            <th>Créditos</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className={styles.emptyState}>
                  <FaUsers className={styles.emptyIcon} />
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
                  <div className={styles.cellCode}>{cliente.dni}</div>
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
