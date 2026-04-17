import React, { useState } from "react";
import { evaluate } from "mathjs";
import "./App.css";

function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function TodoPage() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, task]);
    setTask("");
  };

  return (
    <Card title="To-Do List">
      <input className="input" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Digite uma tarefa" />
      <button className="button" onClick={addTask}>Adicionar</button>
      <ul>{tasks.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </Card>
  );
}

function CounterPage() {
  const [count, setCount] = useState(0);
  return (
    <Card title="Contador de Cliques">
      <h1>{count}</h1>
      <button className="button" onClick={() => setCount(count + 1)}>+</button>
      <button className="button" onClick={() => setCount(0)}>Reset</button>
    </Card>
  );
}

function TicTacToePage() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState("X");
  const [message, setMessage] = useState("");

  const checkWinner = (newBoard) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (let [a,b,c] of lines) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setMessage(`Jogador ${newBoard[a]} venceu!`);
        setTimeout(resetGame, 1500);
        return true;
      }
    }

    if (!newBoard.includes("")) {
      setMessage("Empate!");
      setTimeout(resetGame, 1500);
      return true;
    }

    return false;
  };

  const play = (index) => {
    if (board[index] || message) return;
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    if (!checkWinner(newBoard)) {
      setPlayer(player === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setPlayer("X");
    setMessage("");
  };

  return (
    <Card title="Jogo da Velha">
      <div className="game-grid">
        {board.map((cell, i) => (
          <button key={i} className="game-button" onClick={() => play(i)}>{cell}</button>
        ))}
      </div>
      <p>{message || `Vez do jogador ${player}`}</p>
      <button className="button" onClick={resetGame}>Reiniciar</button>
    </Card>
  );
}

function CalculatorPage() {
  const [value, setValue] = useState("");

  const buttons = [
    "7","8","9","/",
    "4","5","6","*",
    "1","2","3","-",
    "0",".","=","+"
  ];



const handleClick = (btn) => {
  if (btn === "=") {
    try {
      setValue(evaluate(value).toString());
    } catch {
      setValue("Erro");
    }
  } else {
    setValue(value + btn);
  }
};

  return (
    <Card title="Calculadora">
      <input className="input" value={value} readOnly />
      <div className="calc-grid">
        {buttons.map((btn, i) => (
          <button key={i} className="calc-button" onClick={() => handleClick(btn)}>{btn}</button>
        ))}
      </div>
      <button className="button" onClick={() => setValue("")}>Limpar</button>
    </Card>
  );
}

function CepPage() {
  const [cep, setCep] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchCep = async () => {
    setLoading(true);
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <Card title="Busca Inteligente de CEP">
      <input className="input" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Digite o CEP" />
      <button className="button" onClick={searchCep}>Buscar Endereço</button>
      {loading && <p>Buscando...</p>}
      {result && (
        <div className="cep-result">
          <p><strong>Rua:</strong> {result.logradouro}</p>
          <p><strong>Bairro:</strong> {result.bairro}</p>
          <p><strong>Cidade:</strong> {result.localidade}</p>
          <p><strong>Estado:</strong> {result.uf}</p>
        </div>
      )}
    </Card>
  );
}

export default function App() {
  const [page, setPage] = useState("todo");

  const renderPage = () => {
    switch (page) {
      case "todo": return <TodoPage />;
      case "counter": return <CounterPage />;
      case "game": return <TicTacToePage />;
      case "calc": return <CalculatorPage />;
      case "cep": return <CepPage />;
      default: return <TodoPage />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Central de Funcionalidades</h1>
        <nav>
          <button className="button" onClick={() => setPage("todo")}>Tarefas</button>
          <button className="button" onClick={() => setPage("counter")}>Contador</button>
          <button className="button" onClick={() => setPage("game")}>Jogo</button>
          <button className="button" onClick={() => setPage("calc")}>Calculadora</button>
          <button className="button" onClick={() => setPage("cep")}>CEP</button>
        </nav>
      </header>
      {renderPage()}
    </div>
  );
}
