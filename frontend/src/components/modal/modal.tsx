import React from 'react'
import './modal.scss'
import { isNull } from 'util'

type Props = {content: JSX.Element | null, onClose: ()=>void}
export default ({content, onClose}: Props) =>{
    if (isNull(content)) {return (<></>)}
    return(
        <div 
            className="modal" 
            tabIndex={0}
            onKeyDown={e=>{if (e.keyCode===27) onClose()}}
        >
            <div className="modal-content">
                {content}
            </div>
        </div>
    )
}
