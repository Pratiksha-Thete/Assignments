
import { useEffect, useState } from "react";

function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(
    task?.description || ""
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
    });
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <div className="modal-icon">✳</div>
            <p className="eyebrow">MAKE IT HAPPEN</p>
            <h2 id="modal-title">
              {task ? "Edit your task" : "A new little goal"}
            </h2>
            <p className="modal-subtitle">
              {task
                ? "Make changes to your task below."
                : "Every great result starts with one small step."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g. Finish my React assignment"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            autoFocus
            required
          />

          <label htmlFor="task-description">
            Description <span>(optional)</span>
          </label>
          <textarea
            id="task-description"
            placeholder="Add a few details about your task..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={500}
          />

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {task ? "Save changes" : "Create task"} <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
