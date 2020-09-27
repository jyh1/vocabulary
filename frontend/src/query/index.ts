import * as T from '../types'
import * as S from '../storage'

export function executeInsert(insertEntries: T.Insert["words"]){
    let tags : {[t:string]: null} = {}
    let words: T.WordInfo[] = []
    insertEntries.forEach(e => {
        if (Array.isArray(e)){
            e.forEach(t => {if (t in tags) {delete tags[t]} else {tags[t]=null}})
        } else {
            words.push({...e, tags: Object.keys(tags)})
        }
    })
    return S.addWords(words)
}

