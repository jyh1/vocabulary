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
    const [hide, setHide] = useState(false)
    const [widx, _setWIdx] = useState(null as number | null)
    const [refreshSt, refresh] = useState(false)
    const [editing, setEditing] = useState(null as number | null)
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

    const editWord = (i: number) => {
        const key = words[i].key
        return (w: T.WordInfo) => {
            return S.updateWord(key, ow => ({...ow, ...w}))
            .then((nw)=>{words[i].value=nw;refresh(!refreshSt)})
        }
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
        <div className={hide? "hide" : ""}>
        <div className="vocabulary">
            <Header 
                addWord={editing === null ? addWord : editWord(editing)}
                init={editing === null ? null : words[editing].value}
                cancel={()=>setEditing(null)}
                toggleHide={()=>setHide(!hide)}
                query={q=>console.log(q)}
            />
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
                            edit={()=>setEditing(i)}
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
        </div>
    )
}


const Entry = ({
    word, activate, del, review, edit}: 
    {word: T.WordEntry, activate: ()=>void, del: ()=>void, review: ()=>void, edit: ()=>void}) => {
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
            <td><div className="content">{<Word ps={content}/>}</div></td>
            <td><div className="description">{description}</div></td>
            <td valign="top" onClick={e=>e.stopPropagation()}>
                <Tags
                    onAddition={onAddition}
                    onDelete={onDelete}
                    tags={rtags}
                />
            </td>
            <td onClick={e=>e.stopPropagation()}>
                <Controls del={del} review={review} reviewed={reviewed} edit={edit}/>
            </td>
        </tr>
    )
}


const Controls = ({del, review, reviewed, edit}
                : {del: ()=>void, review: ()=>void, reviewed: boolean, edit: ()=>void}) => 
{
    return(
        <div className="controls">
            <button 
                className="edit"
                onClick={edit}
            ><Icon icon="pen-alt"/></button>
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