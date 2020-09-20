import React, {useState, useRef} from 'react'
import './header.scss'
import Tooltip from '../tooltip/tooltip'
import Icon from '../icon'
import Tags from '../tags/tags'
import * as T from '../../types'
import {parseWordPieces} from '../../parser/parser'


type Props = {addWord: AddWord}

type AddWord = (w: T.WordInfo)=>Promise<void>

export default ({addWord}: Props) => {
    return(
        <div className="header">
            <Buttons addWord={addWord}/>
            <Filter/>
        </div>
    )
}

const Buttons = ({addWord}: {addWord: AddWord}) =>{
    return(
        <div className="header-buttons">
            <Tooltip>
                <button className="add"><Icon icon="plus"/></button>
                <NewWord addWord={addWord}/>
            </Tooltip>
        </div>
    )
}

const NewWord = ({addWord}: {addWord: AddWord}) => {
    const [rtags, setRtags] = useState([] as string[])
    const descRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>
    const contRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const [error, setError] = useState(false)
    const delTag = (i:number) =>{
        setRtags(rtags.filter((_, j)=>j!==i))
    }
    const addTag = (tag: T.Tag)=>{
        setRtags([...rtags, tag.name])
    }
    const parenShortcut = (e: React.KeyboardEvent) =>{
        if (e.key==="Escape"){
            const idx = contRef.current.selectionStart
            if (idx !== null){
                const text = contRef.current.value
                contRef.current.value=text.slice(0, idx) + "()" + text.slice(idx)
                contRef.current.selectionStart = idx + 1
                contRef.current.selectionEnd = idx + 1
            }
        }
        setError(false)
    }

    const handleTextAreaKey = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter"){
            create()
        }
    }
    const create = () => {
        try{
            const content = parseWordPieces(contRef.current.value)
            const description = descRef.current.value
            addWord({content, description, tags: rtags})
            .then(()=>{
                contRef.current.value=""
                descRef.current.value=""
                contRef.current.focus()
            })
        } catch(e){
            setError(true)
        }
    }
    return(
        <div className="newword-form">
            <Tags 
                tags={rtags}
                onDelete={delTag}
                onAddition={addTag}
            />

            <div className="label">Word</div>
            <input 
                onKeyDown={parenShortcut} 
                ref={contRef} 
                type="text" 
                className={error ? "word-input error" : "word-input"}
                placeholder="e.g. 見(み)る. Press [Esc] to insert ()"
            />
            <div className="label">Definition</div>
            <textarea onKeyDown={handleTextAreaKey} ref={descRef}/>
            <button className="save" onClick={create}><Icon icon="save"/></button>
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


