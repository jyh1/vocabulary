import * as T from '../types'
import * as S from '../storage'
import {evalExpr} from './expr'

type StmtFun = (ws: T.WordEntry[]) => Promise<T.WordEntry[]>

async function delStmt(ws: T.WordEntry[]){
    await Promise.all(ws.map(w => S.delWord(w.key)))
    return []
}

function changeTags(f: (k:T.Tag[])=>(k: string)=>Promise<T.Word>){
    return function (tags: T.Tag[]): StmtFun{
        return (ws: T.WordEntry[]) =>{
            return Promise.all(
                ws.map(w => f(tags)(w.key).then(v => ({...w, value: v})))
            )
        }
    }
}

export const pushTags = changeTags(S.pushTags)
export const popTags = changeTags(S.popTags)

function sortBy<T>(a: T[], f: (e:T)=>number): T[]{
    const values:[number, T][] = a.map(e => [f(e), e])
    values.sort((e1, e2) => e1[0]-e2[0])
    return values.map(e=>e[1])
}

function orderbyStmt(expr: T.Expr): StmtFun{
    const compute = (w: T.WordEntry) => evalExpr(expr)(w.value) as number
    return (ws: T.WordEntry[]) => new Promise(resolve => resolve(sortBy(ws, compute)))
}

function sliceStmt(start: number | undefined, end: number | undefined): StmtFun{

    return (ws: T.WordEntry[]) => 
        new Promise(resolve => resolve(ws.slice(
            start === undefined ? 0 : start, 
            end === undefined ? ws.length : end)))
}

const id: StmtFun = ws => (new Promise(resolve => resolve(ws)))

function execStmt(t: T.Stmt): StmtFun{
    switch (t.type){
        case T.StmtType.Delete:
            return delStmt
        case T.StmtType.Orderby:
            return orderbyStmt(t.value)
        case T.StmtType.Slice:
            return sliceStmt(t.start, t.end)
        case T.StmtType.Pushtags:
            return pushTags(t.tags)
        case T.StmtType.Poptags:
            return popTags(t.tags)
    }
}

function composeStmtFuns(fs: StmtFun[]): StmtFun{
    return (ws: T.WordEntry[])=>{
        let res = id(ws)
        for(const f of fs){
            res = res.then(f)
        }
        return res
    }
}

export async function execStmts(ts: T.Stmts, ws: T.WordEntry[]){
    return await composeStmtFuns(ts.map(execStmt))(ws)
}