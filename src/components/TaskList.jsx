import React from "react";
import { Card, Badge, Button, Spinner, Alert, Stack } from "react-bootstrap";

const priorityBadgeMap = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const TaskList = ({
  tasks,
  loading,
  error,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm p-5 text-center">
        <div className="py-4">
          <Spinner animation="border" variant="primary" role="status" className="mb-3" />
          <p className="text-muted mb-0">Syncing with Firebase Database...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="shadow-sm">
        <Alert.Heading className="fs-6 fw-bold">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>Database Connection Error
        </Alert.Heading>
        <p className="mb-1">{error}</p>
        <small className="text-muted">
          Make sure your Firestore database is created in the Firebase Console and security rules allow read/write.
        </small>
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-0 shadow-sm p-5 text-center text-muted">
        <div className="py-4">
          <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
          <h5>No tasks found</h5>
          <p className="small mb-0">Create a new task above or adjust your search filters.</p>
        </div>
      </Card>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "";
  };

  return (
    <Stack gap={3}>
      {tasks.map((task) => {
        const isCompleted = task.status === "completed";
        const priorityVariant = priorityBadgeMap[task.priority] || "secondary";
        const isImage = task.attachment?.type?.startsWith("image/");

        return (
          <Card
            key={task.id}
            className={`border-0 shadow-sm task-card priority-${(task.priority || "medium").toLowerCase()} ${
              isCompleted ? "task-completed" : "bg-white"
            }`}
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-start gap-3">
                <Button
                  variant={isCompleted ? "success" : "outline-secondary"}
                  size="sm"
                  className="rounded-circle p-0 mt-1 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 32, height: 32 }}
                  onClick={() => onToggleStatus(task.id, task.status)}
                  title={isCompleted ? "Mark as pending" : "Mark as completed"}
                >
                  <i className={`bi ${isCompleted ? "bi-check-lg" : "bi-circle"}`}></i>
                </Button>

                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                    <h6
                      className={`fw-semibold mb-0 task-title ${
                        isCompleted ? "text-decoration-line-through text-muted" : "text-dark"
                      }`}
                    >
                      {task.title}
                    </h6>

                    <div className="d-flex align-items-center gap-1">
                      <Button
                        variant="light"
                        size="sm"
                        className="text-secondary p-1 px-2"
                        onClick={() => onEditTask(task)}
                        title="Edit task"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        className="text-danger p-1 px-2"
                        onClick={() => onDeleteTask(task.id, task.attachment?.path)}
                        title="Delete task"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-muted small mb-2">
                      {task.description}
                    </p>
                  )}

                  {/* Firebase Storage Attachment Display */}
                  {task.attachment && (
                    <div className="mb-2">
                      {isImage ? (
                        <div className="d-inline-block position-relative">
                          <a
                            href={task.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block text-decoration-none"
                            title="Click to view full image in Firebase Storage"
                          >
                            <img
                              src={task.attachment.url}
                              alt={task.attachment.name}
                              className="rounded border"
                              style={{
                                maxHeight: "140px",
                                maxWidth: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <div className="small text-muted mt-1">
                              <i className="bi bi-box-arrow-up-right me-1"></i>
                              {task.attachment.name} ({formatFileSize(task.attachment.size)})
                            </div>
                          </a>
                        </div>
                      ) : (
                        <a
                          href={task.attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-light border d-inline-flex align-items-center gap-2 text-decoration-none text-dark"
                          title="Download attachment from Firebase Storage"
                        >
                          <i className="bi bi-paperclip text-primary fs-6"></i>
                          <span className="text-truncate" style={{ maxWidth: 220 }}>
                            {task.attachment.name}
                          </span>
                          <Badge bg="secondary" pill className="fw-normal">
                            {formatFileSize(task.attachment.size)}
                          </Badge>
                          <i className="bi bi-download text-muted ms-1"></i>
                        </a>
                      )}
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Badge bg="light" text="dark" className="border">
                      <i className="bi bi-tag me-1"></i>
                      {task.category || "General"}
                    </Badge>
                    <Badge bg={priorityVariant} className="text-capitalize">
                      {task.priority || "Medium"}
                    </Badge>
                    {task.userEmail && (
                      <span className="text-muted small d-none d-sm-inline">
                        <i className="bi bi-person me-1"></i>
                        {task.userEmail.split("@")[0]}
                      </span>
                    )}
                    {task.createdAt && (
                      <span className="text-muted small ms-auto">
                        <i className="bi bi-clock me-1"></i>
                        {formatTimestamp(task.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </Stack>
  );
};

export default TaskList;
