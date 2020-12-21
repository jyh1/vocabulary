
import localforage from 'localforage'
import * as T from '../types'
import {dumpInstance} from './dump'

const vocabulary = localforage.createInstance({
    name: "vocabulary"
  });

export async function dumpVocab(){
    return await dumpInstance(vocabulary)
}


export async function saveWord(key: string, word: T.Word){
    await vocabulary.setItem(key, word)
    return key
}

let SESSIONCOUNT = 0

export async function addWord(word: T.WordInfo){
    const key = Date.now().toString() + "." + (SESSIONCOUNT ++)
    const newword: T.Word = {...word, reviewtime: 1, lastreview: new Date(), reviewed: false}
    await saveWord(key, newword)
    return {key, value: newword} as T.KeyValue<T.Word>
}

export async function addWords(words: T.WordInfo[]){
    return await Promise.all(words.map(addWord))
}

export async function updateWord<T extends T.Word | undefined>(key: string, f: (w:T.Word)=> T){
    const oldword = await vocabulary.getItem(key) as T.Word
    const newword = f(oldword)
    if (newword !== undefined) {
        await saveWord(key, newword as T.Word)
        return newword as T.Word
    }
    return oldword
}

export async function reviewWord(key: string){
    const update = (w: T.Word) => {
        w.reviewtime += 1
        w.lastreview = new Date()
        w.reviewed = true
        return w
    }
    return await updateWord(key, update)
}


export async function updateWordField<K extends keyof T.Word, V extends T.Word[K]>(key: string, field: K, val: V){
    const update = (w: T.Word) => {
        w[field] = val
        return w
    }
    return await updateWord(key, update)
}

export async function listWords(test ?: (w: T.Word)=>boolean){
    var words: T.KeyValue<T.Word>[] = []
    const cond = test ? test : (()=>true)
    await vocabulary.iterate((value: T.Word, key)=>{
        if (cond(value)){
            words.push({key, value})
        }
    })
    return words
}

export function updateTags(f: (ts: Set<T.Tag>)=>Set<T.Tag>){
    const update = (w: T.Word) => {
        const newtags = [...f(new Set(w.tags)).keys()]
        if (newtags.length != w.tags.length){
            w.tags = newtags
            return w
        }
        return undefined
    }
    return (key: string) => updateWord(key, update)
}

export function pushTags(tags: T.Tag[]){
    const union = (s: Set<T.Tag>) => {
        for (const t of tags){ s.add(t)}
        return s
    }
    return updateTags(union)
}

export function popTags(tags: T.Tag[]){
    const minus = (s: Set<T.Tag>) => {
        for (const t of tags){ s.delete(t)}
        return s
    }
    return updateTags(minus)
}

export async function delVocabWord(key: string){
    return await vocabulary.removeItem(key)
}

export async function vocabularySize(){
    return await vocabulary.length()
}

export async function clearWord(key: string){
    const update = (w: T.Word) => {
        if (w.reviewed){
            w.reviewed = false
            return w
        }
        return undefined
    }
    return await updateWord(key, update)
}

export async function clearWords(keys: string[]){
    return await Promise.all(keys.map(clearWord))
}

export async function newSession(){
    const keys = await vocabulary.keys()
    clearWords(keys)
}