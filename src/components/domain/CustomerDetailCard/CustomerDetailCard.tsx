import React from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/format';
import { DetailCardShell, DetailSection, detailShellStyles } from '../DetailCardShell/DetailCardShell';

interface CustomerData {
  name: string;
  curp: string;
  status: 'activo' | 'inactivo' | 'pendiente';
  activeCredits: number;
  totalCreditAmount: number;
  registrationDate: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

interface CustomerDetailCardProps {
  customer: CustomerData;
  onEdit?: () => void;
  onBack?: () => void;
}

export function CustomerDetailCard({
  customer,
  onEdit,
  onBack,
}: CustomerDetailCardProps): React.JSX.Element {
  return (
    <DetailCardShell
      title={customer.name}
      subtitle={`CURP: ${customer.curp}`}
      status={customer.status}
      onBack={onBack}
      onEdit={onEdit}
    >
      <DetailSection
        title="Resumen"
        icon={<HiOutlinePencil className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Créditos Activos</p>
            <p className={detailShellStyles.fieldValueHighlight}>{customer.activeCredits}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Monto Total en Créditos</p>
            <p className={detailShellStyles.fieldValueHighlight}>{formatCurrency(customer.totalCreditAmount)}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Fecha de Registro</p>
            <p className={detailShellStyles.fieldValue}>{customer.registrationDate}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Estado</p>
            <p className={detailShellStyles.fieldValue}>
              {customer.status === 'activo'
                ? 'Activo'
                : customer.status === 'pendiente'
                  ? 'Pendiente'
                  : 'Inactivo'}
            </p>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        title="Información Personal"
        icon={<FaUser className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Nombre Completo</p>
            <p className={detailShellStyles.fieldValue}>{customer.name}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>DNI / CURP</p>
            <p className={detailShellStyles.fieldValue}>{customer.curp}</p>
          </div>
          <div className={`${detailShellStyles.field} ${detailShellStyles.fieldFull}`}>
            <p className={detailShellStyles.fieldLabel}>Fecha de Nacimiento</p>
            <p className={detailShellStyles.fieldValue}>{customer.birthDate}</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        title="Información de Contacto"
        icon={<FaEnvelope className={detailShellStyles.sectionIcon} />}
      >
        <div className={detailShellStyles.fieldGrid}>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Email</p>
            <p className={detailShellStyles.fieldValue}>{customer.email}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Teléfono</p>
            <p className={detailShellStyles.fieldValue}>{customer.phone}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Dirección</p>
            <p className={detailShellStyles.fieldValue}>{customer.address}</p>
          </div>
          <div className={detailShellStyles.field}>
            <p className={detailShellStyles.fieldLabel}>Ciudad</p>
            <p className={detailShellStyles.fieldValue}>{customer.city}</p>
          </div>
        </div>
      </DetailSection>
    </DetailCardShell>
  );
}

