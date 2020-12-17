import React from 'react';
import WordTable from './components/wordTable/wordTable'
import './App.css';


function App() {
  window.onbeforeunload = function() { return "Your work will be lost."; };
  return (
    <div className="app">
      <WordTable/>
    </div>
  );
}

export default App;
