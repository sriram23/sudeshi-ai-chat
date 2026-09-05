import Image from "next/image";
import styles from "./voc-visual.module.css";

const VOCVisual = () => {
    return (
        <div className={styles.visual} aria-hidden="true">
            <svg
                viewBox="0 0 720 320"
                className={styles.svg}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Soft sun / halo */}
                <circle
                    cx="360"
                    cy="135"
                    r="105"
                    fill="#FFB45C"
                    fillOpacity="0.12"
                    className={styles.sun}
                />

                <circle
                    cx="360"
                    cy="135"
                    r="82"
                    stroke="#FF9933"
                    strokeWidth="1"
                    strokeOpacity="0.18"
                />

                {/* Outer orbital arc */}
                <path
                    className={styles.orbit}
                    d="
                        M 205 155
                        C 245 42, 475 42, 515 155
                    "
                    stroke="#64748B"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                />

                {/* Second orbital arc */}
                <path
                    className={styles.orbit2}
                    d="
                        M 170 185
                        C 225 25, 495 25, 550 185
                    "
                    stroke="#94A3B8"
                    strokeWidth="1"
                    strokeDasharray="2 10"
                />

                {/* Saffron wave */}
                <path
                    className={`${styles.wave} ${styles.saffron}`}
                    d="
                        M 35 195
                        C 145 125, 225 125, 320 180
                        C 415 235, 510 225, 685 125
                    "
                    stroke="#FF9933"
                    strokeWidth="18"
                    strokeLinecap="round"
                />

                {/* Green wave */}
                <path
                    className={`${styles.wave} ${styles.green}`}
                    d="
                        M 35 235
                        C 145 165, 225 165, 320 220
                        C 415 275, 510 265, 685 165
                    "
                    stroke="#138808"
                    strokeWidth="18"
                    strokeLinecap="round"
                />

                {/* Fine water lines */}
                <path
                    className={styles.water}
                    d="M 65 250 C 180 220, 260 225, 350 250"
                    stroke="#64748B"
                    strokeWidth="1"
                    strokeOpacity="0.18"
                />

                <path
                    className={styles.water}
                    d="M 380 260 C 485 235, 560 235, 655 205"
                    stroke="#64748B"
                    strokeWidth="1"
                    strokeOpacity="0.18"
                />

                {/* Small decorative particles */}
                <circle
                    className={`${styles.particle} ${styles.particle1}`}
                    cx="120"
                    cy="105"
                    r="3"
                    fill="#FF9933"
                />

                <circle
                    className={`${styles.particle} ${styles.particle2}`}
                    cx="175"
                    cy="250"
                    r="3"
                    fill="#138808"
                />

                <circle
                    className={`${styles.particle} ${styles.particle3}`}
                    cx="555"
                    cy="95"
                    r="3"
                    fill="#FF9933"
                />

                <circle
                    className={`${styles.particle} ${styles.particle4}`}
                    cx="610"
                    cy="225"
                    r="3"
                    fill="#138808"
                />

                <circle
                    className={`${styles.particle} ${styles.particle5}`}
                    cx="90"
                    cy="165"
                    r="2"
                    fill="#94A3B8"
                />

                <circle
                    className={`${styles.particle} ${styles.particle6}`}
                    cx="635"
                    cy="130"
                    r="2"
                    fill="#94A3B8"
                />

                {/* Tiny route markers */}
                <circle
                    cx="145"
                    cy="160"
                    r="4"
                    fill="#64748B"
                    fillOpacity="0.25"
                />

                <circle
                    cx="575"
                    cy="160"
                    r="4"
                    fill="#64748B"
                    fillOpacity="0.25"
                />

                <path
                    d="M 145 160 C 250 80, 470 80, 575 160"
                    stroke="#64748B"
                    strokeWidth="1"
                    strokeOpacity="0.15"
                    strokeDasharray="3 7"
                />
            </svg>

            {/* VOC portrait */}
            <div className={styles.portrait}>
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c0/V._O._Chidambaram_Pillai.jpg"
                    alt="V. O. Chidambaram Pillai"
                    width={180}
                    height={240}
                    className={styles.image}
                    unoptimized
                />
            </div>
        </div>
    );
};

export default VOCVisual;
