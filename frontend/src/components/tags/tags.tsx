import React from 'react'
import ReactTags from 'react-tag-autocomplete'

import './tags.scss'



const TagComponent = ({ tag, onDelete}: {tag: {name: string}, onDelete: any}) => {
    return (
      <div className="word-tag">
        {tag.name}
        <span className="word-tag-del" onDoubleClick={onDelete}>✕</span>
      </div>
    )
}

type Props = {
      tags: string[]
    , onDelete: (i:number)=>void
    , onAddition: (tag: {name: string})=>void
    }

export default ({tags, onDelete, onAddition}: Props) => {

    return(
        <ReactTags 
            tags={tags.map(t=>({id: t, name: t}))}
            onDelete={onDelete}
            onAddition={onAddition}
            allowNew={true}
            allowBackspace={false}
            tagComponent={TagComponent}
            autoResize={true}
            placeholderText="       "
        />
    )
}