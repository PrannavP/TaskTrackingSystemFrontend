import { useState, useEffect } from "react";

const styles = {
    container: {
        height: 6,
        width: '100%',
        background: '#eef2ff',
        borderRadius: 6,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        background: 'linear-gradient(90deg,#60a5fa,#2563eb)',
        borderRadius: 6,
        transition: 'width 260ms linear',
    },
};

const ProgressBar = ({ indeterminate = true, progress = 0 }) => {
    const [p, setP] = useState(indeterminate ? 6 : Math.max(0, Math.min(100, progress)));

    useEffect(() => {
        if (!indeterminate) {
            setP(Math.max(0, Math.min(100, progress)));
            return;
        }

        let mounted = true;
        let value = 6;
        const id = setInterval(() => {
            // increase randomly to simulate progress until a high watermark
            value = Math.min(92, value + 4 + Math.random() * 8);
            if (mounted) setP(value);
        }, 400);

        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, [indeterminate, progress]);

    return (
        <div style={styles.container} aria-hidden>
            <div style={{ ...styles.bar, width: `${p}%` }} />
        </div>
    );
};

export default ProgressBar;
