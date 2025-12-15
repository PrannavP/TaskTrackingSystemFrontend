const Spinner = ({ size = 36 }) => {
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    };

    return (
        <div style={containerStyle} aria-hidden>
            <svg width={size} height={size} viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="#e8f5e9" strokeWidth="5" />
                <path
                    d="M25 5 a20 20 0 0 1 0 40"
                    fill="none"
                    stroke="#2e7d32"
                    strokeWidth="5"
                    strokeLinecap="round"
                >
                    <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
                </path>
            </svg>
        </div>
    );
};

export default Spinner;
