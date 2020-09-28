import * as T from '../types'
import * as S from '../storage'

type StmtFun = (ws: T.WordEntry[]) => Promise<T.WordEntry[]>

async function delStmt(ws: T.WordEntry[]){
    await Promise.all(ws.map(w => S.delWord(w.key)))
    return []
}

const id: StmtFun = ws => (new Promise(resolve => resolve(ws)))

function execStmt(t: T.Stmt): StmtFun{
    switch (t.type){
        case T.StmtType.Delete:
            return delStmt
        default:
            return id
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