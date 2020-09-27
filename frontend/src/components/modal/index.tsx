import React from 'react'
import './modal.scss'

type Props = {content: JSX.Element | null, onClose: ()=>void}
export default ({content, onClose}: Props) =>{
    if (content === null) {return (<></>)}
    return(
        <div 
            className="modal" 
            // tabIndex={0}
            onKeyDown={e=>{if (e.key==="Escape") onClose()}}
        >
            <div className="modal-content">
                {content}
            </div>
        </div>
    )
}
