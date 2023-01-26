import React, {useState} from "react";
import PropTypes from "prop-types";

const Filter = ({ searchFor, returnText}) =>{
    const [text, setText] = useState("");
    const onChange=(e)=>{
        e.preventDefault();
        const val = e.target.value;
        const regex = /^[a-zñáéíóú0-9 ]*$/i;

        if(regex.test(val)|| val === ""){
            setText(val);
            returnText(val);
        }
    };

    return(
        <div className="filter">
            <div className="filter--content">
                <input type="text" value={text} className="filter--input" onChange={onChange} placeholder={`Cari ${searchFor}`}/>
            </div>
        </div>
    )
};

Filter.propTypes ={
    searchFor: PropTypes.string.isRequired,
    returnText: PropTypes.func.isRequired
};

export default Filter;