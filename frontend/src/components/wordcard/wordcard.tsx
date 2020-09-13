import React from 'react'

import Modal from '../modal/modal'
import Tags from '../tags/tags'
import * as T from '../../types'
import './wordcard.scss'
import Content, {Description} from '../word'
import { isNull } from 'util'


type Props = {
      word: T.KeyValue<T.Word> | null
    , nextWord: ()=>void
    , prevWord: ()=>void
    , onClose: ()=>void
}

export default ({word, onClose}: Props) => {
    const card = isNull(word) ? null : (<Card word={word}/>)
    return(
        <Modal content={card} onClose={onClose}/>
    )
}

const Card = ({word}: {word: T.KeyValue<T.Word>})=>{
    const {key, value:{content, description, tags, lastreview, reviewtime}} = word
    return(
        <div className="wordcard">
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
    )
}