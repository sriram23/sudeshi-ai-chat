import { memo } from 'react';
import styles from './sudeshi-logo.module.css';

type SudeshiLogoProps = {
  size?: number;
  animated?: boolean;
  className?: string;
};

const SudeshiLogo = memo(({ size = 32, animated = true, className = '' }: SudeshiLogoProps) => {
  return (
    <div
      className={`${styles.logo} ${animated ? styles.animated : ''} ${className}`}
      style={
        {
          '--logo-height': `${size}px`,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Sudeshi"
    >
      <span className={styles.wordmark}>
        <span className={styles.s}>S</span>udeshi
      </span>

      <span className={styles.tricolor} aria-hidden="true">
        <span className={styles.saffron} />
        <span className={styles.white} />
        <span className={styles.green} />
      </span>
    </div>
  );
});

SudeshiLogo.displayName = 'SudeshiLogo';

export default SudeshiLogo;
