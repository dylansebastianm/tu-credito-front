import React from 'react';
import { FaDollarSign, FaEnvelope, FaPercent } from 'react-icons/fa';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { formatCurrency } from '../../../utils/format';
import { DetailCardShell, DetailSection, detailShellStyles } from '../DetailCardShell/DetailCardShell';

interface BankDetailCardProps {
  name: string;
  code: string;
  isActive?: boolean;
  address: string;
  registrationDate: string;
  email: string;
  phone: string;
  website?: string;
  minRate: number;
  maxRate: number;
  minTerm: number;
  maxTerm: number;
  minAmount: number;
  maxAmount: number;
  activeCredits: number;
  onBack?: () => void;
  onEdit?: () => void;
}

export function BankDetailCard({
  name,
  code,
  isActive = true,
  address,
  registrationDate,
  email,
  phone,
  website,
  minRate,
  maxRate,
  minTerm,
  maxTerm,
  minAmount,
  maxAmount,
  activeCredits,
  onBack,
  onEdit,
}: BankDetailCardProps): React.JSX.Element {
  return (
    <DetailCardShell
      title={name}
      subtitle={`Código: ${code}`}
      status={isActive ? 'activo' : 'inactivo'}
      onBack={onBack}
      onEdit={onEdit}
    >
      <DetailSection
        title="Información General"
        icon={<HiOutlineViewGrid className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Nombre</p>
            <p className={detailShellStyles.fieldValue}>{name}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Código</p>
            <p className={detailShellStyles.fieldValue}>{code}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Dirección</p>
            <p className={detailShellStyles.fieldValue}>{address}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Fecha de Registro</p>
            <p className={detailShellStyles.fieldValue}>{registrationDate}</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        title="Contacto"
        icon={<FaEnvelope className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Email</p>
            <p className={detailShellStyles.fieldValue}>{email}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Teléfono</p>
            <p className={detailShellStyles.fieldValue}>{phone}</p>
          </div>
          <div className={`${detailShellStyles.field} ${detailShellStyles.fieldFull}`}>
            <p className={detailShellStyles.fieldLabel}>Sitio Web</p>
            {website ? (
              <a
                href={website}
                className={detailShellStyles.fieldValueLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {website}
              </a>
            ) : (
              <p className={detailShellStyles.fieldValue}>—</p>
            )}
          </div>
        </div>
      </DetailSection>

      <DetailSection
        title="Tasas y Plazos"
        icon={<FaPercent className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Tasa Mínima</p>
            <p className={detailShellStyles.fieldValue}>{minRate.toFixed(2)}%</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Tasa Máxima</p>
            <p className={detailShellStyles.fieldValue}>{maxRate.toFixed(2)}%</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Plazo Mínimo</p>
            <p className={detailShellStyles.fieldValue}>{minTerm} meses</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Plazo Máximo</p>
            <p className={detailShellStyles.fieldValue}>{maxTerm} meses</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        title="Montos y Créditos"
        icon={<FaDollarSign className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Monto Mínimo</p>
            <p className={detailShellStyles.fieldValue}>{formatCurrency(minAmount)}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Monto Máximo</p>
            <p className={detailShellStyles.fieldValue}>{formatCurrency(maxAmount)}</p>
          </div>
          <div className={`${detailShellStyles.field} ${detailShellStyles.fieldFull}`}>
            <p className={detailShellStyles.fieldLabel}>Créditos Activos</p>
            <p className={detailShellStyles.fieldValueHighlight}>{activeCredits}</p>
          </div>
        </div>
      </DetailSection>
    </DetailCardShell>
  );
}

