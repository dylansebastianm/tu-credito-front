/**
 * Bancos List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBuilding } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { setDocumentMeta } from '../../utils/meta';
import { mockBancos, type MockBanco } from '../../data/mock-data';
import { formatPercent, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
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
    navigate(ROUTES.BANCO_NUEVO, { state: { banco } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este banco?')) {
      setBancos(bancos.filter((b) => b.id !== id));
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
        <span className={styles.breadcrumbCurrent}>Bancos</span>
      </nav>

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Bancos</h1>
            <p className={styles.subtitle}>Gestión de bancos del sistema</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.BANCO_NUEVO)}
            className={styles.primaryButton}
          >
            <FaPlus />
            Nuevo Banco
          </button>
        </div>
      </div>

      <Table
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: 'Buscar por nombre o código...',
        }}
        filter={{
          value: filterEstado,
          onChange: setFilterEstado,
          options: [
            { value: 'all', label: 'Todos los estados' },
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ],
        }}
        footer={<>Mostrando {filteredBancos.length} de {bancos.length} bancos</>}
      >
        <thead>
          <tr>
            <th>Banco</th>
            <th>Código</th>
            <th>Tasa de Interés</th>
            <th>Créditos</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredBancos.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className={styles.emptyState}>
                  <FaBuilding className={styles.emptyIcon} />
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
                  <span className={styles.cellPrimary}>{banco.nombre}</span>
                </td>
                <td className={styles.cellCode}>{banco.codigo}</td>
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
                      <HiOutlineEye />
                    </button>
                    <button
                      onClick={() => handleEdit(banco)}
                      className={styles.actionButton}
                      title="Editar"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      onClick={() => handleDelete(banco.id)}
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
