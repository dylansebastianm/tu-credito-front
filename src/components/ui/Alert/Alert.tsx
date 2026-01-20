import { useEffect, useState } from "react";
import {
  FiCheck,
  FiX,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import styles from "./Alert.module.css";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

const iconMap = {
  success: FiCheck,
  error: FiX,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const titleMap = {
  success: "Operación exitosa",
  error: "Error",
  warning: "Advertencia",
  info: "Información",
};

export function Alert({
  type = "success",
  title,
  message,
  duration = 4000,
  onClose,
  isVisible,
}: AlertProps) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const hideTimer = setTimeout(() => {
        setIsHiding(true);
      }, duration);

      const closeTimer = setTimeout(() => {
        onClose?.();
        setIsHiding(false);
      }, duration + 300);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      onClose?.();
      setIsHiding(false);
    }, 300);
  };

  if (!isVisible) return null;

  const Icon = iconMap[type];

  return (
    <div className={styles.alertOverlay}>
      <div
        className={`${styles.alert} ${styles[type]} ${isHiding ? styles.hiding : ""}`}
      >
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} />
        </div>
        <div className={styles.content}>
          <p className={styles.title}>{title || titleMap[type]}</p>
          {message && <p className={styles.message}>{message}</p>}
        </div>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Cerrar alerta"
        >
          <FiX className={styles.closeIcon} />
        </button>
      </div>
    </div>
  );
}
