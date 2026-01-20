/**
 * Banco Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { mockBancos, type MockBanco } from '../../data/mock-data';
import { formatDate } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { BankDetailCard } from '../../components/domain/BankDetailCard/BankDetailCard';
import styles from './Bancos.module.css';

/**
 * BancoDetailPage component
 * Página de detalle de banco
 */
export function BancoDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banco, setBanco] = useState<MockBanco | null>(null);

  useEffect(() => {
    if (id) {
      const foundBanco = mockBancos.find((b) => b.id === id);
      setBanco(foundBanco || null);

      if (foundBanco) {
        setDocumentMeta({
          title: foundBanco.nombre,
          description: `Detalle del banco ${foundBanco.nombre}`,
        });
      }
    }
  }, [id]);

  if (!banco) {
    return (
      <div className={styles.container}>
        <p>Banco no encontrado</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BankDetailCard
        name={banco.nombre}
        code={banco.codigo}
        isActive={banco.estado === 'activo'}
        address={banco.direccion}
        registrationDate={formatDate(banco.fechaRegistro)}
        email={banco.email}
        phone={banco.telefono}
        website={banco.sitioWeb}
        minRate={banco.tasaInteresMin}
        maxRate={banco.tasaInteresMax}
        minTerm={banco.plazoMinimo}
        maxTerm={banco.plazoMaximo}
        minAmount={banco.montoMinimo}
        maxAmount={banco.montoMaximo}
        activeCredits={banco.creditosActivos}
        onBack={() => navigate(ROUTES.BANCOS)}
        onEdit={() => navigate(ROUTES.BANCO_NUEVO, { state: { banco } })}
      />
    </div>
  );
}
