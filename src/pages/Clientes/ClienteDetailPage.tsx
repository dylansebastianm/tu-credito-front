/**
 * Cliente Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { clientesService } from '../../services/clientes.service';
import type { Cliente } from '../../types/cliente';
import { formatDate } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { CustomerDetailCard } from '../../components/domain/CustomerDetailCard/CustomerDetailCard';
import { ApiError } from '../../utils/error';
import styles from './Clientes.module.css';

/**
 * ClienteDetailPage component
 * Página de detalle de cliente
 */
export function ClienteDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCliente = async () => {
      if (!id) {
        setError('ID de cliente no proporcionado');
        setLoading(false);
        return;
      }

      const clienteId = parseInt(id, 10);
      if (isNaN(clienteId)) {
        setError('ID de cliente inválido');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await clientesService.getById(clienteId);
        setCliente(data);
        setDocumentMeta({
          title: data.nombre_completo,
          description: `Detalle del cliente ${data.nombre_completo}`,
        });
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Error al cargar el cliente. Por favor, intenta nuevamente.';
        setError(errorMessage);
        console.error('Error loading cliente:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCliente();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Cargando cliente...</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>
            {error || 'Cliente no encontrado'}
          </p>
          <button
            onClick={() => navigate(ROUTES.CLIENTES)}
            className={styles.primaryButton}
          >
            Volver a Clientes
          </button>
        </div>
      </div>
    );
  }

  // Adaptar datos del backend al formato que espera CustomerDetailCard
  // Nota: El backend no tiene "creditosActivos" ni "montoTotalCreditos" en el detalle
  // Por ahora usamos valores por defecto, pero idealmente deberíamos obtenerlos de otra fuente
  return (
    <div className={styles.container}>
      <CustomerDetailCard
        customer={{
          name: cliente.nombre_completo,
          curp: cliente.nacionalidad || 'N/A', // El backend no tiene CURP, usamos nacionalidad como placeholder
          status: 'activo', // El backend no tiene estado, asumimos activo
          activeCredits: 0, // TODO: Obtener de créditos asociados
          totalCreditAmount: 0, // TODO: Obtener de créditos asociados
          registrationDate: cliente.created_at
            ? formatDate(cliente.created_at)
            : 'N/A',
          birthDate: formatDate(cliente.fecha_nacimiento),
          email: cliente.email,
          phone: cliente.telefono || 'N/A',
          address: cliente.direccion || 'N/A',
          city: cliente.direccion || 'N/A', // El backend no tiene ciudad separada
        }}
        onBack={() => navigate(ROUTES.CLIENTES)}
        onEdit={() => navigate(ROUTES.CLIENTE_NUEVO, { state: { cliente } })}
      />
    </div>
  );
}
