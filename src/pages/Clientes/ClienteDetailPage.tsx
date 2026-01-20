/**
 * Cliente Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { mockClientes, type MockCliente } from '../../data/mock-data';
import { formatDate } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import { CustomerDetailCard } from '../../components/domain/CustomerDetailCard/CustomerDetailCard';
import styles from './Clientes.module.css';

/**
 * ClienteDetailPage component
 * Página de detalle de cliente
 */
export function ClienteDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<MockCliente | null>(null);

  useEffect(() => {
    if (id) {
      const foundCliente = mockClientes.find((c) => c.id === id);
      setCliente(foundCliente || null);

      if (foundCliente) {
        setDocumentMeta({
          title: `${foundCliente.nombre} ${foundCliente.apellido}`,
          description: `Detalle del cliente ${foundCliente.nombre} ${foundCliente.apellido}`,
        });
      }
    }
  }, [id]);

  if (!cliente) {
    return (
      <div className={styles.container}>
        <p>Cliente no encontrado</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CustomerDetailCard
        customer={{
          name: `${cliente.nombre} ${cliente.apellido}`,
          curp: cliente.dni,
          status: cliente.estado === 'activo' ? 'activo' : cliente.estado === 'pendiente' ? 'pendiente' : 'inactivo',
          activeCredits: cliente.creditosActivos,
          totalCreditAmount: cliente.montoTotalCreditos,
          registrationDate: formatDate(cliente.fechaRegistro),
          birthDate: formatDate(cliente.fechaNacimiento),
          email: cliente.email,
          phone: cliente.telefono,
          address: cliente.direccion,
          city: cliente.ciudad,
        }}
        onBack={() => navigate(ROUTES.CLIENTES)}
        onEdit={() => navigate(ROUTES.CLIENTE_NUEVO, { state: { cliente } })}
      />
    </div>
  );
}
