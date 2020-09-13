import React from 'react'

import Modal from '../modal/modal'
import Tags from '../tags/tags'
import * as T from '../../types'
import './wordcard.scss'
import Content, {Description} from '../word'
import Icon from '../icon'
import { isNull } from 'util'


type Props = {
      word: T.KeyValue<T.Word>
    , nextWord: ()=>void
    , prevWord: ()=>void
    , onClose: ()=>void
}

export default (props: Props) => {
    const {word, onClose} = props
    if (!isNull(word)){
        const card = isNull(word) ? null : (<Card {...props}/>)
        return(
            <Modal content={card} onClose={onClose}/>
        )
    }
    return (<></>)
}

const Card = ({word}: Props)=>{
    const {key, value:{content, description, tags, lastreview, reviewtime}} = word
    return(
        <div className="wordcard-wrapper">
            <div className="wordcard">
                <button className="close" 
                    onClick={()=>{}}
                >&times;</button>
                <div className="content">
                    <Content ps={content}/>
                </div>
                <div className="tags">
                    {tags.map((t, i)=><span key={i}>{t}</span>)}
                </div>
                <div className="description">
                    <Description desc={description}/>
                </div>
            </div>
            <div className="nav-left" title="A">
                <Icon icon="chevron-left"/>
            </div>
            <div className="nav-right" title="D">
                <Icon icon="chevron-right"/>
            </div>
        </div>
    )
}