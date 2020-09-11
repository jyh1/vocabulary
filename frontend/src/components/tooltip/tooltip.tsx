import React, {useState} from 'react'
import './tooltip.scss'

type Props = {children: [JSX.Element, JSX.Element]}

export default ({children}: Props)=>{
    const [ele, tooltip] = children
    const [active, setActive] = useState(false)
    return(
        <div className={active ? "tooltip-wrapper active": "tooltip-wrapper"}>
            <div className="tooltip-ele" onClick={()=>setActive(!active)}>
                {ele}
            </div>
            <div className="tooltip-tooltip">
                {tooltip}
            </div>
        </div>
    )
}