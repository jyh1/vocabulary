

##  1. <a name='Introduction'></a>Introduction

[Main Website](https://jyh1.github.io/vocabulary)

A simple web application for helping memorize vocabulary.

###  1.1. <a name='WhatitdoesTL-DR'></a>What it does (TL-DR)
1. Maintaining a vocabulary dataset in the browser local storage
2. Providing a flashcard-like interface for viewing and learning new words
3. Providing a simple query language for operations on the vocabulary dataset

### Table of Content

<!-- vscode-markdown-toc -->
* 1. [Introduction](#Introduction)
	* 1.1. [What it does (TL-DR)](#WhatitdoesTL-DR)
	* 1.2. [Quick Start](#QuickStart)
		* 1.2.1. [Insert words](#Insertwords)
		* 1.2.2. [Review words](#Reviewwords)
		* 1.2.3. [Select words](#Selectwords)
	* 1.3. [Query](#Query)
		* 1.3.1. [Insert Query](#InsertQuery)
		* 1.3.2. [Filter Query](#FilterQuery)
		* 1.3.3. [Dump](#Dump)
	* 1.4. [Word Card Interface](#WordCardInterface)
	* 1.5. [Word Table](#WordTable)
		* 1.5.1. [Menu bar](#Menubar)
* 2. [Development](#Development)
	* 2.1. [Commands](#Commands)
		* 2.1.1. [Install dependencies](#Installdependencies)
		* 2.1.2. [Run dev server](#Rundevserver)
		* 2.1.3. [Build production app](#Buildproductionapp)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

###  1.2. <a name='QuickStart'></a>Quick Start
First, open the [link](https://jyh1.github.io/vocabulary) of the application. 
It should be a largely empty page except a menu bar on the top if this is your first time visiting it. 
But worry not! We are about to populate the dataset with some good-looking Japanese words!

####  1.2.1. <a name='Insertwords'></a>Insert words
Copy and paste the following query into the Query Input bar on the top right corner of the web page,
and press `Ctrl+Enter` or click the search icon on the right to execute it.

```
Insert
#l1

#noun
学(がく)生(せい)
Student
会(かい)社(しゃ)員(いん)
Company staff
#noun

#verb
来る
come
見る
see
#verb

#adj
早(はや)い
quick, fast, early
高(たか)い
high, expensive
```
This is a simple Insert Query, which, obviously, inserts some new words in our dataset. 

More about the Insert Query can be found [here](#InsertQuery).

Now, you should already see new entries of words popping up in the word table right below the menu bar.
The new words we just inserted are stored in the browser local storage so it will stay there even if you reopen the website.

####  1.2.2. <a name='Reviewwords'></a>Review words

To study our newly inserted vocabulary, click on the word entry to open the word card interface. 
Click the `Review` button at the bottom or press `S` to mark the word as `Reviewed`. 
The app will record the timestamp of the last review and the total number of times a word is reviewed.
Click the buttons on the two sides of the word card or press `A` and `D` to navigate the word list.

Press `P` to record a pronunciation of the current word using the microphone of your computer. When finished, press `P` again to stop. Press `F` to listen to the recorded audio. You can also record the pronunciation from other source, like Forvo (press `L` to automatically search the word on Forvo). 

The complete functionalities of the word card interface can be found [here](#WordCardInterface).

Words that are marked as `Reviewed` are unable to be reviewed again until cleared. To clear all words,
execute `clear` in the query input section (remember deleting the previous query if there is any). More information about [Query](#Query).

####  1.2.3. <a name='Selectwords'></a>Select words
In the previous steps, we already used the query functionality to insert new words and clear their reviewed status. 
We can also use it to select and order our wordlist. 

To start, execute the query `#verb` and the word table will only display words with tag `#verb`.
Try to use some other tags for query and see how the results changed.

A more complicate query below is able to select all words marked by `#verb` or `#noun` 
and order the results by the number of days since they are last reviewed.

```
#verb || #noun
orderby $days
```

More information about [Filter Query](#FilterQuery).

###  1.3. <a name='Query'></a>Query

Queries can be input and execute in the Input Query component on the right side of the menu bar.

There are three types of queries: `Insert`, `Filter` and `Dump`.

Query functionalities are implemented in: 
`src/parser`(parser), `src/query`(expression interpreter), `src/components/wordTable/wordTable.tsx/executeQuery`(dispatch)

####  1.3.1. <a name='InsertQuery'></a>Insert Query
Insert Query starts with keyword `Insert` and followed by list of `word definition`s or `tag`s, separated by new line.

Example:
```
Insert
#t1
学(がく)生(せい)
Student
#t1 #t2
会(かい)社(しゃ)員(いん)
Company staff
```

A `word definition` includes two lines. The first line contains the word, the second the definition.
Annotation can be created by using `()` (shortcut `Esc`).

A `tag` starts with `#`, such as `#t1`, `#t2`. If a tag appears for the first time, new words created from the `word definition` following it will be associated with that tag, until it is encountered again. In the example above, the first word will be tagged `#t1` and the second `#t2`.

####  1.3.2. <a name='FilterQuery'></a>Filter Query
`Filter` query is very much like the `Select` expression in `SQL`. 
`Filter` query starts with an `Expression` and followed by a list of `Statements`. An example:

```
#lesson1
orderby $days / $totalReview
slice :20
clear
```

This query will evaluate the head expression `#lesson1` on every word and select those that are evaluated to true. The resulting list is then sorted according to the expression `$days / $totalReview` and the top 20 ones are selected. Finally, all the words are cleared of the `reviewed` markers.

##### Expression
###### Syntax

Main source code: `src/parser/query.ts`.

|   |                       Definition                  |
|:-----:|:--------------------------------------------------------:|
| Num |`[0-9]+`|
| Bool | `true` \| `false` |
| Var | `$` `[a-zA-Z]+` |
| Tag | `#` `[a-zA-Z]+` |
| Atom | `Num` \| `Bool` \| `Var` \| `Tag` |
| Op |  `+` \| `-` \| `*` \| `/` \| `^` \| `&&` \| `\|\|` \| `==` |
|Expr| `Atom` \| `Expr` `Op` `Expr` \| `(` `Expr` `)` | 

###### Semantic

Main source code: `src/query/expr.ts/evalAtom`.


An expression is always evaluated on a particular word, which will be referred as `w` here.

`Num` and `Bool` values will be evaluated to itself.
A `Tag` value will be evaluated to `true` if `w` contains this tag.

`Var` values are evaluated according to the following table.



| Var  |          Definition                  |
|:-----:|:--------------------------------------------------------:|
| $totalReview | Number of times `w` is being reviewed | 
| $days | Number of days (float number) since the last review |
| $rand | A random real number between 0 and 1 |
| $reviewed | `true` if `w` is currently marked as `reviewed`, otherwise, `false` |

Operators follow common semantics.

##### Statement
Relevant source position: `src/parser/stmt.ts`.

Statement is basically a function takes a word list (the words it contains are referred as `ws` here) as input and produce a new list. Some statements require `Expr` or `Num` as arguments.


| Stmt  |    Syntax     | Semantic | 
|:-----:|:------------------------:|:------------------------:|
| orderby | `orderby` `Expr`  | Order `ws` in ascending order according to the result of `Expr` |
| delete | `delete` | Delete `ws` and return an empty list |
| clear | `clear` | Clear the `reviewed` marker of `ws` |
|slice| `slice` `Num?` `:` `Num?` | Slice a subarray from the input between the two optional (default to 0 and the length of the input array, respectively) index `Num` arguments. |
|pushtags| `pushtags` `Tag+` | Add the argument tags to `ws`|
|poptags| `poptags` `Tag+` | Remove the argument tags from `ws` |

##### Filter Query Syntax

|   |                       Definition                  |
|:-----:|:--------------------------------------------------------:|
| Filter Query| `Expr?` (`\n+` `Stmt`)* | 

##### Filter Query Semantic
The optional head `Expr` serves as a filter to construct the initial list (defaults to `true`, i.e. returns all words). 

The following `Stmt`s, if any, are composed into a pipeline, which is then applied on the word list constructed from above. 

##### Examples


```
#irodori
orderby 0 - $days / ($totalReview^0.5)
slice :100
orderby $rand
slice :50
clear
```
Select words with tag `#irodori`, order by number of days since last reviewed divided by the square root of number of reviews in descending order, take the first 100 words, shuffle, take the first, clear their `reviewed` markers

Note: `0-$days / ($totalReview^0.5)` has to be used to order in descending order, as there is no prefix operator yet.



```
#irodori && $reviewed == false
pushtags #difficult 
```
Add tag `#difficult` to all the `#irodori` words without the `reviewed` marker.

####  1.3.3. <a name='Dump'></a>Dump
Simply execute `dump`.
Serialize all the contents of the current database in a text file. 

The reverse operation, loading the saved file to the application, is yet to be implemented.

###  1.4. <a name='WordCardInterface'></a>Word Card Interface
Main source code: `src/components/wordcard`.

Click any entry in the word table to enter the word card interface. A number of keyboard shortcuts can be used:

| Key  |          Function                  |
|:-----:|:--------------------------------------------------------:|
|a| Previous word |
|b| Next Word|
|w| Display hidden content (if any)|
|q| Previous word without `reviewed` marker|
|e| Next word without `reviewed` marker|
|f| Play recorded pronunciation of the current word (if any)|
|x| Play generated speech of definition |
|p| Start or finish recording (use built-in microphone to record the word pronunciation) |
|j|Search current word on jisho.org |
|l|Search current word on forvo.com |
|m| Toggle mouse navigation |

###  1.5. <a name='WordTable'></a>Word Table
The word table displayed the word list resulting from the last query. 

On hovering, each entry will display some buttons on its right. The pencil icon is used for editing the current entry. The book icon is to mark the entry as reviewed. The trash bin icon will remove the entry upon double-clicked (all remove operations requires a double click).

The three dots on the left of the entry can be dragged to change the current table order (This order will not be saved).

####  1.5.1. <a name='Menubar'></a>Menu bar

From left to right:

- `Add` button: Toggle the word editor interface, can be used to insert a single word or edit existing word. When editing tag, press enter to insert the current tag; double click the red cross to delete.

- `Hide` button: toggle between different hiding mode

- `Download` button: Download the current word table as an `Insert` Query.

- `Play` button: Toggle auto play pronunciation recording in the word card interface.

##  2. <a name='Development'></a>Development

This project is in very early stage. Checkout the issue page for current known bugs or incomplete features. Feel free to open one if there is any problem.

###  2.1. <a name='Commands'></a>Commands

Require `npm`.

####  2.1.1. <a name='Installdependencies'></a>Install dependencies
```
make init
```

####  2.1.2. <a name='Rundevserver'></a>Run dev server
```
make dev
```

####  2.1.3. <a name='Buildproductionapp'></a>Build production app at /docs
```
make build
```

