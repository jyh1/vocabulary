export type Kanji = {text: string, kana: string}

export type WordPiece = Kanji | string

export type WordPieces = WordPiece[]

export type WordInfo = {
    content: WordPieces
  , description: string
  , tags: string[]
}

export type Word = WordInfo & {reviewtime: number, lastreview: Date, reviewed: boolean}

export type KeyValue<T> = {key: string, value: T}

export type WordEntry = KeyValue<Word>


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
type TagAtm = AtomSkelton<AtomType.Tag, Tag>
type VarAtm = AtomSkelton<AtomType.Var, string>
type BoolConst = AtomSkelton<AtomType.Const, boolean>
type NumConst = AtomSkelton<AtomType.Const, number>
export function makeVal<T, V>(t: T, v: V): AtomSkelton<T, V>{
  return ({type: ExprType.Atom, t, v})
}
export function constant<T>(b: T): AtomSkelton<AtomType.Const, T>{
  return makeVal(AtomType.Const, b)
}
export type Atom = TagAtm | VarAtm | BoolConst | NumConst


export enum Op {
  And
, Or
, Add
, Minus
, Divide
, Multiply
, Equal
, Less
, Greater
, LessEq
, GreaterEq
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

export type NewSession = {
  type: "NewSession"
}

export enum StmtType{
    Delete
  , Orderby
  , Slice
  , Pushtags
  , Poptags
  , Clear
}
export type Delete = {type: StmtType.Delete}
export type Clear = {type: StmtType.Clear}
export type Orderby = {type: StmtType.Orderby, value: Expr}
export type Slice = {type: StmtType.Slice, start: number | undefined, end: number | undefined}
type ChangeTags<T> = {type: T, tags: Tag[]}
export type Pushtags = ChangeTags<StmtType.Pushtags>
export type Poptags = ChangeTags<StmtType.Poptags>
export type Stmt = 
  Delete | Orderby | Slice | Pushtags | Poptags | Clear

export type Stmts = Stmt[]


export type Filter = {
    type: "Filter"
  , expr: Expr 
  , stmts: Stmts
}

export type Query = Insert | Filter | NewSession

export type Result = number | boolean