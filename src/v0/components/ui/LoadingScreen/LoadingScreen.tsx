"use client";

import styles from "./LoadingScreen.module.css";
import { Spinner } from "../Spinner";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className={styles.container}>
      <Spinner size="lg" color="primary" />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default LoadingScreen;
