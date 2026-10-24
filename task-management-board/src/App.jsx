
import { useEffect, useState } from "react";
import Board from "./components/Board";
import TaskModal from "./components/TaskModal";
import "./App.css";

const STORAGE_KEY = "taskflow_tasks";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function openAddModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(null);
  }

  function saveTask(formData) {
    if (editingTask) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...formData }
            : task
        )
      );
    } else {
      const newTask = {
        id: `${Date.now()}-${Math.random()}`,
        title: formData.title,
        description: formData.description,
        status: "To Do",
      };

      setTasks((previousTasks) => [...previousTasks, newTask]);
    }

    closeModal();
  }

  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  function moveTask(id, status) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="TaskFlow home">
          <span className="brand-logo">✳</span>
          <span className="brand-name">
            taskflow<span>.</span>
          </span>
        </a>

        <div className="topbar-label">
          <span className="online-dot"></span>
          Your personal workspace
        </div>

        <button className="primary-button" onClick={openAddModal}>
          <span>＋</span> Add task
        </button>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">A LITTLE PROGRESS EVERY DAY</p>
            <h1>
              Your ideas, <span>in motion.</span>
            </h1>
            <p className="welcome-text">
              Plan your work, take the next step, and celebrate the finish.
            </p>
          </div>

          <div className="welcome-decoration" aria-hidden="true">
            ✳
          </div>
        </section>

        <section className="board-section">
          <div className="board-heading">
            <div>
              <h2>
                My task board <span>✳</span>
              </h2>
              <p>Everything you need to get things done.</p>
            </div>

            <div className="drag-hint">
              <span>↔</span> Drag cards to move them
            </div>
          </div>

          <Board
            tasks={tasks}
            onAdd={openAddModal}
            onEdit={openEditModal}
            onDelete={deleteTask}
            onMove={moveTask}
          />
        </section>

        <footer className="footer">
          One step at a time <span>✳</span>
        </footer>
      </main>

      {modalOpen && (
        <TaskModal
          key={editingTask?.id ?? "new"}
          task={editingTask}
          onSave={saveTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
