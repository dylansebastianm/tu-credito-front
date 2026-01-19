"use client";

import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export function Spinner({ size = "md", color = "primary", className = "" }: SpinnerProps) {
  return (
    <div 
      className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className}`}
      role="status"
      aria-label="Cargando"
    >
      <span className={styles.srOnly}>Cargando...</span>
    </div>
  );
}

export default Spinner;
