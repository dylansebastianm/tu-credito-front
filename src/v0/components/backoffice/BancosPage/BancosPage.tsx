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
  Building2,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Percent,
  Loader2,
} from "lucide-react";
import { mockBancos } from "@/lib/mock-data";
import { formatCurrency, formatDate, getEstadoLabel, formatPercent } from "@/lib/format";
import type { Banco } from "@/lib/types";
import type { Route, RouteState } from "@/lib/routes";
import styles from "./BancosPage.module.css";

interface BancosPageProps {
  navigate: (route: Route, params?: Record<string, string>) => void;
  routeState: RouteState;
}

export function BancosPage({ navigate, routeState }: BancosPageProps) {
  const [bancos, setBancos] = useState<Banco[]>(mockBancos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedBanco, setSelectedBanco] = useState<Banco | null>(null);
  const [formData, setFormData] = useState<Partial<Banco>>({});
  const [saving, setSaving] = useState(false);

  const filteredBancos = useMemo(() => {
    return bancos.filter((banco) => {
      const matchesSearch =
        banco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banco.codigo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = filterEstado === "all" || banco.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [bancos, searchTerm, filterEstado]);

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "activo":
        return styles.badgeGreen;
      case "inactivo":
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  const handleViewDetail = (banco: Banco) => {
    setSelectedBanco(banco);
    navigate("banco-detalle", { id: banco.id });
  };

  const handleEdit = (banco: Banco) => {
    setSelectedBanco(banco);
    setFormData(banco);
    navigate("banco-editar", { id: banco.id });
  };

  const handleNew = () => {
    setSelectedBanco(null);
    setFormData({
      nombre: "",
      codigo: "",
      direccion: "",
      telefono: "",
      email: "",
      sitioWeb: "",
      tasaInteresMin: 8,
      tasaInteresMax: 20,
      plazoMinimo: 6,
      plazoMaximo: 60,
      montoMinimo: 10000,
      montoMaximo: 500000,
      estado: "activo",
    });
    navigate("banco-nuevo");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (selectedBanco) {
      setBancos(
        bancos.map((b) =>
          b.id === selectedBanco.id ? ({ ...b, ...formData } as Banco) : b
        )
      );
    } else {
      const newBanco: Banco = {
        ...(formData as Banco),
        id: `ban-${Date.now()}`,
        fechaRegistro: new Date().toISOString().split("T")[0],
        creditosActivos: 0,
      };
      setBancos([newBanco, ...bancos]);
    }

    setSaving(false);
    navigate("bancos");
    setSelectedBanco(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Esta seguro de eliminar este banco?")) {
      setBancos(bancos.filter((b) => b.id !== id));
    }
  };

  const handleBack = () => {
    setSelectedBanco(null);
    navigate("bancos");
  };

  // Detail view
  if (routeState.route === "banco-detalle" && selectedBanco) {
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
              <span
                className={`${styles.badge} ${getEstadoBadgeClass(selectedBanco.estado)}`}
              >
                {getEstadoLabel(selectedBanco.estado)}
              </span>
              <button
                onClick={() => handleEdit(selectedBanco)}
                className={styles.primaryButton}
              >
                <Edit className={styles.buttonIcon} />
                Editar
              </button>
            </div>
          </div>
          <h1 className={styles.title}>{selectedBanco.nombre}</h1>
          <p className={styles.subtitle}>Codigo: {selectedBanco.codigo}</p>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <Building2 className={styles.detailCardIcon} />
                Informacion General
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nombre</span>
                  <span className={styles.detailValue}>{selectedBanco.nombre}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Codigo</span>
                  <span className={styles.detailValue}>{selectedBanco.codigo}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Direccion</span>
                  <span className={styles.detailValue}>{selectedBanco.direccion}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de Registro</span>
                  <span className={styles.detailValue}>
                    {formatDate(selectedBanco.fechaRegistro)}
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
                  <span className={styles.detailValue}>{selectedBanco.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Telefono</span>
                  <span className={styles.detailValue}>{selectedBanco.telefono}</span>
                </div>
                {selectedBanco.sitioWeb && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Sitio Web</span>
                    <a
                      href={selectedBanco.sitioWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cellLink}
                    >
                      {selectedBanco.sitioWeb}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <Percent className={styles.detailCardIcon} />
                Tasas y Plazos
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                }}
              >
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tasa Minima</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatPercent(selectedBanco.tasaInteresMin)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tasa Maxima</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatPercent(selectedBanco.tasaInteresMax)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Plazo Minimo</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {selectedBanco.plazoMinimo} meses
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Plazo Maximo</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {selectedBanco.plazoMaximo} meses
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <h3 className={styles.detailCardTitle}>
                <CreditCard className={styles.detailCardIcon} />
                Montos y Creditos
              </h3>
            </div>
            <div className={styles.detailCardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                }}
              >
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Monto Minimo</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatCurrency(selectedBanco.montoMinimo)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Monto Maximo</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {formatCurrency(selectedBanco.montoMaximo)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Creditos Activos</span>
                  <span
                    className={styles.detailValue}
                    style={{ fontSize: "2rem", fontWeight: 700, color: "#2563eb" }}
                  >
                    {selectedBanco.creditosActivos}
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
  if (routeState.route === "banco-nuevo" || routeState.route === "banco-editar") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.secondaryButton}>
            <ArrowLeft className={styles.buttonIcon} />
            Volver
          </button>
          <h1 className={styles.title}>
            {selectedBanco ? "Editar Banco" : "Nuevo Banco"}
          </h1>
          <p className={styles.subtitle}>
            {selectedBanco
              ? "Modifica los datos del banco"
              : "Completa los datos del nuevo banco"}
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Nombre del Banco
                </label>
                <input
                  type="text"
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Nombre del banco"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={`${styles.formLabel} ${styles.formLabelRequired}`}>
                  Codigo
                </label>
                <input
                  type="text"
                  value={formData.codigo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  placeholder="Ej: BN001"
                  className={styles.formInput}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.formLabel}>Direccion</label>
                <input
                  type="text"
                  value={formData.direccion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Direccion completa"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Estado</label>
                <select
                  value={formData.estado || "activo"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as Banco["estado"],
                    })
                  }
                  className={styles.formSelect}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contacto@banco.com"
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
                <label className={styles.formLabel}>Sitio Web</label>
                <input
                  type="text"
                  value={formData.sitioWeb || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sitioWeb: e.target.value })
                  }
                  placeholder="https://www.banco.com"
                  className={styles.formInput}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: "#374151",
                }}
              >
                Tasas de Interes
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Tasa Minima (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tasaInteresMin || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tasaInteresMin: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Tasa Maxima (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tasaInteresMax || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tasaInteresMax: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Plazo Minimo (meses)</label>
                  <input
                    type="number"
                    value={formData.plazoMinimo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plazoMinimo: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Plazo Maximo (meses)</label>
                  <input
                    type="number"
                    value={formData.plazoMaximo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plazoMaximo: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: "#374151",
                }}
              >
                Montos
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Monto Minimo (MXN)</label>
                  <input
                    type="number"
                    value={formData.montoMinimo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        montoMinimo: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Monto Maximo (MXN)</label>
                  <input
                    type="number"
                    value={formData.montoMaximo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        montoMaximo: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
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
            <h1 className={styles.title}>Bancos</h1>
            <p className={styles.subtitle}>Gestion de bancos del sistema</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleNew} className={styles.primaryButton}>
              <Plus className={styles.buttonIcon} />
              Nuevo Banco
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre o codigo..."
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
          <option value="all">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Codigo</th>
                <th>Tasa Interes</th>
                <th>Creditos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBancos.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <Building2 className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>No se encontraron bancos</p>
                      <p className={styles.emptyText}>
                        Intenta ajustar los filtros de busqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBancos.map((banco) => (
                  <tr key={banco.id}>
                    <td>
                      <div className={styles.cellPrimary}>{banco.nombre}</div>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{banco.codigo}</td>
                    <td>
                      {formatPercent(banco.tasaInteresMin)} -{" "}
                      {formatPercent(banco.tasaInteresMax)}
                    </td>
                    <td>{banco.creditosActivos}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${getEstadoBadgeClass(banco.estado)}`}
                      >
                        {getEstadoLabel(banco.estado)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => handleViewDetail(banco)}
                          className={styles.actionButton}
                          title="Ver detalle"
                        >
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleEdit(banco)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(banco.id)}
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
      </div>
    </div>
  );
}
