"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  Users,
} from "lucide-react";
import { mockClientes } from "@/lib/mock-data";
import { formatCurrency, formatDate, getEstadoLabel } from "@/lib/format";
import type { Cliente } from "@/lib/types";
import type { Route, RouteState } from "@/lib/routes";
import styles from "./ClientesPage.module.css";

interface ClientesPageProps {
  navigate: (route: Route, params?: Record<string, string>) => void;
  routeState: RouteState;
}

export function ClientesPage({ navigate, routeState }: ClientesPageProps) {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [saving, setSaving] = useState(false);

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.dni.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado =
        filterEstado === "all" || cliente.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [clientes, searchTerm, filterEstado]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "activo":
        return styles.badgeGreen;
      case "inactivo":
        return styles.badgeRed;
      case "pendiente":
        return styles.badgeYellow;
      default:
        return styles.badgeGray;
    }
  };

  const handleViewDetail = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    navigate("cliente-detalle", { id: cliente.id });
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData(cliente);
    navigate("cliente-editar", { id: cliente.id });
  };

  const handleNew = () => {
    setSelectedCliente(null);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      fechaNacimiento: "",
      dni: "",
      estado: "pendiente",
    });
    navigate("cliente-nuevo");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (selectedCliente) {
      setClientes(
        clientes.map((c) =>
          c.id === selectedCliente.id ? ({ ...c, ...formData } as Cliente) : c
        )
      );
    } else {
      const newCliente: Cliente = {
        ...(formData as Cliente),
        id: `cli-${Date.now()}`,
        fechaRegistro: new Date().toISOString().split("T")[0],
        creditosActivos: 0,
        montoTotalCreditos: 0,
      };
      setClientes([newCliente, ...clientes]);
    }

    setSaving(false);
    navigate("clientes");
    setSelectedCliente(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Esta seguro de eliminar este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  const handleBack = () => {
    setSelectedCliente(null);
    navigate("clientes");
  };

  // Detail view
  if (routeState.route === "cliente-detalle" && selectedCliente) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerInfo}>
              <button onClick={handleBack} className={styles.secondaryButton}>
                <ArrowLeft className={styles.buttonIcon} />
                Volver
              </button>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={() => handleEdit(selectedCliente)}
                className={styles.primaryButton}
              >
                <Edit className={styles.buttonIcon} />
                Editar
              </button>
            </div>
          </div>
          <h1 className={styles.title}>
            {selectedCliente.nombre} {selectedCliente.apellido}
          </h1>
          <p className={styles.subtitle}>Detalle del cliente</p>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <User className={styles.detailCardIcon} />
                Informacion Personal
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nombre Completo</span>
                  <span className={styles.detailValue}>
                    {selectedCliente.nombre} {selectedCliente.apellido}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>DNI/CURP</span>
                  <span className={styles.detailValue}>
                    {selectedCliente.dni}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de Nacimiento</span>
                  <span className={styles.detailValue}>
                    {formatDate(selectedCliente.fechaNacimiento)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Estado</span>
                  <span
                    className={`${styles.badge} ${getEstadoBadgeClass(selectedCliente.estado)}`}
                  >
                    {getEstadoLabel(selectedCliente.estado)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <Mail className={styles.detailCardIcon} />
                Contacto
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>
                    {selectedCliente.email}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Telefono</span>
                  <span className={styles.detailValue}>
                    {selectedCliente.telefono}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Direccion</span>
                  <span className={styles.detailValue}>
                    {selectedCliente.direccion}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ciudad</span>
                  <span className={styles.detailValue}>
                    {selectedCliente.ciudad}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.detailCard} ${styles.detailCardFull}`}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <CreditCard className={styles.detailCardIcon} />
                Informacion de Creditos
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.5rem",
                }}
              >
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Creditos Activos</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.5rem", fontWeight: 700 }}
                  >
                    {selectedCliente.creditosActivos}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Monto Total</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.5rem", fontWeight: 700 }}
                  >
                    {formatCurrency(selectedCliente.montoTotalCreditos)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de Registro</span>
                  <span className={styles.detailValue}>
                    {formatDate(selectedCliente.fechaRegistro)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  if (
    routeState.route === "cliente-nuevo" ||
    routeState.route === "cliente-editar"
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.secondaryButton}>
            <ArrowLeft className={styles.buttonIcon} />
            Volver
          </button>
          <h1 className={styles.title}>
            {selectedCliente ? "Editar Cliente" : "Nuevo Cliente"}
          </h1>
          <p className={styles.subtitle}>
            {selectedCliente
              ? "Modifica los datos del cliente"
              : "Completa los datos del nuevo cliente"}
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Nombre"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  placeholder="Apellido"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Telefono</label>
                <input
                  type="text"
                  value={formData.telefono || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="+52 55 1234 5678"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  DNI/CURP
                </label>
                <input
                  type="text"
                  value={formData.dni || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
                  }
                  placeholder="DNI o CURP"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaNacimiento: e.target.value })
                  }
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Direccion</label>
                <input
                  type="text"
                  value={formData.direccion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Calle y numero"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Ciudad</label>
                <input
                  type="text"
                  value={formData.ciudad || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ciudad: e.target.value })
                  }
                  placeholder="Ciudad"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Estado</label>
                <select
                  value={formData.estado || "pendiente"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as Cliente["estado"],
                    })
                  }
                  className={styles.formSelect}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <button onClick={handleBack} className={styles.secondaryButton}>
                <X className={styles.buttonIcon} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={styles.primaryButton}
              >
                {saving ? (
                  <>
                    <Loader2 className={`${styles.buttonIcon} ${styles.spinner}`} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className={styles.buttonIcon} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Clientes</h1>
            <p className={styles.subtitle}>Gestion de clientes del sistema</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleNew} className={styles.primaryButton}>
              <Plus className={styles.buttonIcon} />
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Creditos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <Users className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>No se encontraron clientes</p>
                      <p className={styles.emptyText}>
                        Intenta ajustar los filtros de busqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className={styles.cellPrimary}>
                        {cliente.nombre} {cliente.apellido}
                      </div>
                      <div className={styles.cellSecondary}>{cliente.dni}</div>
                    </td>
                    <td>{cliente.email}</td>
                    <td>{cliente.ciudad}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${getEstadoBadgeClass(cliente.estado)}`}
                      >
                        {getEstadoLabel(cliente.estado)}
                      </span>
                    </td>
                    <td>{cliente.creditosActivos}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleViewDetail(cliente)}
                          className={styles.actionButton}
                          title="Ver detalle"
                        >
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleEdit(cliente)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          title="Eliminar"
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Mostrando {filteredClientes.length} de {clientes.length} clientes
          </span>
        </div>
      </div>
    </div>
  );
}
