import * as T from '../types'
import * as S from '../storage'

export function executeInsert(insertEntries: T.Insert["words"]){
    let tags : {[t:string]: null} = {}
    let words: T.WordInfo[] = []
    insertEntries.forEach(e => {
        if (Array.isArray(e)){
            e.forEach(t => {if (t in tags) {delete tags[t]} else {tags[t]=null}})
        } else {
            words.push({...e, tags: Object.keys(tags)})
        }
    })
    return S.addWords(words)
}

export function evalValue(v: T.Atom, w: T.Word): T.Result{
    switch (v.t){
        case T.AtomType.Tag:
            return w.tags.includes(v.v)
        case T.AtomType.Var:
            return 0
    }
}

export function evalExpr(expr: T.Expr){
    return (w: T.Word): T.Result => {
        switch (expr.type){
            case T.ExprType.Atom:
                return evalValue(expr, w)
            case T.ExprType.Binop:
                const lres = evalExpr(expr.l)(w)
                const rres = evalExpr(expr.r)(w)
                switch (expr.op){
                    case T.Op.And: return lres && rres
                    case T.Op.Or: return lres || rres
                }
        }
    }
}