export {default as parseWordPieces} from './wordparser'


enum QueryTokenKind {
    Number,
    Add,
    Sub,
    Mul,
    Div,
    LParen,
    RParen,
    Space,
    kana,
}