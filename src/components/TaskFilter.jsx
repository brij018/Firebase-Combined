import React from "react";
import { Card, Form, Row, Col, InputGroup, Button } from "react-bootstrap";

const TaskFilter = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.category !== "All" ||
    filters.status !== "All";

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-3">
        <Row className="g-2 align-items-center">
          <Col md={5}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search tasks..."
                className="border-start-0"
              />
            </InputGroup>
          </Col>

          <Col sm={6} md={3}>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>

          <Col sm={6} md={3}>
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Development">Development</option>
            </Form.Select>
          </Col>

          {hasActiveFilters && (
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onReset}
                title="Reset filters"
              >
                <i className="bi bi-x-circle"></i> Reset
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TaskFilter;
