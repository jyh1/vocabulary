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
    Value
  , Binop
}


export enum ValueType{
    Tag
  , Var
}
type Val<T, V> = {type: ExprType.Value, t: T, v: V}
type TagVal = Val<ValueType.Tag, string>
type VarVal = Val<ValueType.Var, string>
export function makeVal<T, V>(t: T, v: V): Val<T, V>{
  return ({type: ExprType.Value, t, v})
}
export type Value = TagVal | VarVal


export enum Op {
  And
, Or
}
export type Binop = {type: ExprType.Binop, op: Op, l: Expr, r: Expr}
export function makeBin(op: Op): (l: Expr, r: Expr)=>Binop{
  return (l, r) => ({type:ExprType.Binop, op, l, r})
}

export type Expr = Binop | Value

export type Insert = {
    type: "Insert"
  , words: (Omit<WordInfo, "tags"> | Tag[])[]
}
export type Filter = {
    type: "filter"
  , expr: Expr 
}

export type Query = Insert | Filter
