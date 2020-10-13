import * as S from '../storage'

const audio = new Audio()

export function stopAudio(){
    audio.pause()
    audio.currentTime=0
}

export async function playAudio(key: string){
    const chunks = await S.getAudio(key)
    if (chunks.length > 0){
        const blob = new Blob(chunks,  { 'type' : 'audio/ogg; codecs=opus' });
        const audioURL = window.URL.createObjectURL(blob);
        if (audio.src){
            window.URL.revokeObjectURL(audio.src)
        }
        audio.src = audioURL
        audio.play()    
    }
}

