import { delAudioWord, dumpAudio } from './audio'
import { delVocabWord, dumpVocab } from './vocab'

export * from './audio'
export * from './vocab'

export async function dumpDb(){
    const vocab = await dumpVocab()
    const audio = await dumpAudio()
    return JSON.stringify({vocab, audio})
}

export async function delWord(key: string){
    await delAudioWord(key)
    await delVocabWord(key)
}