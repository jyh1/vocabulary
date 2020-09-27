export type Kanji = {text: string, kana: string}

export type WordPiece = Kanji | string

export type WordPieces = WordPiece[]

export type WordInfo = {
    content: WordPieces
  , description: string
  , tags: string[]
}

export type Word = WordInfo & {reviewtime: number, lastreview: Date}

export type KeyValue<T> = {key: string, value: T}

export type WordEntry = KeyValue<Word> & {reviewed: boolean}


export type Tag = string

export enum ExprType{
    Atom
  , Binop
}


export enum AtomType{
    Tag
  , Var
  , Const
}
type AtomSkelton<T, V> = {type: ExprType.Atom, t: T, v: V}
type TagAtm = AtomSkelton<AtomType.Tag, string>
type VarAtm = AtomSkelton<AtomType.Var, string>
type BoolConst = AtomSkelton<AtomType.Const, boolean>
export function makeVal<T, V>(t: T, v: V): AtomSkelton<T, V>{
  return ({type: ExprType.Atom, t, v})
}
export function bool(b: boolean): AtomSkelton<AtomType.Const, boolean>{
  return makeVal(AtomType.Const, b)
}
export type Atom = TagAtm | VarAtm | BoolConst


export enum Op {
  And
, Or
}
export type Binop = {type: ExprType.Binop, op: Op, l: Expr, r: Expr}
export function makeBin(op: Op): (l: Expr, r: Expr)=>Binop{
  return (l, r) => ({type:ExprType.Binop, op, l, r})
}

export type Expr = Binop | Atom

export type Insert = {
    type: "Insert"
  , words: (Omit<WordInfo, "tags"> | Tag[])[]
}
export type Filter = {
    type: "Filter"
  , expr: Expr 
}

export type Query = Insert | Filter

export type Result = number | boolean