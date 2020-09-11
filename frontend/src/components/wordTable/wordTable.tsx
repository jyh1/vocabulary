import React, {useState, useRef, useEffect} from 'react';
import * as T from '../../types'
import Word from '../word'
import Tags from '../tags/tags'
import Header from './header'
import './wordTable.scss'


type Props = {words: T.Word[]}

export default ({words}: Props) => {
    return(
        <div className="vocabulary">
            <Header/>
            <table className="word-table">
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Description</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((w, i) => (<Entry word={w} key={i}/>))}
                </tbody>
            </table>
        </div>
    )
}


const Entry = ({word}: {word: T.Word}) => {
    const {content, tags, description} = word
    const [rtags, setRtags] = useState(tags)
    const ref = useRef(null)
    const onAddition = (tag: T.Tag) => {
        setRtags([...rtags, tag.name])
    }
    const onDelete = (i:number) => {
        setRtags(rtags.filter((tag, index) => index !== i))
    }
    return(
        <tr>
            <td>{<Word ps={content}/>}</td>
            <td>{description}</td>
            <td>
                <Tags 
                    onAddition={onAddition}
                    onDelete={onDelete}
                    tags={rtags}
                />
            </td>
        </tr>
    )
}
