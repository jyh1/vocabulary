import React, {useState, useEffect} from 'react';
import * as T from '../../types'
import Word from '../word'
import Header from './header'
import './wordTable.scss'
import * as S from '../../storage'
import * as Q from '../../query'
import WordCard from '../wordcard'
import Icon from '../icon'

type Props = {}

function tagReview(w: T.KeyValue<T.Word>):T.WordEntry{
    return {...w, reviewed: false}
}

export default ({}: Props) => {
    const [words, setWords] = useState([] as T.WordEntry[])
    const [hide, setHide] = useState(false)
    const [widx, _setWIdx] = useState(null as number | null)
    const [refreshSt, refresh] = useState(false)
    const [editing, setEditing] = useState(null as number | null)
    const [vocabSize, setVocabSize] = useState(0)

    useEffect(()=>{S.vocabularySize().then(setVocabSize)})

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

    const executeQuery = (query: T.Query) => {
        console.log(query)
        switch(query.type){
            case "Insert":
                Q.executeInsert(query.words).then(
                    newwords => {
                        setWords([...newwords.map(tagReview), ...words])
                    }
                )
                break
            case "Filter":
                S.listWords(Q.evalExpr(query.expr) as (w: T.Word)=>boolean)
                    .then(ws => setWords(ws.map(tagReview)))
                break

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
                query={executeQuery}
            />
            <div className="table_info">
                {words.length} out of {vocabSize} words selected.
            </div>
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
    return(
        <tr onClick={activate} className={reviewed ? "reviewed" : ""}>
            <td><div className="content">{<Word ps={content}/>}</div></td>
            <td><div className="description">{description}</div></td>
            <td valign="top">
                <div className="tags">
                    {tags.map((t, i)=><span key={i}>{t}</span>)}
                </div>
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
