import React from 'react'
import * as T from '../types'

type Props = {ps: T.WordPieces}

export default ({ps}: Props) => {
    return(
        <span>
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