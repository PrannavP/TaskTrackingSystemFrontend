const THEME = '#2e7d32';

const styles = {
    container: {
        width: 180,
        padding: '14px 18px',
        borderRadius: 12,
        background: 'linear-gradient(180deg, #ffffff 0%, #e8f5e9 100%)',
        boxShadow: '0 8px 20px rgba(46,125,50,0.08)',
        border: '1px solid rgba(46,125,50,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        textAlign: 'center',
    },
    title: {
        margin: 0,
        fontSize: '0.78rem',
        color: 'rgba(46,125,50,0.9)',
        letterSpacing: '0.04em',
        fontWeight: 600,
        textTransform: 'uppercase',
    },
    count: {
        margin: 0,
        fontSize: '1.9rem',
        fontWeight: 700,
        color: THEME,
        lineHeight: 1,
    },
};

const MetricsCard = ({ title = 'TITLE', count = 6 }) => {
    return (
        <div style={styles.container}>
            <h5 style={styles.title}>{title}</h5>

            <p style={styles.count}>{count}</p>
        </div>
    );
};

export default MetricsCard;