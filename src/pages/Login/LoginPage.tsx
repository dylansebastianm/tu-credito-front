/**
 * Login Page - Tu Crédito Frontend
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaSignInAlt, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { setDocumentMeta } from '../../utils/meta';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../app/config/constants';
import { Button } from '../../components/ui/Button/Button';
import { getErrorMessage } from '../../utils/error';
import styles from './LoginPage.module.css';

/**
 * LoginPage component
 * Página de inicio de sesión
 */
export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDocumentMeta({
      title: 'Iniciar Sesión',
      description: 'Accede a tu cuenta de Tu Crédito',
    });

    // Si ya está autenticado, redirigir al dashboard
    if (authService.isAuthenticated()) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <FaLock className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Tu Credito</h1>
          <p className={styles.subtitle}>Sistema de Gestion de Creditos</p>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.alert}>
              <FaExclamationCircle className={styles.alertIcon} />
              <p className={styles.alertText}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputWrapper}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  required
                  className={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Contrasena
              </label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className={styles.input}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                >
                  {showPassword ? (
                    <FaEyeSlash className={styles.eyeIcon} />
                  ) : (
                    <FaEye className={styles.eyeIcon} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              isLoading={loading}
              leftIcon={!loading ? <FaSignInAlt /> : undefined}
            >
              {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
