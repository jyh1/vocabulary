import React, {useState, useRef, useEffect} from 'react'
import './header.scss'
import Tooltip from '../tooltip/tooltip'
import Icon from '../icon'
import Tags from '../tags/tags'
import * as T from '../../types'
import {serializeWordPieces} from '../../utils'
import {parseWordPieces, parseQuery} from '../../parser/parser'


type Props = {
      addWord: AddWord
    , init: T.WordInfo | null
    , cancel: ()=>void
    , toggleHide: ()=>void
    , query: (q: T.Query)=>void
}

type AddWord = (w: T.WordInfo)=>Promise<void>

export default (props: Props) => {
    return(
        <div className="header">
            <Buttons {...props}/>
            <Filter query={props.query}/>
        </div>
    )
}

const Buttons = (props: Props) =>{
    return(
        <div className="header-buttons">
            <NewWord {...props}/>
            <button onClick={props.toggleHide}><Icon icon="eye-slash"/></button>
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
        setError(false)
        cancel()
    }
    
    useEffect(()=>{
        if (init === null){
            resetEditor()
        } else {
            setActive(true)
            setError(false)
            descRef.current.value = init.description
            contRef.current.value = serializeWordPieces(init.content)
            setRtags(init.tags)
        }
    }, [init])

    const [error, setError] = useState(false)
    const delTag = (i:number) =>{
        setRtags(rtags.filter((_, j)=>j!==i))
    }
    const addTag = (tag: {name: string})=>{
        setRtags([...rtags, tag.name])
    }
    const parenShortcut = (e: React.KeyboardEvent) =>{
        if (e.key==="Escape"){
            insertParens(contRef)
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
            console.log(e)
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


const Filter = ({query}: {query: (q:T.Query)=>void}) => {
    const [active, setActive] = useState(false)
    const tref = useRef() as React.MutableRefObject<HTMLTextAreaElement>
    const execute = ()=>{
        if (tref.current) {
            const txt = tref.current.value
            query(parseQuery(txt))
        }
    }
    const onKeyDown = (e: React.KeyboardEvent)=>{
        if (e.key === "Escape"){
            insertParens(tref)
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter"){
            execute()
        }
    }
    return(
        <div className="header-query">
            <textarea 
                onKeyDown={onKeyDown}
                ref={tref}
                rows={active ? 20 : 1}
                placeholder="Input query"
                onFocus={()=>setActive(true)}
                onBlur={()=>setActive(false)}
            />
            <span
                className="icon"
                onClick={execute}
                ><Icon icon="search"/></span>
        </div>
    )
}


function insertParens(ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>){
    const idx = ref.current.selectionStart
    if (idx !== null){
        const text = ref.current.value
        ref.current.value=text.slice(0, idx) + "()" + text.slice(idx)
        ref.current.selectionStart = idx + 1
        ref.current.selectionEnd = idx + 1
    }
}