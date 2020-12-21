import localforage from 'localforage'
import {dumpInstance} from './dump'
import {serializeBlobArray} from '../serialize'

const audio = localforage.createInstance({
    name: "audio"
  });

export async function dumpAudio(){
    const audios = await dumpInstance(audio)
    const blobStrs = audios.map(([key, val]: [string, Blob[]]) => 
        serializeBlobArray(val).then((v: string[]) => ([key, v] as [string, string[]])))
    return await Promise.all(blobStrs)
}

export async function saveAudio(key: string, aud: Blob[]){
    await audio.setItem(key, aud)
    return key
}

export async function getAudio(key: string){
    const res = await audio.getItem(key)
    if (res){
        return res as Blob[]
    }
    return []
}

export async function delAudioWord(key: string){
    return await audio.removeItem(key)
}