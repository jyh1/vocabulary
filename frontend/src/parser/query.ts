import { kright, Parser, kleft, list_sc } from 'typescript-parsec';
import { buildLexer, expectSingleResult, expectEOF } from 'typescript-parsec';
import { opt_sc, nil, opt, apply, kmid, rep_sc, seq, tok, alt } from 'typescript-parsec';
import {parseWordPieces} from './word'
import * as T from '../types'


enum Token {
      Insert
    , LParen
    , RParen
    , Tag
    , Space
    , Line
}

export const lexer = buildLexer([
    [true, /^Insert/gi, Token.Insert],
    [true, /^\#[^\s#]+/g, Token.Tag],
    [true, /^\(/g, Token.LParen],
    [true, /^\)/g, Token.RParen],
    [true, /^[^\s][^\n]*/g, Token.Line],
    [false, /^[\s]+/g, Token.Space],
])

export type P<T> = Parser<Token, T>

const Line: P<string> = apply(tok(Token.Line), t => t.text)


const WordInfo: P<Omit<T.WordInfo, "tags">> = 
    apply(seq(Line, Line),
        ([content, description]) => ({content: parseWordPieces(content), description}))

const Tag: P<string> = apply(tok(Token.Tag), v => v.text.substr(1))

const Tags: P<string[]> = list_sc(Tag, nil())

const Insert: P<T.Insert> = 
    kright(tok(Token.Insert), apply(rep_sc(alt(WordInfo, Tags)), words=>({type: "Insert", words})))

const Query: P<T.Query> = Insert


export function parse<T>(parser: P<T>) {
    return ((input: string) => {
        return expectSingleResult(expectEOF(parser.parse(lexer.parse(input))));
    }
    );
}

export const parseQuery = parse(Query)
