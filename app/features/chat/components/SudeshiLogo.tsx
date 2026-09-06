import { memo } from "react";
import styles from "./sudeshi-logo.module.css";

type SudeshiLogoProps = {
    size?: number;
    animated?: boolean;
    className?: string;
};

const SudeshiLogo = memo(
    ({
        size = 32,
        animated = true,
        className = "",
    }: SudeshiLogoProps) => {
        return (
            <div
                className={`${styles.logo} ${
                    animated ? styles.animated : ""
                } ${className}`}
                style={
                    {
                        "--logo-height": `${size}px`,
                        "--logo-width": `${size * 3.15}px`,
                    } as React.CSSProperties
                }
                role="img"
                aria-label="Sudeshi"
            >
                <div className={styles.border}>
                    <div
                        className="
                            relative z-10
                            flex h-full w-full
                            items-center justify-center
                            rounded-[10px]
                            bg-zinc-100
                            px-3
                            text-zinc-900
                            dark:bg-zinc-900
                            dark:text-white
                        "
                    >
                        <span
                            className="
                                whitespace-nowrap
                                text-[calc(var(--logo-height)*0.66)]
                                font-semibold
                                tracking-[-0.35px]
                              text-zinc-900 dark:text-white
                            "
                        >
                            <span className="font-bold">S</span>udeshi
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);

SudeshiLogo.displayName = "SudeshiLogo";

export default SudeshiLogo;
