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
    , True
    , False
    , Number
    , Add
    , Minus
    , Divide
    , Multiply
    , Equal
    , Less
    , Greater
    , LessEq
    , GreaterEq
    , Variable
}

const lexer = buildLexer([
    [true, /^Insert/gi, Token.Insert],
    [true, /^true/gi, Token.True],
    [true, /^false/gi, Token.False],
    [true, /^\d+(\.\d+)?/g, Token.Number],
    [true, /^[&]{2}/g, Token.And],
    [true, /^[|]{2}/g, Token.Or],
    [true, /^[+]/g, Token.Add],
    [true, /^[-]/g, Token.Minus],
    [true, /^[*]/g, Token.Multiply],
    [true, /^[/]/g, Token.Divide],
    [true, /^[<][=]/g, Token.LessEq],
    [true, /^[>][=]/g, Token.GreaterEq],
    [true, /^[<]/g, Token.Less],
    [true, /^[>]/g, Token.Greater],
    [true, /^[=]{2}/g, Token.Equal],
    [true, /^\#[a-zA-Z0-9]+/g, Token.Tag],
    [true, /^\$[a-zA-Z0-9]+/g, Token.Variable],
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
const Boolean = alt(apply(tok(Token.True), ()=>T.constant(true)), 
                    apply(tok(Token.False), ()=>T.constant(false)))
const Number = apply(tok(Token.Number), t => T.constant(+t.text))
const Constant = alt(Boolean, Number)
const Variable = apply(tok(Token.Variable), v=>T.makeVal(T.AtomType.Var as T.AtomType.Var, v.text.substr(1)))
const TagExpr = apply(Tag, t=>T.makeVal(T.AtomType.Tag as T.AtomType.Tag, t))
const Atom: P<T.Atom> = alt(TagExpr, Constant, Variable)
type BinopInfo = [Token, (l: T.Expr, r: T.Expr)=>T.Expr]
const BinopTable: BinopInfo[][] = [
    [[Token.Multiply, T.makeBin(T.Op.Multiply)], [Token.Divide, T.makeBin(T.Op.Divide)]],
    [[Token.Add, T.makeBin(T.Op.Add)], [Token.Minus, T.makeBin(T.Op.Minus)]],
    [
        [Token.Equal, T.makeBin(T.Op.Equal)],
        [Token.Less, T.makeBin(T.Op.Less)],
        [Token.Greater, T.makeBin(T.Op.Greater)],
        [Token.GreaterEq, T.makeBin(T.Op.GreaterEq)],
        [Token.LessEq, T.makeBin(T.Op.LessEq)],
    ],
    [[Token.And, T.makeBin(T.Op.And)]],
    [[Token.Or, T.makeBin(T.Op.Or)]],

]
const Expr = rule<Token, T.Expr>();
const Term = alt(Atom, kmid(str('('), Expr, str(')')))

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

const EmptyExpr: P<T.Expr> = apply(nil(), ()=>T.constant(true))

const Query: P<T.Query> = alt(
      Insert
    , apply(alt(Expr, EmptyExpr), expr => ({type: "Filter", expr}))
    )


export function parse<T>(parser: P<T>) {
    return ((input: string) => {
        // const res = expectEOF(parser.parse(lexer.parse(input)))
        // console.log(res.successful ? res.candidates : res.error)
        return expectSingleResult(expectEOF(parser.parse(lexer.parse(input))));
    }
    );
}

export const parseQuery = parse(Query)
