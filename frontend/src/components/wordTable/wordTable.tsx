import React, {useState, useRef, useEffect} from 'react';
import ReactTags from 'react-tag-autocomplete'
import * as T from '../../types'
import Word from '../word'
import './wordTable.scss'


type Props = {words: T.Word[]}

export default ({words}: Props) => {
    return(
        <div className="vocabulary">
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

type Tag = {id: string, name: string}

const Entry = ({word}: {word: T.Word}) => {
    const {content, tags, description} = word
    const [rtags, setRtags] = useState(tags)
    const ref = useRef(null)
    const onAddition = (tag: Tag) => {
        setRtags([...rtags, tag.name])
    }
    const onDelete = (i:number) => {
        setRtags(rtags.filter((tag, index) => index !== i))
    }

    const TagComponent = ({ tag, onDelete}: {tag: Tag, onDelete: any}) => {
        return (
          <div className="word-tag">
            {tag.name}
            <span className="word-tag-del" onDoubleClick={onDelete}>✕</span>
          </div>
        )
    }
    return(
        <tr>
            <td>{<Word ps={content}/>}</td>
            <td>{description}</td>
            <td>
                <ReactTags 
                    ref={ref}
                    tags={rtags.map(t=>({id: t, name: t}))}
                    onDelete={onDelete}
                    onAddition={onAddition}
                    allowNew={true}
                    allowBackspace={false}
                    tagComponent={TagComponent}
                    autoResize={false}
                />
            </td>
        </tr>
    )
}
