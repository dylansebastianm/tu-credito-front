/**
 * Creditos List Page - Tu Crédito Frontend
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCreditCard } from 'react-icons/fa';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Breadcrumb } from '../../components/ui/Breadcrumb/Breadcrumb';
import { setDocumentMeta } from '../../utils/meta';
import { creditosService } from '../../services/creditos.service';
import type { CreditoListItem } from '../../types/credito';
import { formatCurrency, formatDate } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { Table } from '../../components/ui/Table/Table';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { Alert } from '../../components/ui/Alert/Alert';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { ApiError, getErrorMessage } from '../../utils/error';
import styles from './Creditos.module.css';

/**
 * CreditosListPage component
 * Página de lista de créditos
 */
export function CreditosListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [creditos, setCreditos] = useState<CreditoListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoCredito, setFilterTipoCredito] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const pageSize = 20;
  const prevFiltersRef = useRef({ searchTerm: '', filterTipoCredito: 'all' });

  useEffect(() => {
    setDocumentMeta({
      title: 'Créditos',
      description: 'Gestión de créditos',
    });
  }, []);

  // Función para cargar créditos
  const loadCreditos = useCallback(async () => {
    setError(null);
    try {
      // Detectar si los filtros cambiaron
      const filtersChanged = 
        prevFiltersRef.current.searchTerm !== searchTerm ||
        prevFiltersRef.current.filterTipoCredito !== filterTipoCredito;
      
      // Si los filtros cambiaron, usar página 1; si no, usar currentPage
      const pageToUse = filtersChanged ? 1 : currentPage;
      
      // Actualizar referencia de filtros anteriores
      prevFiltersRef.current = { searchTerm, filterTipoCredito };
      
      // Si los filtros cambiaron, resetear currentPage
      if (filtersChanged) {
        setCurrentPage(1);
      }
      
      const params: Parameters<typeof creditosService.getAll>[0] = {
        page: pageToUse,
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
    }
  }, [searchTerm, filterTipoCredito, currentPage]);

  // Cargar créditos desde el backend
  useEffect(() => {
    // Debounce para la búsqueda (solo cuando cambia searchTerm o filterTipoCredito)
    const timeoutId = setTimeout(() => {
      loadCreditos();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterTipoCredito, currentPage, loadCreditos]);

  const handleViewDetail = (credito: CreditoListItem) => {
    navigate(ROUTES.CREDITO_DETAIL(credito.id.toString()));
  };

  const handleEdit = (credito: CreditoListItem) => {
    navigate(ROUTES.CREDITO_NUEVO, { state: { credito } });
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await creditosService.delete(itemToDelete);
      setAlertMessage('Crédito eliminado exitosamente');
      setShowAlert(true);
      // Recargar la lista
      await loadCreditos();
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al eliminar el crédito. Por favor, intenta nuevamente.';
      setErrorAlertMessage(errorMessage);
      setShowErrorAlert(true);
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
    <>
      <Alert
        type="success"
        title={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Alert
        type="error"
        title={errorAlertMessage}
        isVisible={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
      />
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Crédito"
        message="¿Está seguro de eliminar este crédito? Esta acción no se puede deshacer."
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <div className={styles.container}>
      <Breadcrumb
        items={[
          { label: 'Inicio', route: ROUTES.DASHBOARD },
          { label: 'Créditos' },
        ]}
      />

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
            <div style={{ marginBottom: '16px' }}>
              {(() => {
                const startIndex = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
                const endIndex = Math.min(currentPage * pageSize, totalCount);
                return totalCount > 0
                  ? `Mostrando ${startIndex}-${endIndex} de ${totalCount} créditos`
                  : 'No hay créditos para mostrar';
              })()}
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
          {creditos.length === 0 ? (
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
                      <MdVisibility />
                    </button>
                    <button
                      onClick={() => handleEdit(credito)}
                      className={styles.actionButton}
                      title="Editar"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(credito.id)}
                      className={styles.actionButton}
                      title="Eliminar"
                    >
                      <MdDelete />
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
