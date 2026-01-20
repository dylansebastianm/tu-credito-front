/**
 * Bancos List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBuilding } from 'react-icons/fa';
import { Breadcrumb } from '../../components/ui/Breadcrumb/Breadcrumb';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { setDocumentMeta } from '../../utils/meta';
import { formatPercent, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { bancosService } from '../../services/bancos.service';
import type { BancoListItem } from '../../types/banco';
import styles from './Bancos.module.css';
import { Alert } from '../../components/ui/Alert/Alert';

/**
 * BancosListPage component
 * Página de lista de bancos
 */
export function BancosListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [bancos, setBancos] = useState<BancoListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    setDocumentMeta({
      title: 'Bancos',
      description: 'Gestión de bancos',
    });
  }, []);

  // Cargar bancos desde el backend
  useEffect(() => {
    const loadBancos = async () => {
      try {
        setError(null);
        const response = await bancosService.getAll({
          page: currentPage,
          page_size: 20,
          search: searchTerm || undefined,
          estado: filterEstado !== 'all' ? (filterEstado as 'activo' | 'inactivo') : undefined,
        });
        setBancos(response.results);
        setTotalCount(response.count);
      } catch (err) {
        setError('Error al cargar los bancos. Por favor, intenta nuevamente.');
        console.error('Error loading bancos:', err);
      }
    };

    // Debounce para la búsqueda
    const timeoutId = setTimeout(() => {
      loadBancos();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterEstado, currentPage]);

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

  const handleViewDetail = (banco: BancoListItem) => {
    navigate(ROUTES.BANCO_DETAIL(banco.id));
  };

  const handleEdit = (banco: BancoListItem) => {
    navigate(ROUTES.BANCO_NUEVO, { state: { banco } });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este banco?')) {
      try {
        await bancosService.delete(id);
        setAlertMessage('Banco eliminado exitosamente');
        setShowAlert(true);
        // Recargar la lista
        const response = await bancosService.getAll({
          page: currentPage,
          page_size: 20,
          search: searchTerm || undefined,
          estado: filterEstado !== 'all' ? (filterEstado as 'activo' | 'inactivo') : undefined,
        });
        setBancos(response.results);
        setTotalCount(response.count);
      } catch (err) {
        alert('Error al eliminar el banco. Por favor, intenta nuevamente.');
        console.error('Error deleting banco:', err);
      }
    }
  };

  // El loading global se muestra automáticamente durante las peticiones
  // No mostramos nada aquí, solo el spinner global

  if (error && bancos.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
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
          { label: 'Bancos' },
        ]}
      />

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
        footer={
          <>
            <div style={{ marginBottom: '16px' }}>
              Mostrando {bancos.length} de {totalCount} bancos
            </div>
            {totalCount > 20 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / 20)}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        }
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
          {bancos.length === 0 ? (
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
            bancos.map((banco) => (
              <tr key={banco.id}>
                <td>
                  <span className={styles.cellPrimary}>{banco.nombre}</span>
                </td>
                <td className={styles.cellCode}>{banco.codigo}</td>
                <td>
                  {banco.tasa_interes_min && banco.tasa_interes_max
                    ? `${formatPercent(parseFloat(banco.tasa_interes_min))} - ${formatPercent(parseFloat(banco.tasa_interes_max))}`
                    : '—'}
                </td>
                <td>{banco.creditos_activos || 0}</td>
                <td>
                  <span
                    className={`${styles.badge} ${getEstadoBadgeClass(banco.estado)}`}
                  >
                    {banco.estado_display || getEstadoLabel(banco.estado)}
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
    </>
  );
}
