import { kright, Parser, kleft, list_sc, rule, str, lrec_sc } from 'typescript-parsec';
import {expectSingleResult, expectEOF } from 'typescript-parsec';
import { opt_sc, nil, apply, kmid, rep_sc, seq, tok, alt } from 'typescript-parsec';
import {parseWordPieces} from './word'
import {buildLexer} from './lexer'
// import {buildLexer} from 'typescript-parsec'
import * as T from '../types'


enum Token {
      Insert
    , LParen
    , RParen
    , Tag
    , Space
    , Line
    , And
    , Or
}

const lexer = buildLexer([
    [true, /^Insert/gi, Token.Insert],
    [true, /^[&]/g, Token.And],
    [true, /^[|]/g, Token.Or],
    [true, /^\#[^\s#&|()]+/g, Token.Tag],
    [true, /^\(/g, Token.LParen],
    [true, /^\)/g, Token.RParen],
    [false, /^[\s]+/g, Token.Space],
    [true, /^[^\s][^\n]*/g, Token.Line],
])

type P<T> = Parser<Token, T>

const Line: P<string> = apply(tok(Token.Line), t => t.text)


const WordInfo: P<Omit<T.WordInfo, "tags">> = 
    apply(seq(Line, Line),
        ([content, description]) => ({content: parseWordPieces(content), description}))

const Tag: P<T.Tag> = apply(tok(Token.Tag), v => v.text.substr(1))

const Tags: P<T.Tag[]> = list_sc(Tag, nil())

const Insert: P<T.Insert> = 
    kright(tok(Token.Insert), apply(rep_sc(alt(WordInfo, Tags)), words=>({type: "Insert", words})))

// Expression
type BinopInfo = [Token, (l: T.Expr, r: T.Expr)=>T.Expr]
const BinopTable: BinopInfo[][] = [
    [[Token.And, T.makeBin(T.Op.And)]],
    [[Token.Or, T.makeBin(T.Op.Or)]],
]
const Expr = rule<Token, T.Expr>();
const Value: P<T.Atom> = apply(Tag, t=>T.makeVal(T.AtomType.Tag, t))
const Term = alt(Value, kmid(str('('), Expr, str(')')))

let ExprParser: P<T.Expr> = Term


function makeOpParesr(opinfo: BinopInfo[]){
    return opinfo.map(([t, f]) => apply(tok(t), ()=>f)).reduce((p1, p2)=>alt(p1, p2))
}
function makeParser(prev: P<T.Expr>, opparser: P<(l:T.Expr, r: T.Expr)=>T.Expr>){
    return lrec_sc(prev, seq(opparser, prev), (l: T.Expr, right)=> right[0](l, right[1]))
}
for(const opinfo of BinopTable){
    const opparser = makeOpParesr(opinfo)
    ExprParser = makeParser(ExprParser, opparser) 
}

Expr.setPattern(ExprParser)


const Query: P<T.Query> = alt(Insert, apply(Expr, expr => ({type: "Filter", expr})))


export function parse<T>(parser: P<T>) {
    return ((input: string) => {
        // const res = expectEOF(parser.parse(lexer.parse(input)))
        // console.log(res.successful ? res.candidates : res.error)
        return expectSingleResult(expectEOF(parser.parse(lexer.parse(input))));
    }
    );
}

export const parseQuery = parse(Query)
