/**
 * Creditos List Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCreditCard } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { setDocumentMeta } from '../../utils/meta';
import { creditosService } from '../../services/creditos.service';
import type { CreditoListItem } from '../../types/credito';
import { formatCurrency, formatDate } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
import { ApiError } from '../../utils/error';
import styles from './Creditos.module.css';

/**
 * CreditosListPage component
 * Página de lista de créditos
 */
export function CreditosListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [creditos, setCreditos] = useState<CreditoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoCredito, setFilterTipoCredito] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setDocumentMeta({
      title: 'Créditos',
      description: 'Gestión de créditos',
    });
  }, []);

  const loadCreditos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof creditosService.getAll>[0] = {
        page: currentPage,
        page_size: pageSize,
        ordering: '-fecha_registro',
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filterTipoCredito !== 'all') {
        params.tipo_credito = filterTipoCredito as 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
      }

      const response = await creditosService.getAll(params);
      setCreditos(response.results);
      setTotalCount(response.count);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al cargar los créditos. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error loading creditos:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterTipoCredito, currentPage]);

  useEffect(() => {
    loadCreditos();
  }, [loadCreditos]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadCreditos();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewDetail = (credito: CreditoListItem) => {
    navigate(ROUTES.CREDITO_DETAIL(credito.id.toString()));
  };

  const handleEdit = (credito: CreditoListItem) => {
    navigate(ROUTES.CREDITO_NUEVO, { state: { credito } });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este crédito?')) {
      return;
    }

    try {
      await creditosService.delete(id);
      // Recargar la lista
      await loadCreditos();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Error al eliminar el crédito. Por favor, intenta nuevamente.';
      alert(errorMessage);
      console.error('Error deleting credito:', err);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Créditos</h1>
        </div>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={loadCreditos} className={styles.primaryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          placeholder: 'Buscar por cliente, banco o descripción...',
        }}
        filter={{
          value: filterTipoCredito,
          onChange: setFilterTipoCredito,
          options: [
            { value: 'all', label: 'Todos los tipos' },
            { value: 'AUTOMOTRIZ', label: 'Automotriz' },
            { value: 'HIPOTECARIO', label: 'Hipotecario' },
            { value: 'COMERCIAL', label: 'Comercial' },
          ],
        }}
        footer={
          <>
            {loading ? (
              'Cargando...'
            ) : (
              <>
                Mostrando {creditos.length} de {totalCount} créditos
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
            <th>ID</th>
            <th>Cliente</th>
            <th>Banco</th>
            <th>Descripción</th>
            <th>Monto (Min-Max)</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                Cargando créditos...
              </td>
            </tr>
          ) : creditos.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <div className={styles.emptyState}>
                  <FaCreditCard className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>No se encontraron créditos</p>
                  <p className={styles.emptyText}>
                    {searchTerm || filterTipoCredito !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Crea tu primer crédito para comenzar'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            creditos.map((credito) => (
              <tr key={credito.id}>
                <td className={styles.cellCode}>#{credito.id}</td>
                <td>{credito.cliente_nombre}</td>
                <td>{credito.banco_nombre}</td>
                <td>{credito.descripcion}</td>
                <td className={styles.cellMoney}>
                  {formatCurrency(parseFloat(credito.pago_minimo))} -{' '}
                  {formatCurrency(parseFloat(credito.pago_maximo))}
                </td>
                <td>
                  <span className={styles.badge}>
                    {credito.tipo_credito_display || credito.tipo_credito}
                  </span>
                </td>
                <td>{formatDate(credito.fecha_registro)}</td>
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
