import { Parser } from 'typescript-parsec';
import { buildLexer, expectEOF, expectSingleResult } from 'typescript-parsec';
import { opt_sc, apply, kmid, rep_sc, seq, str, tok } from 'typescript-parsec';
import * as T from '../types'

enum TokenKind {
      Character
    , LParen
    , RParen
}

const lexer = buildLexer([
    [true, /^[^()]/g, TokenKind.Character],
    [true, /^\(/g, TokenKind.LParen],
    [true, /^\)/g, TokenKind.RParen],
])

export type P<T> = Parser<TokenKind, T>

const Character: P<string> = apply(tok(TokenKind.Character), v => v.text)

const Text: P<string> = apply(rep_sc(Character), v=>v.join(''))

const Annot: P<string> = kmid(str<TokenKind>('('), Text, str(')'))

const Piece: P<T.WordPiece> = 
    apply(seq(Character, opt_sc(Annot)),
        ([t, anno]) => (anno ? {text: t, kana: anno}: t))

const Pieces: P<T.WordPieces> = 
    apply(seq(Piece, rep_sc(Piece)), ([v, vs]) => [v, ...vs])

export default function (input: string): T.WordPieces{
    return expectSingleResult(expectEOF(Pieces.parse(lexer.parse(input.trim()))))
}
