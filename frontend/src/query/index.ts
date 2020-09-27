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

function diffDays(n1: number, n2: number){
    return Math.round((n1 - n2) / (1000 * 60 * 60 * 24))
}

export function evalValue(v: T.Atom, w: T.Word): T.Result{
    switch (v.t){
        case T.AtomType.Tag:
            return w.tags.includes(v.v)
        case T.AtomType.Var:
            switch (v.v){
                case "review": return w.reviewtime
                case "days": return  diffDays(Date.now(), w.lastreview.getTime())
                default: throw Error(`Unknown variable ${v.v}`)
            }
        case T.AtomType.Const:
            return v.v
    }
}



export function evalBin(op: T.Op, l: T.Result, r: T.Result): T.Result{
    if (typeof l === "number" && typeof r === "number"){
        switch (op){
            case T.Op.Add: return l + r
            case T.Op.Minus: return l - r
            case T.Op.Multiply: return l * r
            case T.Op.Divide: return l / r
            case T.Op.LessEq: return l <= r
            case T.Op.GreaterEq: return l >= r
            case T.Op.Less: return l < r
            case T.Op.Greater: return l > r
        }
    }
    if (typeof l === "boolean" && typeof r === "boolean"){
        switch(op){
            case T.Op.And: return l && r
            case T.Op.Or: return l || r    
        }
    }

    if (typeof l === typeof r){
        switch(op){
            case T.Op.Equal: return l === r
        }
    }

    throw Error(`Incmpatible type of binary operator`)
    
}

export function evalExpr(expr: T.Expr){
    return (w: T.Word): T.Result => {
        switch (expr.type){
            case T.ExprType.Atom:
                return evalValue(expr, w)
            case T.ExprType.Binop:
                const lres = evalExpr(expr.l)(w)
                const rres = evalExpr(expr.r)(w)
                return evalBin(expr.op, lres, rres)
        }
    }
}