import React, {useState} from 'react'
import './header.scss'
import Tooltip from '../tooltip/tooltip'
import Icon from '../icon'
import Tags from '../tags/tags'


type Props = {}

export default ({}: Props) => {
    return(
        <div className="header">
            <Buttons/>
            <Filter/>
        </div>
    )
}

const Buttons = () =>{
    return(
        <div className="header-buttons">
            <Tooltip>
                <div className="add"><Icon icon="plus"/></div>
                <NewWord/>
            </Tooltip>
        </div>
    )
}

const NewWord = () => {
    const rtags = ["n5", "boxing"]
    return(
        <div className="newword-form">
            <Tags 
                tags={rtags}
                onDelete={()=>{}}
                onAddition={()=>{}}
            />

            <div className="label">Word</div>
            <input type="text" className="word-input"/>
            <div className="label">Definition</div>
            <textarea/>
            <span className="save"><Icon icon="save"/></span>
        </div>
    )
}


const Filter = () => {
    return(
        <div className="header-query">
            <input type="text" spellCheck={false} placeholder="Input query..."/>
            <span className="icon"><Icon icon="search"/></span>
        </div>
    )
}


