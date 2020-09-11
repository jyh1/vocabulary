export type Kanji = {text: string, kana: string}

export type WordPiece = Kanji | string

export type WordPieces = WordPiece[]

export type Word = {
      content: WordPieces
    , id: number
    , description: string
    , tags: string[]
}

export type Tag = {id: string, name: string}



