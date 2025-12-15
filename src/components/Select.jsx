import React from "react";
import ReactSelect from "react-select";

const Select = ({ options = [], value, onChange, placeholder = '', isClearable = false, isMulti = false, ...props }) => {
    // Normalize options to { label, value }
    const normalizedOptions = (options || []).map(opt => {
        if (opt && typeof opt === 'object' && 'value' in opt && 'label' in opt) return opt;
        return { label: String(opt), value: opt };
    });

    // selected value(s) for react-select
    let selected = null;
    if (isMulti) {
        const arr = Array.isArray(value) ? value : (value == null ? [] : [value]);
        selected = normalizedOptions.filter(o => arr.includes(o.value));
    } else {
        selected = normalizedOptions.find(o => o.value === value) || null;
    }

    const handleChange = (selectedOption) => {
        if (isMulti) {
            if (!selectedOption) return onChange && onChange([]);
            return onChange && onChange(selectedOption.map(o => o.value));
        }

        if (!selectedOption) return onChange && onChange(null);
        return onChange && onChange(selectedOption.value);
    };

    return (
        <ReactSelect
            options={normalizedOptions}
            value={selected}
            onChange={handleChange}
            placeholder={placeholder}
            isClearable={isClearable}
            isMulti={isMulti}
            {...props}
        />
    );
};

export default Select;