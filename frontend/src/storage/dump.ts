
export async function dumpInstance(db: LocalForage){
    var entries: [string, any][] = []
    await db.iterate((value, key)=>{
        entries.push([key, value])
    })
    return entries
}