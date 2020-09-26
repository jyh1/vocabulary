import { kright, Parser, str } from 'typescript-parsec';
import { buildLexer, expectEOF, expectSingleResult } from 'typescript-parsec';
import { opt_sc, nil, opt, apply, kmid, rep_sc, seq, tok, alt } from 'typescript-parsec';
import * as T from '../types'

enum TokenKind {
      Character
    , LParen
    , RParen
    , Tag
    , Newline
    , Space
    , Insert
}

const lexer = buildLexer([
    [true, /^#[^ #]./g, TokenKind.Tag],
    [true, /^[^()\n]/g, TokenKind.Character],
    [true, /^\(/g, TokenKind.LParen],
    [true, /^\)/g, TokenKind.RParen],
    [true, /^\n+/g, TokenKind.Newline],
    [true, /^Insert[\s]+/gi, TokenKind.Insert],
    [true, /^[ \t]+/g, TokenKind.Space],
])

export type P<T> = Parser<TokenKind, T>

const spaces = opt_sc(alt(tok(TokenKind.Space), tok(TokenKind.Newline)))

const Character: P<string> = apply(tok(TokenKind.Character), v => v.text)

const Text: P<string> = apply(rep_sc(Character), v=>v.join(''))

const Annot: P<string> = kmid(tok(TokenKind.LParen), Text, tok(TokenKind.RParen))

const Line: P<string> = apply(rep_sc(Character), cs=>cs.join(''))


const Piece: P<T.WordPiece> = 
    apply(seq(Character, opt_sc(Annot)),
        ([t, anno]) => (anno ? {text: t, kana: anno}: t))

export const Pieces: P<T.WordPieces> = 
    apply(seq(Piece, rep_sc(Piece)), ([v, vs]) => [v, ...vs])

const WordInfo: P<T.WordInfo> = 
    apply(seq(Pieces, tok(TokenKind.Newline), Line, spaces),
        ([content, _, description]) => ({content, description, tags: []}))

const Insert: P<T.Insert> = 
    kright(tok(TokenKind.Insert), apply(rep_sc(WordInfo), words=>({type: "Insert", words})))

const Query: P<T.Query> = Insert

export function parse<T>(parser: P<T>){
    return ((input: string) => {
        return expectSingleResult(expectEOF(parser.parse(lexer.parse(input))))
        }
    )
}

export const parseWordPieces = parse(Pieces)

export const parseQuery = parse(Query)
