import React, {useState, useEffect } from "react";
import PropTypes from "prop-types";

const Btn = ({ classNames, text, type, onClick, disabled}) =>{
    const [attributes, setAttributes] = useState({
        classNames: `btn ${classNames}`
    });

    useEffect (()=>{
        if(disabled){
            setAttributes({
                ...attributes,
                disabled,
                classNames: `btn ${classNames} btn--disabled`
            });
        }else {
            setAttributes({
                ...attributes,
                classNames: `btn ${classNames}`
            });
        }
    }, [disabled]);

    useEffect(()=>{
        if (type) setAttributes({ ...attributes, type});
        else setAttributes({ ...attributes, type: "button"});
    }, [type]);

    useEffect(()=>{
        if (onClick) setAttributes({ ...attributes, onClick });
    }, [onClick]);

    return(
        <button {...attributes}>
            <span>{text}</span>
        </button>
    );
};

Btn.propTypes = {
    classNames: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default Btn;