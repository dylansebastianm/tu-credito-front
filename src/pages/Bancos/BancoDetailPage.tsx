/**
 * Banco Detail Page - Tu Crédito Frontend
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { formatDate } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { BankDetailCard } from '../../components/domain/BankDetailCard/BankDetailCard';
import { bancosService } from '../../services/bancos.service';
import type { Banco } from '../../types/banco';
import styles from './Bancos.module.css';

/**
 * BancoDetailPage component
 * Página de detalle de banco
 */
export function BancoDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banco, setBanco] = useState<Banco | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBanco = async () => {
      if (!id) {
        setError('ID de banco no proporcionado');
        setLoading(false);
        return;
      }

      const bancoId = parseInt(id, 10);
      if (isNaN(bancoId)) {
        setError('ID de banco inválido');
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const bancoData = await bancosService.getById(bancoId);
        setBanco(bancoData);

        setDocumentMeta({
          title: bancoData.nombre,
          description: `Detalle del banco ${bancoData.nombre}`,
        });
      } catch (err) {
        setError('Error al cargar el banco. Por favor, intenta nuevamente.');
        console.error('Error loading banco:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBanco();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Cargando banco...</p>
        </div>
      </div>
    );
  }

  if (error || !banco) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p className={styles.errorText}>
            {error || 'Banco no encontrado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BankDetailCard
        name={banco.nombre}
        code={banco.codigo}
        isActive={banco.estado === 'activo'}
        address={banco.direccion || '—'}
        registrationDate={banco.created_at ? formatDate(banco.created_at) : '—'}
        email={banco.email || '—'}
        phone={banco.telefono || '—'}
        website={banco.sitio_web}
        minRate={banco.tasa_interes_min ? parseFloat(banco.tasa_interes_min) : 0}
        maxRate={banco.tasa_interes_max ? parseFloat(banco.tasa_interes_max) : 0}
        minTerm={banco.plazo_minimo || 0}
        maxTerm={banco.plazo_maximo || 0}
        minAmount={banco.monto_minimo ? parseFloat(banco.monto_minimo) : 0}
        maxAmount={banco.monto_maximo ? parseFloat(banco.monto_maximo) : 0}
        activeCredits={banco.creditos_activos || 0}
        onBack={() => navigate(ROUTES.BANCOS)}
        onEdit={() => navigate(ROUTES.BANCO_NUEVO, { state: { banco } })}
      />
    </div>
  );
}
