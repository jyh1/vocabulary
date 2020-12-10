
import * as T from './types'

function optParen(t: string){
    if (t.length > 1) return "(" + t + ")"
    return t
}

export function serializeWordPieces(ps: T.WordPieces): string {
    return ps.map(p => typeof p==="string"? p : (optParen(p.text) + "(" + p.kana + ")")).join('')
}

export function getWordStem(ps: T.WordPieces): string {
    return ps.map(p => typeof p==="string"? p : p.text).join('')
}

function printWord(w: T.WordInfo): string{
    const tags = w.tags.map(t => '#'+t).join(' ')
    return [tags, serializeWordPieces(w.content), w.description, tags].join('\n')
}

function printWords(ws: T.WordInfo[]): string{
    return ws.map(printWord).join('\n')
}

function printWordEntries(ws: T.WordEntry[]): string{
    return "Insert\n" + printWords(ws.map(w => w.value))
}

export function downloadVocabulary(ws: T.WordEntry[]){
    download("query.txt", printWordEntries(ws))
}

export function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

