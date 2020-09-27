import React, {useState} from 'react'
import './tooltip.scss'

type Props = {children: [JSX.Element, JSX.Element], active: boolean}

export default ({children, active}: Props)=>{
    const [ele, tooltip] = children
    return(
        <div className={active ? "tooltip-wrapper active": "tooltip-wrapper"}>
            <div 
                className={active ? "tooltip-ele active" : "tooltip-ele"} 
            >
                {ele}
            </div>
            <div className="tooltip-tooltip">
                {tooltip}
            </div>
        </div>
    )
}