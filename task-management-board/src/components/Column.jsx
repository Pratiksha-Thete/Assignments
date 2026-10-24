
import TaskCard from "./TaskCard";

function Column({
  status,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onMove,
}) {
  const columnClass = {
    "To Do": "todo",
    "In Progress": "progress",
    Done: "done",
  }[status];

  function handleDrop(event) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("taskId");

    if (taskId) {
      onMove(taskId, status);
    }
  }

  return (
    <section
      className={`kanban-column ${columnClass}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="column-heading">
        <div className="column-title">
          <span className="status-dot"></span>
          <h3>{status}</h3>
          <span className="column-count">{tasks.length}</span>
        </div>

        {status === "To Do" && (
          <button
            className="column-add"
            type="button"
            onClick={onAdd}
            aria-label="Add a task"
          >
            +
          </button>
        )}
      </div>

      <div className="column-cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}

        {tasks.length === 0 && (
          <button
            className="empty-state"
            type="button"
            onClick={onAdd}
          >
            <span className="empty-icon">✳</span>
            <strong>Nothing here yet</strong>
            <span>
              {status === "Done"
                ? "Your finished tasks will appear here."
                : "Add a task or drag one here."}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

export default Column;
