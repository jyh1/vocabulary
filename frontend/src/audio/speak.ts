
const synth = window.speechSynthesis;

export function speak(t: string){
    const utterThis = new SpeechSynthesisUtterance(t);
    synth.speak(utterThis);
}
