import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="full-page">
      <Header />
      <FullpageUi />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>CHECKLIST</h1>
      </div>
      <nav className="main-nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

function FullpageUi() {
  const [list, setList] = useState([]);

  function handleAddItem(item) {
    setList(items => [...items, item]);
  }

  function handleDeleteItem(id) {
    setList(items => items.filter(item => item.id !== id));
  }

  function handleUpdateItem(id, updatedTask) {
    setList(items =>
      items.map(item =>
        item.id === id ? { ...item, task: updatedTask } : item
      )
    );
  }

  function handleToggleDone(id) {
    setList(items =>
      items.map(item =>
        item.id === id ? { ...item, isdone: !item.isdone } : item
      )
    );
  }

  function handleClearAll(){
    setList([]);
  }


  return (
    <div className="main">
      <h1>My Task List</h1>
      <p>Manage your tasks efficiently</p>

      <Form onAddItem={handleAddItem} />
      <TaskOverview list={list} />
      <TaskList
        list={list}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
        onToggleDone={handleToggleDone}
      />
      <Taskmenu onClear={handleClearAll} />
    </div>
  );
}

function Form({ onAddItem }) {
  const [task, setTask] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!task.trim()) return;

    onAddItem({
      id: Date.now(),
      task,
      isdone: false,
      important: false
    });

    setTask("");
  }

  return (
    <div className="form">
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={e => setTask(e.target.value)}
        />
        <button>Add Task</button>
      </form>
    </div>
  );
}

function TaskOverview({ list }) {
  const pending = list.filter(t => !t.isdone).length;
  const completed = list.filter(t => t.isdone).length;

  return (
    <div className="task-overview">
      <h2>Task Overview</h2>
      <hr />
      <div className="task-status">
        <p>Pending: {pending}</p>
        <p>Completed: {completed}</p>
      </div>
    </div>
  );
}

function TaskList({ list, onDeleteItem, onUpdateItem, onToggleDone }) {
  return (
    <div className="task-list">
      <p>Tasks</p>
      <hr />
      <ul>
        {list.map(item => (
          <Tasks
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onUpdateItem={onUpdateItem}
            onToggleDone={onToggleDone}
          />
        ))}
      </ul>
    </div>
  );
}

function Tasks({ item, onDeleteItem, onUpdateItem, onToggleDone }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.task);

  function handleSave() {
    onUpdateItem(item.id, value);
    setIsEditing(false);
  }

  return (
    <>
      <li>
        <input
          type="checkbox"
          checked={item.isdone}
          onChange={() => onToggleDone(item.id)}
        />

        {isEditing ? (
          <>
            <input value={value} onChange={e => setValue(e.target.value)} />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <span style={{ textDecoration: item.isdone ? "line-through" : "" }}>
            {item.task}
          </span>
        )}

        {!isEditing && (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}

        <button onClick={() => onDeleteItem(item.id)}>Delete</button>
      </li>
      <hr />
    </>
  );
}

function Taskmenu({onClear}) {
  return (
    <div className="task-menu">
      <button onClick={onClear}>Clear All</button>
    </div>
  );
}

export default App;

