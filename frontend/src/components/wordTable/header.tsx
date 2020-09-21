import React, {useState, useRef, useEffect} from 'react'
import './header.scss'
import Tooltip from '../tooltip/tooltip'
import Icon from '../icon'
import Tags from '../tags/tags'
import * as T from '../../types'
import {serializeWordPieces} from '../../utils'
import {parseWordPieces} from '../../parser/parser'


type Props = {addWord: AddWord, init: T.WordInfo | null, cancel: ()=>void}

type AddWord = (w: T.WordInfo)=>Promise<void>

export default (props: Props) => {
    return(
        <div className="header">
            <Buttons {...props}/>
            <Filter/>
        </div>
    )
}

const Buttons = (props: Props) =>{
    return(
        <div className="header-buttons">
            <NewWord {...props}/>
        </div>
    )
}

const NewWord = ({addWord, init, cancel}: Props) => {
    const [rtags, setRtags] = useState([] as string[])
    const descRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>
    const contRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const [active, setActive] = useState(false)

    const resetEditor = () => {
        contRef.current.value=""
        descRef.current.value=""
        contRef.current.focus()
    }

    const cancelEdit = () => {
        setActive(false)
        cancel()
    }
    
    useEffect(()=>{
        if (init === null){
            resetEditor()
        } else {
            setActive(true)
            descRef.current.value = init.description
            contRef.current.value = serializeWordPieces(init.content)
            setRtags(init.tags)
        }
    }, [init])

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
            .then(() => {resetEditor(); if (init !== null) cancelEdit()})
        } catch(e){
            setError(true)
        }
    }
    return(
        <Tooltip active={active}>
            <button 
                onClick={() => active ? cancelEdit() : setActive(true)} 
                className="add"
            ><Icon icon="plus"/></button>

            <div
            className="newword-form">
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
                <div className="buttons">
                    <button className="save" onClick={create}><Icon icon="save"/></button>
                    <button className="cancel" onClick={cancelEdit}><Icon icon="ban"/></button>
                </div>
            </div>
        </Tooltip>
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


