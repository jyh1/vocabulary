import localforage from 'localforage'

const audio = localforage.createInstance({
    name: "audio"
  });

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