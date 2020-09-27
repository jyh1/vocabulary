import { Parser } from 'typescript-parsec';
import { buildLexer, expectEOF, expectSingleResult } from 'typescript-parsec';
import { opt_sc, apply, kmid, rep_sc, seq, str, tok } from 'typescript-parsec';
import * as T from '../types'

enum Token {
      Character
    , LParen
    , RParen
}

const lexer = buildLexer([
    [true, /^[^()]/g, Token.Character],
    [true, /^\(/g, Token.LParen],
    [true, /^\)/g, Token.RParen],
])

type P<T> = Parser<Token, T>

const Character: P<string> = apply(tok(Token.Character), v => v.text)

const Text: P<string> = apply(rep_sc(Character), v=>v.join(''))

const Annot: P<string> = kmid(tok(Token.LParen), Text, tok(Token.RParen))

const Piece: P<T.WordPiece> = 
    apply(seq(Character, opt_sc(Annot)),
        ([t, anno]) => (anno ? {text: t, kana: anno}: t))

export const Pieces: P<T.WordPieces> = 
    apply(seq(Piece, rep_sc(Piece)), ([v, vs]) => [v, ...vs])

export function parseWordPieces(input: string): T.WordPieces{
    return expectSingleResult(expectEOF(Pieces.parse(lexer.parse(input.trim()))))
}
