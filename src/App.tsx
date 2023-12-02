import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import D3Examples from './components/d3Examples/D3Examples';
import Skills from './components/Skills/Skills';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Skills></Skills>
      <D3Examples></D3Examples>
      <Footer></Footer>
    </div>
  );
}

export default App;
