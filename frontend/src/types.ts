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

export type Tag = {id: string, name: string}



