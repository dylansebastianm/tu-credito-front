"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  X,
  CreditCard,
  User,
  Building2,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { mockCreditos, mockClientes, mockBancos } from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  getEstadoLabel,
  calculateCuotaMensual,
  calculateMontoTotal,
  formatPercent,
} from "@/lib/format";
import type { Credito } from "@/lib/types";
import type { Route, RouteState } from "@/lib/routes";
import styles from "./CreditosPage.module.css";

interface CreditosPageProps {
  navigate: (route: Route, params?: Record<string, string>) => void;
  routeState: RouteState;
}

export function CreditosPage({ navigate, routeState }: CreditosPageProps) {
  const [creditos, setCreditos] = useState<Credito[]>(mockCreditos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedCredito, setSelectedCredito] = useState<Credito | null>(null);
  const [formData, setFormData] = useState<Partial<Credito>>({});
  const [saving, setSaving] = useState(false);

  const filteredCreditos = useMemo(() => {
    return creditos.filter((credito) => {
      const matchesSearch =
        credito.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credito.bancoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credito.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado =
        filterEstado === "all" || credito.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [creditos, searchTerm, filterEstado]);

  useEffect(() => {
    if (formData.monto && formData.tasaInteres && formData.plazoMeses) {
      const cuota = calculateCuotaMensual(
        formData.monto,
        formData.tasaInteres,
        formData.plazoMeses
      );
      const total = calculateMontoTotal(cuota, formData.plazoMeses);
      setFormData((prev) => ({
        ...prev,
        cuotaMensual: cuota,
        montoTotal: total,
      }));
    }
  }, [formData.monto, formData.tasaInteres, formData.plazoMeses]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "activo":
      case "aprobado":
      case "pagado":
        return styles.badgeGreen;
      case "pendiente":
        return styles.badgeYellow;
      case "rechazado":
      case "vencido":
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  const handleViewDetail = (credito: Credito) => {
    setSelectedCredito(credito);
    navigate("credito-detalle", { id: credito.id });
  };

  const handleEdit = (credito: Credito) => {
    setSelectedCredito(credito);
    setFormData(credito);
    navigate("credito-editar", { id: credito.id });
  };

  const handleNew = () => {
    setSelectedCredito(null);
    setFormData({
      clienteId: "",
      bancoId: "",
      monto: 0,
      tasaInteres: 12,
      plazoMeses: 12,
      estado: "pendiente",
      proposito: "",
      observaciones: "",
    });
    navigate("credito-nuevo");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const cliente = mockClientes.find((c) => c.id === formData.clienteId);
    const banco = mockBancos.find((b) => b.id === formData.bancoId);

    if (selectedCredito) {
      setCreditos(
        creditos.map((c) =>
          c.id === selectedCredito.id
            ? ({
                ...c,
                ...formData,
                clienteNombre: cliente
                  ? `${cliente.nombre} ${cliente.apellido}`
                  : c.clienteNombre,
                bancoNombre: banco?.nombre || c.bancoNombre,
              } as Credito)
            : c
        )
      );
    } else {
      const newCredito: Credito = {
        ...(formData as Credito),
        id: `cre-${Date.now()}`,
        clienteNombre: cliente
          ? `${cliente.nombre} ${cliente.apellido}`
          : "Cliente",
        bancoNombre: banco?.nombre || "Banco",
        fechaSolicitud: new Date().toISOString().split("T")[0],
        cuotaMensual: formData.cuotaMensual || 0,
        montoTotal: formData.montoTotal || 0,
      };
      setCreditos([newCredito, ...creditos]);
    }

    setSaving(false);
    navigate("creditos");
    setSelectedCredito(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Esta seguro de eliminar este credito?")) {
      setCreditos(creditos.filter((c) => c.id !== id));
    }
  };

  const handleBack = () => {
    setSelectedCredito(null);
    navigate("creditos");
  };

  // Detail view
  if (routeState.route === "credito-detalle" && selectedCredito) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <button onClick={handleBack} className={styles.secondaryButton}>
              <ArrowLeft className={styles.buttonIcon} />
              Volver
            </button>
            <div className={styles.headerActions}>
              <span
                className={`${styles.badge} ${getEstadoBadgeClass(selectedCredito.estado)}`}
              >
                {getEstadoLabel(selectedCredito.estado)}
              </span>
              <button
                onClick={() => handleEdit(selectedCredito)}
                className={styles.primaryButton}
              >
                <Edit className={styles.buttonIcon} />
                Editar
              </button>
            </div>
          </div>
          <h1 className={styles.title}>Credito {selectedCredito.id}</h1>
          <p className={styles.subtitle}>Detalle del credito</p>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <User className={styles.detailCardIcon} />
                Cliente
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nombre</span>
                  <span className={styles.detailValue}>
                    {selectedCredito.clienteNombre}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>ID Cliente</span>
                  <span className={styles.detailValue}>
                    {selectedCredito.clienteId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <Building2 className={styles.detailCardIcon} />
                Banco
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nombre</span>
                  <span className={styles.detailValue}>
                    {selectedCredito.bancoNombre}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>ID Banco</span>
                  <span className={styles.detailValue}>
                    {selectedCredito.bancoId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.detailCard} ${styles.detailCardFull}`}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <DollarSign className={styles.detailCardIcon} />
                Informacion Financiera
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "1.5rem",
                }}
              >
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Monto</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatCurrency(selectedCredito.monto)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tasa</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatPercent(selectedCredito.tasaInteres)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Plazo</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {selectedCredito.plazoMeses} meses
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Cuota Mensual</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatCurrency(selectedCredito.cuotaMensual)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "1rem", color: "#6b7280" }}>
                  Monto Total a Pagar
                </span>
                <span
                  style={{ fontSize: "1.75rem", fontWeight: 700, color: "#2563eb" }}
                >
                  {formatCurrency(selectedCredito.montoTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <Calendar className={styles.detailCardIcon} />
                Fechas
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha Solicitud</span>
                  <span className={styles.detailValue}>
                    {formatDate(selectedCredito.fechaSolicitud)}
                  </span>
                </div>
                {selectedCredito.fechaAprobacion && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha Aprobacion</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedCredito.fechaAprobacion)}
                    </span>
                  </div>
                )}
                {selectedCredito.fechaVencimiento && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha Vencimiento</span>
                    <span className={styles.detailValue}>
                      {formatDate(selectedCredito.fechaVencimiento)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <CreditCard className={styles.detailCardIcon} />
                Detalles
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Proposito</span>
                  <span className={styles.detailValue}>
                    {selectedCredito.proposito}
                  </span>
                </div>
                {selectedCredito.observaciones && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Observaciones</span>
                    <span className={styles.detailValue}>
                      {selectedCredito.observaciones}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  if (
    routeState.route === "credito-nuevo" ||
    routeState.route === "credito-editar"
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.secondaryButton}>
            <ArrowLeft className={styles.buttonIcon} />
            Volver
          </button>
          <h1 className={styles.title}>
            {selectedCredito ? "Editar Credito" : "Nuevo Credito"}
          </h1>
          <p className={styles.subtitle}>
            {selectedCredito
              ? "Modifica los datos del credito"
              : "Completa los datos del nuevo credito"}
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label
                  className={`${styles.formLabel} ${styles.formLabelRequired}`}
                >
                  Cliente
                </label>
                <select
                  value={formData.clienteId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteId: e.target.value })
                  }
                  className={styles.formSelect}
                >
                  <option value="">Seleccionar cliente</option>
                  {mockClientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label
                  className={`${styles.formLabel} ${styles.formLabelRequired}`}
                >
                  Banco
                </label>
                <select
                  value={formData.bancoId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bancoId: e.target.value })
                  }
                  className={styles.formSelect}
                >
                  <option value="">Seleccionar banco</option>
                  {mockBancos.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label
                  className={`${styles.formLabel} ${styles.formLabelRequired}`}
                >
                  Monto
                </label>
                <input
                  type="number"
                  value={formData.monto || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto: Number(e.target.value),
                    })
                  }
                  placeholder="0.00"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label
                  className={`${styles.formLabel} ${styles.formLabelRequired}`}
                >
                  Tasa de Interes (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tasaInteres || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tasaInteres: Number(e.target.value),
                    })
                  }
                  placeholder="12.0"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label
                  className={`${styles.formLabel} ${styles.formLabelRequired}`}
                >
                  Plazo (meses)
                </label>
                <input
                  type="number"
                  value={formData.plazoMeses || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plazoMeses: Number(e.target.value),
                    })
                  }
                  placeholder="12"
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
                      estado: e.target.value as Credito["estado"],
                    })
                  }
                  className={styles.formSelect}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="activo">Activo</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="pagado">Pagado</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>Proposito</label>
                <input
                  type="text"
                  value={formData.proposito || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, proposito: e.target.value })
                  }
                  placeholder="Proposito del credito"
                  className={styles.formInput}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>Observaciones</label>
                <textarea
                  value={formData.observaciones || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  placeholder="Observaciones adicionales"
                  className={styles.formTextarea}
                />
              </div>
            </div>

            {formData.cuotaMensual && formData.cuotaMensual > 0 && (
              <div
                style={{
                  padding: "1rem",
                  background: "#eff6ff",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Cuota Mensual
                  </p>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {formatCurrency(formData.cuotaMensual)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Monto Total
                  </p>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
                    {formatCurrency(formData.montoTotal || 0)}
                  </p>
                </div>
              </div>
            )}

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
            <h1 className={styles.title}>Creditos</h1>
            <p className={styles.subtitle}>Gestion de creditos del sistema</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleNew} className={styles.primaryButton}>
              <Plus className={styles.buttonIcon} />
              Nuevo Credito
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por cliente, banco o ID..."
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
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="activo">Activo</option>
          <option value="rechazado">Rechazado</option>
          <option value="pagado">Pagado</option>
          <option value="vencido">Vencido</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Banco</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCreditos.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <CreditCard className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>
                        No se encontraron creditos
                      </p>
                      <p className={styles.emptyText}>
                        Intenta ajustar los filtros de busqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCreditos.map((credito) => (
                  <tr key={credito.id}>
                    <td className={styles.cellPrimary}>{credito.id}</td>
                    <td>{credito.clienteNombre}</td>
                    <td>{credito.bancoNombre}</td>
                    <td>{formatCurrency(credito.monto)}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${getEstadoBadgeClass(credito.estado)}`}
                      >
                        {getEstadoLabel(credito.estado)}
                      </span>
                    </td>
                    <td>{formatDate(credito.fechaSolicitud)}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleViewDetail(credito)}
                          className={styles.actionButton}
                          title="Ver detalle"
                        >
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleEdit(credito)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(credito.id)}
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
            Mostrando {filteredCreditos.length} de {creditos.length} creditos
          </span>
        </div>
      </div>
    </div>
  );
}
