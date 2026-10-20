import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import AuthCard from "./components/AuthCard";
import useAuth from "./context/useAuth";
import {
  subscribeToTasks,
  addTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from "./config/db";

const initialFilters = {
  search: "",
  category: "All",
  status: "All",
};

function App() {
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Subscribe to real-time Firestore updates only when authenticated
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTasks(
      (data) => {
        setTasks(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || "Failed to connect to Firebase Firestore");
        setLoading(false);
      }
    );

    // Clean up real-time listener on unmount or user change
    return () => unsubscribe();
  }, [user]);

  // Database operations
  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData, user);
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task: " + err.message);
    }
  };

  const handleUpdateTask = async (id, updatedFields) => {
    try {
      await updateTask(id, updatedFields);
      setEditingTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task: " + err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleTaskStatus(id, currentStatus);
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteTask = async (id, storagePath) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id, storagePath);
        if (editingTask?.id === id) {
          setEditingTask(null);
        }
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task: " + err.message);
      }
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title || "").toLowerCase().includes(filters.search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory =
      filters.category === "All" || task.category === filters.category;

    const matchesStatus =
      filters.status === "All" || task.status === filters.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-vh-100 bg-light pb-5">
      <Navbar totalTasks={tasks.length} />

      <Container>
        {authLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-2" />
            <p className="text-muted small">Checking Firebase authentication...</p>
          </div>
        ) : !user ? (
          <div className="py-4">
            <AuthCard />
          </div>
        ) : (
          <>
            <Stats tasks={tasks} />

            <Row className="g-4">
              {/* Left Column: Create / Edit Form */}
              <Col lg={5} md={5}>
                <TaskForm
                  key={editingTask?.id || "new-task"}
                  onAddTask={handleAddTask}
                  editingTask={editingTask}
                  onUpdateTask={handleUpdateTask}
                  onCancelEdit={() => setEditingTask(null)}
                />
              </Col>

              {/* Right Column: Search/Filter & List */}
              <Col lg={7} md={7}>
                <TaskFilter
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() => setFilters(initialFilters)}
                />

                <TaskList
                  tasks={filteredTasks}
                  loading={loading}
                  error={error}
                  onToggleStatus={handleToggleStatus}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onDeleteTask={handleDeleteTask}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
