import React from "react";
import { Navbar as BsNavbar, Container, Badge, Button } from "react-bootstrap";
import useAuth from "../context/useAuth";

const Navbar = ({ totalTasks }) => {
  const { user, logout } = useAuth();

  return (
    <BsNavbar bg="white" className="border-bottom shadow-sm py-3 mb-4 sticky-top">
      <Container>
        <BsNavbar.Brand className="d-flex align-items-center gap-2 fw-bold text-primary mb-0">
          <i className="bi bi-fire text-danger fs-4"></i>
          <span>Firebase Database</span>
        </BsNavbar.Brand>

        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill d-none d-sm-inline-block">
                <i className="bi bi-database text-primary me-1"></i> Firestore Live
              </Badge>
              <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill d-none d-md-inline-block">
                <i className="bi bi-cloud-arrow-up text-info me-1"></i> Storage
              </Badge>
              <Badge bg="primary" className="rounded-pill px-3 py-2">
                {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
              </Badge>
              <div className="d-flex align-items-center gap-2 ms-2 ps-2 border-start">
                <span className="small text-muted d-none d-md-inline" title={user.email || user.displayName || "User"}>
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill px-3 py-1"
                  onClick={logout}
                  title="Sign Out"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Badge bg="warning-subtle" text="warning-emphasis" className="rounded-pill px-3 py-2 border border-warning-subtle">
              <i className="bi bi-lock me-1"></i> Locked (Auth Required)
            </Badge>
          )}
        </div>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
