import styles from "./independence-visual.module.css";

const IndependenceDayVisual = () => {
    const spokes = Array.from({ length: 24 }, (_, index) => {
        const angle = (index * 360) / 24;
        const radians = (angle * Math.PI) / 180;

        return {
            x1: Math.cos(radians) * 5,
            y1: Math.sin(radians) * 5,
            x2: Math.cos(radians) * 40,
            y2: Math.sin(radians) * 40,
        };
    });

    return (
        <div className={styles.visual} aria-hidden="true">
            <svg
                viewBox="0 0 720 260"
                className={styles.svg}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Floating particles */}

                <circle
                    className={`${styles.particle} ${styles.particle1}`}
                    cx="115"
                    cy="78"
                    r="4"
                    fill="#FF9933"
                />

                <circle
                    className={`${styles.particle} ${styles.particle2}`}
                    cx="190"
                    cy="62"
                    r="3"
                    fill="#000080"
                />

                <circle
                    className={`${styles.particle} ${styles.particle3}`}
                    cx="275"
                    cy="88"
                    r="3"
                    fill="#D4D4D4"
                />

                <circle
                    className={`${styles.particle} ${styles.particle4}`}
                    cx="445"
                    cy="65"
                    r="3"
                    fill="#D4D4D4"
                />

                <circle
                    className={`${styles.particle} ${styles.particle5}`}
                    cx="535"
                    cy="82"
                    r="4"
                    fill="#FF9933"
                />

                <circle
                    className={`${styles.particle} ${styles.particle6}`}
                    cx="600"
                    cy="105"
                    r="3"
                    fill="#138808"
                />

                <circle
                    className={`${styles.particle} ${styles.particle7}`}
                    cx="145"
                    cy="170"
                    r="3"
                    fill="#138808"
                />

                <circle
                    className={`${styles.particle} ${styles.particle8}`}
                    cx="570"
                    cy="175"
                    r="3"
                    fill="#000080"
                />

                {/* Tricolor waves */}

                {/* Saffron */}
                <path
                    className={`${styles.wave} ${styles.saffron}`}
                    d="
                        M 70 139
                        C 160 74, 250 76, 330 129
                        C 410 182, 505 176, 650 104
                    "
                    stroke="#FF9933"
                    strokeWidth="25"
                    strokeLinecap="round"
                />

                {/* White */}
                <path
                    className={`${styles.wave} ${styles.white}`}
                    d="
                        M 70 157
                        C 160 92, 250 94, 330 147
                        C 410 200, 505 194, 650 122
                    "
                    stroke="#E5E7EB"
                    strokeWidth="24"
                    strokeLinecap="round"
                />

                {/* Green */}
                <path
                    className={`${styles.wave} ${styles.green}`}
                    d="
                        M 70 175
                        C 160 110, 250 112, 330 165
                        C 410 218, 505 212, 650 140
                    "
                    stroke="#138808"
                    strokeWidth="25"
                    strokeLinecap="round"
                />

                {/* Ashoka Chakra */}

                <g transform="translate(360 140)">
                    <g
                        className={styles.chakra}
                    >
                        {/* Outer ring */}
                        <circle
                            r="52"
                            fill="white"
                            stroke="#000080"
                            strokeWidth="4"
                        />

                        {/* Inner ring */}
                        <circle
                            r="45"
                            stroke="#000080"
                            strokeWidth="1.5"
                        />

                        {/* Spokes */}
                        {spokes.map((spoke, index) => (
                            <line
                                key={index}
                                x1={spoke.x1}
                                y1={spoke.y1}
                                x2={spoke.x2}
                                y2={spoke.y2}
                                stroke="#000080"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Centre */}
                        <circle
                            r="7"
                            fill="#000080"
                        />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default IndependenceDayVisual;
