/**
 * Credito Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { mockCreditos, type MockCredito } from '../../data/mock-data';
import { ROUTES } from '../../app/config/constants';
import { CreditDetailCard } from '../../components/domain/CreditDetailCard/CreditDetailCard';
import styles from './Creditos.module.css';

/**
 * CreditoDetailPage component
 * Página de detalle de crédito
 */
export function CreditoDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [credito, setCredito] = useState<MockCredito | null>(null);

  useEffect(() => {
    if (id) {
      const foundCredito = mockCreditos.find((c) => c.id === id);
      setCredito(foundCredito || null);

      if (foundCredito) {
        setDocumentMeta({
          title: `Crédito ${foundCredito.id}`,
          description: `Detalle del crédito ${foundCredito.id}`,
        });
      }
    }
  }, [id]);

  if (!credito) {
    return (
      <div className={styles.container}>
        <p>Crédito no encontrado</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CreditDetailCard
        id={credito.id}
        status={credito.estado}
        clienteNombre={credito.clienteNombre}
        clienteId={credito.clienteId}
        bancoNombre={credito.bancoNombre}
        bancoId={credito.bancoId}
        monto={credito.monto}
        tasaInteres={credito.tasaInteres}
        plazoMeses={credito.plazoMeses}
        cuotaMensual={credito.cuotaMensual}
        montoTotal={credito.montoTotal}
        fechaSolicitud={credito.fechaSolicitud}
        fechaAprobacion={credito.fechaAprobacion}
        fechaVencimiento={credito.fechaVencimiento}
        proposito={credito.proposito}
        observaciones={credito.observaciones}
        onBack={() => navigate(ROUTES.CREDITOS)}
        onEdit={() => navigate(ROUTES.CREDITO_NUEVO, { state: { credito } })}
      />
    </div>
  );
}
