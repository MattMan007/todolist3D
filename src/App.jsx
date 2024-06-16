import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import './App.css';

function Box({ id, position, label, onDelete }) {
  const [active, setActive] = useState(false);

  const [xRotation, setXRotation] = useState(0);
  const [yRotation, setYRotation] = useState(0);

  useFrame(() => {
    setXRotation(x => x + 0.01);
    setYRotation(y => y + 0.01);
  });

  const handleClick = () => {
    setActive(!active);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <>
      <mesh position={position} onClick={handleClick} rotation={[xRotation, yRotation, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={active ? 'lightgreen' : 'red'} />
      </mesh>
      <Html position={[position[0], position[1] + 3, position[2]]}>
        <div className="label">{label}</div>
      </Html>
      <Html position={[position[0], position[1] - 1.5, position[2]]}>
        <div className="delete-button" onClick={handleDelete}>❌</div>
      </Html>
    </>
  );
}

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn Three.js', position: [-15, 8, 0] },
    { id: 2, text: 'Build a 3D To-Do List', position: [-9, 8, 0] },
  ]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;

    const newTodos = [...todos];
    const lastTodo = todos[todos.length - 1];

    const rowIndex = Math.floor(todos.length / 6);
    const columnIndex = todos.length % 6;

    const newPosition = [-15 + columnIndex * 6, 8 - rowIndex * 6, 0];

    newTodos.push({
      id: todos.length + 1,
      text: input,
      position: newPosition,
    });

    setTodos(newTodos);
    setInput('');
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <div className="app">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {todos.map(todo => (
          <Box key={todo.id} id={todo.id} position={todo.position} label={todo.text} onDelete={deleteTodo} />
        ))}
        <OrbitControls />
      </Canvas>
      <div className="controls">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter new to-do"
        />
        <button onClick={addTodo}>Add To-Do</button>
      </div>
    </div>
  );
}

export default App;