import React, {useState, useEffect} from 'react';
import * as T from '../../types'
import Word from '../word'
import Tags from '../tags/tags'
import Header from './header'
import './wordTable.scss'
import * as S from '../../storage/service'
import WordCard from '../wordcard/wordcard'
import Icon from '../icon'

type Props = {}

function tagReview(w: T.KeyValue<T.Word>):T.WordEntry{
    return {...w, reviewed: false}
}

export default ({}: Props) => {
    const [words, setWords] = useState([] as T.WordEntry[])
    const [query, setQuery] = useState("")
    const [widx, _setWIdx] = useState(null as number | null)
    const [refreshSt, refresh] = useState(false)
    useEffect(()=>{
        S.listWords().then(ws => setWords(ws.map(tagReview)))
    }, [])

    const setWIdx = (i: number | null) => {
        if (i === null) _setWIdx(null)
        else if (0 <= i && i < words.length) _setWIdx(i)
    }

    const addWord = (w: T.WordInfo) => {
        return S.addWord(w).then(wi => setWords([tagReview(wi), ...words]))
    }

    const delWord = (i: number) => {
        return () => {
            S.delWord(words[i].key).then(() => {
                setWords(words.filter((_,j)=>i!==j))
            })
        }
    }

    const review = (i: number | null) => {
        if (i !==null && !words[i].reviewed) {
            const key = words[i].key
            S.reviewWord(key)
            .then((nw)=>{
                words[i]={key, value: nw, reviewed: true}
                refresh(!refreshSt)
            })
        }
    }

    return(
        <>
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
                    {words.map((w, i) => (
                        <Entry 
                            word={w} 
                            key={w.key}
                            activate={()=>{setWIdx(i)}}
                            del={delWord(i)}
                            review={()=>review(i)}
                        />))
                    }
                </tbody>
            </table>
        </div>
        {(widx!==null)?
        <WordCard
            onClose={()=>{setWIdx(null)}}
            nextWord={()=>{setWIdx(widx+1)}}
            prevWord={()=>{setWIdx(widx-1)}}
            review={()=>review(widx)}
            word={words[widx]}
            index={{widx, length: words.length}}
        />: <></>}
        </>
    )
}


const Entry = ({
    word, activate, del, review}: 
    {word: T.WordEntry, activate: ()=>void, del: ()=>void, review: ()=>void}) => {
    const {content, tags, description} = word.value
    const reviewed = word.reviewed
    const [rtags, setRtags] = useState(tags)
    const onAddition = (tag: T.Tag) => {
        setRtags([...rtags, tag.name])
    }
    const onDelete = (i:number) => {
        setRtags(rtags.filter((tag, index) => index !== i))
    }
    return(
        <tr onClick={activate} className={reviewed ? "reviewed" : ""}>
            <td>{<Word ps={content}/>}</td>
            <td>{description}</td>
            <td valign="top" onClick={e=>e.stopPropagation()}>
                <Tags
                    onAddition={onAddition}
                    onDelete={onDelete}
                    tags={rtags}
                />
            </td>
            <td onClick={e=>e.stopPropagation()}>
                <Controls del={del} review={review} reviewed={reviewed}/>
            </td>
        </tr>
    )
}


const Controls = ({del, review, reviewed}
                : {del: ()=>void, review: ()=>void, reviewed: boolean}) => 
{
    return(
        <div className="controls">
            <button className="edit"><Icon icon="pen-alt"/></button>
            <button 
                className="review"
                onClick={review}
            ><Icon icon={reviewed ? "book-open" : "book"}/></button>
            <button 
                className="delete"
                onDoubleClick={del}
                ><Icon icon="trash-alt"/>
            </button>
        </div>
    )
}