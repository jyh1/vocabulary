
import * as T from './types'

export function serializeWordPieces(ps: T.WordPieces): string {
    return ps.map(p => typeof p==="string"? p : (p.text + "(" + p.kana + ")")).join('')
}