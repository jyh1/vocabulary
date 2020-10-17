import { dumpAudio } from './audio'
import { dumpVocab } from './vocab'

export * from './audio'
export * from './vocab'

export async function dumpDb(){
    const vocab = await dumpVocab()
    const audio = await dumpAudio()
    return JSON.stringify({vocab, audio})
}