import React from 'react';
import WordTable from './components/wordTable/wordTable'
import './App.css';

const words = [
  {content: [{text: "見", kana: "み"}, "る"], id: 1, description: "to look [at], watch", tags: ["n5"]}
  , {content: [{text: "見", kana: "み"}, "る"], id: 1, description: "to look [at], watch", tags: ["n5"]}
  , {content: [{text: "見", kana: "み"}, "る"], id: 1, description: "to look [at], watch", tags: ["n5"]}
  , {content: [{text: "見", kana: "み"}, "る"], id: 1, description: "to look [at], watch", tags: ["n5"]}
  , {content: [{text: "見", kana: "み"}, "る"], id: 1, description: "to look [at], watch", tags: ["n5"]}
]


function App() {
  return (
    <div className="app">
      <WordTable words={words}/>
    </div>
  );
}

export default App;
