import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const Stats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;

  return (
    <Row className="g-3 mb-4">
      <Col xs={12} sm={4}>
        <Card className="border-0 shadow-sm bg-white p-3 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-medium text-uppercase">Total Items</div>
              <h3 className="fw-bold mb-0 mt-1">{total}</h3>
            </div>
            <div className="rounded-circle bg-primary-subtle text-primary p-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              <i className="bi bi-stack fs-5"></i>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={4}>
        <Card className="border-0 shadow-sm bg-white p-3 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-medium text-uppercase">Pending</div>
              <h3 className="fw-bold mb-0 mt-1 text-warning">{pending}</h3>
            </div>
            <div className="rounded-circle bg-warning-subtle text-warning p-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              <i className="bi bi-hourglass-split fs-5"></i>
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={4}>
        <Card className="border-0 shadow-sm bg-white p-3 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-medium text-uppercase">Completed</div>
              <h3 className="fw-bold mb-0 mt-1 text-success">{completed}</h3>
            </div>
            <div className="rounded-circle bg-success-subtle text-success p-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              <i className="bi bi-check2-circle fs-5"></i>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Stats;
