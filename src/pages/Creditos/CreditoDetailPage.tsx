/**
 * Credito Detail Page - Tu Crédito Frontend
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { creditosService } from '../../services/creditos.service';
import type { Credito } from '../../types/credito';
import { ROUTES } from '../../app/config/constants';
import { CreditDetailCard } from '../../components/domain/CreditDetailCard/CreditDetailCard';
import { getErrorMessage } from '../../utils/error';
import styles from './Creditos.module.css';

/**
 * CreditoDetailPage component
 * Página de detalle de crédito
 */
export function CreditoDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [credito, setCredito] = useState<Credito | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCredito = async () => {
      if (!id) {
        setError('ID de crédito no proporcionado');
        return;
      }

      const creditoId = parseInt(id, 10);
      if (isNaN(creditoId)) {
        setError('ID de crédito inválido');
        return;
      }

      setError(null);

      try {
        const data = await creditosService.getById(creditoId);
        setCredito(data);
        setDocumentMeta({
          title: `Crédito ${data.id}`,
          description: `Detalle del crédito ${data.id}`,
        });
      } catch (err) {
        const errorMessage = getErrorMessage(err) || 'Error al cargar el crédito. Por favor, intenta nuevamente.';
        setError(errorMessage);
        console.error('Error loading credito:', err);
      }
    };

    loadCredito();
  }, [id]);

  if (error || !credito) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>
            {error || 'Crédito no encontrado'}
          </p>
          <button
            onClick={() => navigate(ROUTES.CREDITOS)}
            className={styles.primaryButton}
          >
            Volver a Créditos
          </button>
        </div>
      </div>
    );
  }

  // Usar valores del backend (ya calculados)
  const monto = parseFloat(credito.pago_maximo);
  const tasaInteres = parseFloat(credito.tasa_interes);
  const cuotaMensual = parseFloat(credito.cuota_mensual);
  const montoTotal = parseFloat(credito.monto_total);

  return (
    <div className={styles.container}>
      <CreditDetailCard
        id={credito.id.toString()}
        status="activo" // El backend no tiene estado, asumimos activo
        clienteNombre={credito.cliente_info?.nombre_completo || `Cliente ${credito.cliente}`}
        clienteId={credito.cliente.toString()}
        bancoNombre={credito.banco_info?.nombre || `Banco ${credito.banco}`}
        bancoId={credito.banco.toString()}
        monto={monto}
        tasaInteres={tasaInteres}
        plazoMeses={credito.plazo_meses}
        cuotaMensual={cuotaMensual}
        montoTotal={montoTotal}
        fechaSolicitud={credito.fecha_registro}
        fechaAprobacion={credito.created_at}
        fechaVencimiento={undefined} // El backend no tiene este campo
        proposito={credito.descripcion}
        observaciones={undefined} // El backend no tiene este campo
        onBack={() => navigate(ROUTES.CREDITOS)}
        onEdit={() => navigate(ROUTES.CREDITO_NUEVO, { state: { credito } })}
      />
    </div>
  );
}
