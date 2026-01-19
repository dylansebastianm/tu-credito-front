"use client";

import { useState, useEffect } from "react";
import { isAuthenticated, logout, getAuthState } from "@/lib/auth";
import { LoginPage } from "@/components/backoffice/LoginPage";
import { DashboardPage } from "@/components/backoffice/DashboardPage";
import { ClientesPage } from "@/components/backoffice/ClientesPage";
import { CreditosPage } from "@/components/backoffice/CreditosPage";
import { BancosPage } from "@/components/backoffice/BancosPage";
import { DocsPage } from "@/components/backoffice/DocsPage";
import { AppLayout } from "@/components/backoffice/AppLayout";
import type { Route, RouteState } from "@/lib/routes";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [routeState, setRouteState] = useState<RouteState>({ route: "dashboard" });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setRouteState({ route: "dashboard" });
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const navigate = (route: Route, params?: Record<string, string>) => {
    setRouteState({ route, params });
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f9fafb"
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: "3px solid #e5e7eb",
          borderTopColor: "#2563eb",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (routeState.route) {
      case "dashboard":
        return <DashboardPage navigate={navigate} />;
      case "clientes":
      case "cliente-detalle":
      case "cliente-nuevo":
      case "cliente-editar":
        return <ClientesPage navigate={navigate} routeState={routeState} />;
      case "creditos":
      case "credito-detalle":
      case "credito-nuevo":
      case "credito-editar":
        return <CreditosPage navigate={navigate} routeState={routeState} />;
      case "bancos":
      case "banco-detalle":
      case "banco-nuevo":
      case "banco-editar":
        return <BancosPage navigate={navigate} routeState={routeState} />;
      case "docs":
        return <DocsPage />;
      default:
        return <DashboardPage navigate={navigate} />;
    }
  };

  return (
    <AppLayout 
      currentRoute={routeState.route} 
      onNavigate={navigate} 
      onLogout={handleLogout}
      userName={getAuthState().user?.nombre || "Usuario"}
    >
      {renderPage()}
    </AppLayout>
  );
}
