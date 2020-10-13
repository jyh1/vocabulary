import * as S from '../storage'

class Recorder {
    recorder: MediaRecorder | null
    chunks: Blob[]
    audio: HTMLAudioElement
    key: string | null
    constructor(){
        this.recorder = null
        this.chunks = []
        this.audio = new Audio()
        this.key = null
    }

    async setup(){
        if (this.recorder === null){
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            this.recorder = new MediaRecorder(stream)
            this.recorder.ondataavailable = e => {
                if (e.data.size > 0){
                    this.chunks.push(e.data)
                }
            }
        }
    }

    _save(){
        if (this.key !== null){
            S.saveAudio(this.key, this.chunks)
            this.key = null
        }
        this.chunks = []
    }


    async record(key: string){
        await this.setup()
        if (this.key !== null){
            await this.save()
        }
        this.key = key
        if (this.recorder){
            this.recorder.start(10)
        }
    }

    save(){
        if (this.recorder && this.recorder.state==="recording"){
            this.recorder.onstop = () => this._save()
            this.recorder.stop()
        }
    }

    startNew(key: string){
        if (this.recorder && this.recorder.state==="recording"){
            this.recorder.onstop = () => {
                this._save()
                this.record(key)
            }
            this.recorder.stop()
        }
    }
}

export const recorder = new Recorder()