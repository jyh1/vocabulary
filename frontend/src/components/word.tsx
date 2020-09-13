import React from 'react'
import * as T from '../types'

type Props = {ps: T.WordPieces}

export default ({ps}: Props) => {
    return(
        <span className="word-pieces">
            {ps.map((p, i) => (<Piece wp={p} key={i}/>))}
        </span>
    )
}

const Piece = ({wp}: {wp: T.WordPiece}) => {
    if (typeof wp === "string"){
        return (<ruby>{wp}</ruby>)
    }
    const {text, kana} = wp
    return (<ruby>{text} <rt>{kana}</rt> </ruby>)
}

export const Description = ({desc}:{desc: string}) => {
    return(
        <>{desc.split("\n").map((s, i) => <p key={i}>{s}</p>)}</>
    )
}