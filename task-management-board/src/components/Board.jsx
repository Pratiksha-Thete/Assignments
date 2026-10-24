
import Column from "./Column";

const statuses = ["To Do", "In Progress", "Done"];

function Board({ tasks, onAdd, onEdit, onDelete, onMove }) {
  return (
    <div className="kanban-board">
      {statuses.map((status) => {
        const columnTasks = tasks.filter(
          (task) => task.status === status
        );

        return (
          <Column
            key={status}
            status={status}
            tasks={columnTasks}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        );
      })}
    </div>
  );
}

export default Board;
