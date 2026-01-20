import React from 'react';
import { FaBuilding, FaCalendarAlt, FaCreditCard, FaUser } from 'react-icons/fa';
import { formatDate } from '../../../utils/format';
import { PaymentSummaryCard } from '../PaymentSummaryCard/PaymentSummaryCard';
import { DetailCardShell, DetailSection, detailShellStyles } from '../DetailCardShell/DetailCardShell';

interface CreditDetailCardProps {
  id: string;
  status: 'activo' | 'inactivo' | 'pendiente' | 'aprobado' | 'rechazado' | 'pagado' | 'vencido';
  clienteNombre: string;
  clienteId: string;
  bancoNombre: string;
  bancoId: string;
  monto: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  montoTotal: number;
  fechaSolicitud: string;
  fechaAprobacion?: string;
  fechaVencimiento?: string;
  proposito: string;
  observaciones?: string;
  onBack?: () => void;
  onEdit?: () => void;
}

export function CreditDetailCard({
  id,
  status,
  clienteNombre,
  clienteId,
  bancoNombre,
  bancoId,
  monto,
  tasaInteres,
  plazoMeses,
  cuotaMensual,
  montoTotal,
  fechaSolicitud,
  fechaAprobacion,
  fechaVencimiento,
  proposito,
  observaciones,
  onBack,
  onEdit,
}: CreditDetailCardProps): React.JSX.Element {
  const shellStatus =
    status === 'activo' || status === 'aprobado' || status === 'pagado'
      ? 'activo'
      : status === 'pendiente'
        ? 'pendiente'
        : 'inactivo';

  return (
    <DetailCardShell
      title={`Crédito ${id}`}
      subtitle="Detalle del crédito"
      status={shellStatus}
      onBack={onBack}
      onEdit={onEdit}
    >
      <div className={detailShellStyles.gridFull}>
        <PaymentSummaryCard
          amount={monto}
          rate={tasaInteres}
          term={plazoMeses}
          monthlyPayment={cuotaMensual}
          totalAmount={montoTotal}
        />
      </div>

      <DetailSection title="Cliente" icon={<FaUser className={detailShellStyles.sectionIcon} />}>
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Nombre</p>
            <p className={detailShellStyles.fieldValue}>{clienteNombre}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>ID Cliente</p>
            <p className={detailShellStyles.fieldValue}>{clienteId}</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Banco" icon={<FaBuilding className={detailShellStyles.sectionIcon} />}>
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Nombre</p>
            <p className={detailShellStyles.fieldValue}>{bancoNombre}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>ID Banco</p>
            <p className={detailShellStyles.fieldValue}>{bancoId}</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Fechas" icon={<FaCalendarAlt className={detailShellStyles.sectionIcon} />}>
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Fecha Solicitud</p>
            <p className={detailShellStyles.fieldValue}>{formatDate(fechaSolicitud)}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Fecha Aprobación</p>
            <p className={detailShellStyles.fieldValue}>
              {fechaAprobacion ? formatDate(fechaAprobacion) : '—'}
            </p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Fecha Vencimiento</p>
            <p className={detailShellStyles.fieldValue}>
              {fechaVencimiento ? formatDate(fechaVencimiento) : '—'}
            </p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Estado</p>
            <p className={detailShellStyles.fieldValue}>{status}</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Detalles" icon={<FaCreditCard className={detailShellStyles.sectionIcon} />}>
        <div className={detailShellStyles.fieldGrid}>
          <div className={`${detailShellStyles.field} ${detailShellStyles.fieldFull}`}>
            <p className={detailShellStyles.fieldLabel}>Propósito</p>
            <p className={detailShellStyles.fieldValue}>{proposito}</p>
          </div>
          <div className={`${detailShellStyles.field} ${detailShellStyles.fieldFull}`}>
            <p className={detailShellStyles.fieldLabel}>Observaciones</p>
            <p className={detailShellStyles.fieldValue}>{observaciones || '—'}</p>
          </div>
        </div>
      </DetailSection>
    </DetailCardShell>
  );
}

