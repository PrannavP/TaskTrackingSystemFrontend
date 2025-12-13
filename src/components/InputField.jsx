import { useState, useRef } from "react";

const InputField = ({ type, classname, className, isRequired = true, validationMessage, labelTxt, ...props }) => {
    const inputClass = classname || className || '';
    const [touched, setTouched] = useState(false);
    const [showError, setShowError] = useState(false);
    const inputRef = useRef(null);

    const checkValidity = () => {
        const el = inputRef.current;
        if (!el) return true;
        return el.checkValidity();
    };

    const handleBlur = (e) => {
        setTouched(true);
        setShowError(!checkValidity());
        if (props.onBlur) props.onBlur(e);
    };

    const handleChange = (e) => {
        if (touched) {
            setShowError(!checkValidity());
        }
        if (props.onChange) props.onChange(e);
    };

    return(
        <div className="input-field-container">
            <label>{labelTxt} {isRequired ? <span style={{ color: 'red' }}>*</span> : ''} </label>
            
            <input
                ref={inputRef}
                type={type}
                className={inputClass}
                required={isRequired}
                onBlur={handleBlur}
                onChange={handleChange}
                {...props}
            />

            <p className="input-field-error-message" style={{ display: showError ? 'block' : 'none' }}>
                {validationMessage}
            </p>
        </div>
    );
};

export default InputField;