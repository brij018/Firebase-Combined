import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { uploadFile, deleteFile } from "../config/storage";

const initialFormState = {
  title: "",
  description: "",
  category: "General",
  priority: "Medium",
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) => {
  const [formData, setFormData] = useState(() =>
    editingTask
      ? {
          title: editingTask.title || "",
          description: editingTask.description || "",
          category: editingTask.category || "General",
          priority: editingTask.priority || "Medium",
        }
      : initialFormState
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(
    editingTask?.attachment || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveExistingAttachment = async () => {
    if (existingAttachment?.path) {
      await deleteFile(existingAttachment.path);
    }
    setExistingAttachment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setIsSubmitting(true);
      let attachment = existingAttachment;

      // If a new file is selected, upload to Firebase Storage
      if (selectedFile) {
        setStatusMessage("Uploading file to Firebase Storage...");
        // If there was an old attachment, clean it up from storage
        if (existingAttachment?.path) {
          await deleteFile(existingAttachment.path);
        }
        attachment = await uploadFile(selectedFile);
      }

      setStatusMessage("Saving record to Firestore...");
      if (editingTask) {
        await onUpdateTask(editingTask.id, {
          ...formData,
          attachment,
        });
      } else {
        await onAddTask({
          ...formData,
          attachment,
        });
        setFormData(initialFormState);
        setSelectedFile(null);
        setExistingAttachment(null);
      }
    } catch (err) {
      console.error("Form submit error:", err);
      alert("Error saving: " + err.message);
    } finally {
      setIsSubmitting(false);
      setStatusMessage("");
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title fw-bold mb-0">
            {editingTask ? (
              <>
                <i className="bi bi-pencil-square text-warning me-2"></i>Edit Task
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle text-primary me-2"></i>Add New Task
              </>
            )}
          </h5>
          {editingTask && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onCancelEdit}
              className="rounded-pill px-3"
            >
              Cancel
            </Button>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="taskTitle">
            <Form.Label className="fw-semibold small">Task Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Upload project documentation"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="taskDescription">
            <Form.Label className="fw-semibold small">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add extra details, notes, or links..."
            />
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col sm={6}>
              <Form.Group controlId="taskCategory">
                <Form.Label className="fw-semibold small">Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Development">Development</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="taskPriority">
                <Form.Label className="fw-semibold small">Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* File Upload to Firebase Storage */}
          <Form.Group className="mb-3" controlId="taskFile">
            <Form.Label className="fw-semibold small d-flex align-items-center justify-content-between">
              <span>
                <i className="bi bi-paperclip me-1 text-primary"></i> File Attachment (Firebase Storage)
              </span>
              <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>
                Optional
              </span>
            </Form.Label>

            {/* Existing Attachment Badge */}
            {existingAttachment && !selectedFile && (
              <div className="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded border">
                <div className="d-flex align-items-center gap-2 text-truncate me-2">
                  <i className="bi bi-file-earmark-check text-success"></i>
                  <span className="small text-truncate" title={existingAttachment.name}>
                    {existingAttachment.name}
                  </span>
                  <Badge bg="secondary" pill className="fw-normal">
                    {formatFileSize(existingAttachment.size)}
                  </Badge>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="py-0 px-2"
                  onClick={handleRemoveExistingAttachment}
                  title="Remove attachment"
                >
                  <i className="bi bi-x"></i>
                </Button>
              </div>
            )}

            <Form.Control
              type="file"
              size="sm"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />

            {selectedFile && (
              <div className="d-flex align-items-center justify-content-between mt-2 px-2 py-1 bg-primary-subtle text-primary rounded small">
                <span className="text-truncate me-2">
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0 text-decoration-none"
                  onClick={() => setSelectedFile(null)}
                >
                  Remove
                </Button>
              </div>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant={editingTask ? "warning" : "primary"}
            className="w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>{statusMessage || "Processing..."}</span>
              </>
            ) : editingTask ? (
              <>
                <i className="bi bi-check-lg"></i> Update Task
              </>
            ) : (
              <>
                <i className="bi bi-cloud-arrow-up"></i> Save with Storage
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TaskForm;
