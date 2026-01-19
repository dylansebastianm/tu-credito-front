"use client";

import React from "react"

import { useState } from "react";
import { Lock, Mail, LogIn, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/auth";
import styles from "./LoginPage.module.css";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onLogin();
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Lock className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Tu Credito</h1>
          <p className={styles.subtitle}>Sistema de Gestion de Creditos</p>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.alert}>
              <AlertCircle className={styles.alertIcon} />
              <p className={styles.alertText}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Correo electronico
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tucredito.com"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Contrasena
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff className={styles.eyeIcon} />
                  ) : (
                    <Eye className={styles.eyeIcon} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} />
                  Iniciando sesion...
                </>
              ) : (
                <>
                  <LogIn className={styles.buttonIcon} />
                  Iniciar sesion
                </>
              )}
            </button>
          </form>
        </div>

        <div className={styles.footer}>
          <div className={styles.credentials}>
            <p className={styles.credentialsTitle}>Credenciales de prueba</p>
            <p className={styles.credentialsText}>
              <code>admin@tucredito.com</code> / <code>admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
