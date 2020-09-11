import React, {useState, useRef, useEffect} from 'react';
import * as T from '../../types'
import Word from '../word'
import Tags from '../tags/tags'
import Header from './header'
import './wordTable.scss'
import * as S from '../../storage/service'

type Props = {}

export default ({}: Props) => {
    const [words, setWords] = useState([] as T.KeyValue<T.Word>[])
    const [query, setQuery] = useState("")
    useEffect(()=>{
        S.listWords().then(ws => setWords(ws))
    }, [])

    const addWord = (w: T.WordInfo) => {
        return S.addWord(w).then(wi => setWords([wi, ...words]))
    }

    return(
        <div className="vocabulary">
            <Header addWord={addWord}/>
            <table className="word-table">
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Description</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((w) => (<Entry word={w.value} key={w.key}/>))}
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
            <td valign="top">
                <Tags 
                    onAddition={onAddition}
                    onDelete={onDelete}
                    tags={rtags}
                />
            </td>
        </tr>
    )
}
