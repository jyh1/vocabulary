import React, {useEffect, useRef, useState} from 'react'
import momentjs from 'moment'
import Modal from '../modal'
import * as T from '../../types'
import './wordcard.scss'
import Content, {Description} from '../word'
import * as A from '../../audio'
import Icon from '../icon'
import {getWordStem} from '../../utils'


type Props = {
      word: T.WordEntry
    , nextWord: ()=>void
    , prevWord: ()=>void
    , onClose: ()=>void
    , review: ()=>void
    , index: {widx: number, length: number}
    , prevUnreviewed: ()=>void
    , nextUnreviewed: ()=>void
    , autoplay: boolean
}

export default (props: Props) => {
    const {word, onClose} = props
    const card = word === null ? null : (<Card {...props}/>)
    return(
        <Modal content={card} onClose={onClose}/>
    )
}

const Card = ({word, prevWord: _prevWord, nextWord: _nextWord
    , onClose, review, index, autoplay,
    prevUnreviewed: _prevUnreviewed, 
    nextUnreviewed: _nextUnreviewed}: Props)=>{
    const {key, value:{content, description, tags, lastreview, reviewtime, reviewed}} = word
    const {widx, length} = index

    const [uncover, setUncover] = useState(false)

    const [recording, setRecording] = useState(false)
    
    const [mouseNav, setMouseNav] = useState(false)

    const hasPrev = widx > 0
    const hasNext = widx < length - 1
    const disableCls = (test: boolean, cls: string) => cls + (test ? " disabled" :  "")
    
    const startRecording = () => {
        if (!recording) A.recorder.record(key).then(()=>setRecording(true))
    }

    const doneRecording = () => {
        if (recording){
            setRecording(false)
            A.recorder.save()
        }
    }

    const play = () => {if (!recording) A.playAudio(key)}

    useEffect(()=>{
        if (!A.recorder.startNew(key) && autoplay){
            play()
        }
    }, [key])

    const changeAction= (act: ()=>void)=> (()=> 
        {  
            setUncover(false)
            act()
        })
    const prevWord = changeAction(_prevWord)
    const nextWord = changeAction(_nextWord)
    const nextUnreviewed = changeAction(_nextUnreviewed)
    const prevUnreviewed = changeAction(_prevUnreviewed)


    const since = momentjs(lastreview).fromNow()

    const topRef = useRef(null as HTMLDivElement | null)

    useEffect(()=>{
        topRef.current?.focus()
    }, [])

    const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key){
            case "a":
                prevWord()
                break
            case "s":
                review()
                break
            case "d":
                nextWord()
                break
            case "w":
                setUncover(!uncover)
                break
            case "q":
                prevUnreviewed()
                break
            case "e":
                nextUnreviewed()
                break
            case "p":
                if (recording) doneRecording(); else startRecording()
                break
            case "f":
                play()
                break
            case "l":
                window.open(`https://forvo.com/word/${getWordStem(word.value.content)}/#ja`, 'forvowindow',"height=600,width=600")
                break
            case "j":
                window.open(`https://jisho.org/search/${getWordStem(word.value.content)}`, 'jishowindow')
                break
            case 'x':
                A.speak(word.value.description)
                break
            case 'm':
                setMouseNav(!mouseNav)
        }
    }

    const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!mouseNav) return
        switch (e.button){
            case 0:
                // left click
                play()
                break
            case 4:
                // scroll button right
                review()
                break
        }
    }

    const handleWheelEvent = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!mouseNav) return
        if (e.deltaY > 0){
            if (e.deltaY < 10) {
                setUncover(true)
                A.speak(word.value.description)
            }

        } else {
            if (e.deltaY > -10) nextWord()
        }
    }

    return(
        <div 
            className={reviewed? "wordcard-wrapper reviewed" : "wordcard-wrapper"}
            onKeyDown={handleKeydown}
            onMouseDown={handleMouseEvent}
            onWheel={handleWheelEvent}
            tabIndex={0}
            ref={topRef}
        >
            <button className="close" 
                    onClick={onClose}
            >&times;</button>
            <div className="info">
                Reviewed {since}
            </div>
            <div className="wordcard-nav">

                <div className="wordcard">                    
                    <div className={"content" + (uncover ? " uncover": "")}>
                        <Content ps={content}/>
                    </div>
                    <div className="tags">
                        {tags.map((t, i)=><span key={i}>{t}</span>)}
                    </div>
                    <div className={"description" + (uncover ? " uncover": "")} >
                        <Description desc={description}/>
                    </div>
                    <div className="buttons">
                        <button title="S" disabled={reviewed} onClick={review}>Review {reviewtime}</button>
                    </div>
                </div>
                <div className={disableCls(hasPrev, "nav-left")} onClick={prevWord} title="A">
                    <Icon icon="chevron-left"/>
                </div>
                <div className={disableCls(hasNext, "nav-right")} onClick={nextWord} title="D">
                    <Icon icon="chevron-right"/>
                </div>
                <div className ="index">                    
                    {widx+1} / {length}
                    <span className={"mic" + (recording ? " active" : "")}><Icon icon="microphone"/></span>
                </div>
            </div>
        </div>
    )
}
