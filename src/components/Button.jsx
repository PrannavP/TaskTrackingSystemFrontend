import { useState } from 'react';

const colorMap = {
    primary: '#2e7d32',
    error: '#d32f2f',
    warning: '#f57c00',
};

const disabledColorMap = {
    primary: '#a5d6a7', // light green
    error: '#ef9a9a',   // light red
    warning: '#ffd180'  // light amber
};

const sizeMap = {
    small: { padding: '6px 10px', fontSize: 12 },
    md: { padding: '8px 14px', fontSize: 14 },
    medium: { padding: '8px 14px', fontSize: 14 },
    big: { padding: '10px 18px', fontSize: 16 },
};

const Button = ({
    color = 'primary',
    size = 'md',
    buttonType = 'contained',
    onClick,
    content = 'Click Me',
    isDisabled = false,
    children,
    ...props
}) => {
    const [hover, setHover] = useState(false);
    const resolvedColor = colorMap[color] || colorMap.primary;
    const resolvedDisabled = disabledColorMap[color] || '#cccccc';
    const sizeStyle = sizeMap[size] || sizeMap.md;

    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease',
        minWidth: 64,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: isDisabled ? 'none' : undefined,
        opacity: isDisabled ? 0.9 : 1,
        ...sizeStyle,
    };

    let style = { ...baseStyle };

    if (buttonType === 'contained') {
        style.background = isDisabled ? resolvedDisabled : resolvedColor;
        style.color = '#fff';
        style.border = 'none';
    } else if (buttonType === 'outlined') {
        style.background = 'transparent';
        style.color = isDisabled ? resolvedDisabled : resolvedColor;
        style.border = `1px solid ${isDisabled ? resolvedDisabled : resolvedColor}`;
    } else if (buttonType === 'text') {
        style.background = 'transparent';
        style.color = isDisabled ? resolvedDisabled : resolvedColor;
        style.border = 'none';
        if (hover && !isDisabled) {
            style.border = `1px solid ${resolvedColor}`;
            style.boxShadow = '0 0 0 2px rgba(0,0,0,0.04)';
        }
    }

    return (
        <button
            onClick={onClick}
            style={style}
            disabled={isDisabled}
            onMouseEnter={() => !isDisabled && setHover(true)}
            onMouseLeave={() => !isDisabled && setHover(false)}
            {...props}
        >
            {children || content}
        </button>
    );
};

export default Button;