import React, { useState } from "react";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import useAuth from "../context/useAuth";

const AuthCard = () => {
  const {
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    loginAnonymouslyUser,
  } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFriendlyError = (err) => {
    const code = err.code || "";
    if (code === "auth/unauthorized-domain") {
      return "Unauthorized domain! In Firebase Console -> Authentication -> Settings -> Authorized domains, add 'localhost' or '127.0.0.1'.";
    }
    if (
      code === "auth/operation-not-allowed" ||
      code === "auth/admin-restricted-operation"
    ) {
      return "Anonymous (Guest) sign-in is not enabled in Firebase. Go to Firebase Console -> Authentication -> Sign-in method, click 'Anonymous' and toggle 'Enable'.";
    }
    if (code === "auth/popup-closed-by-user") {
      return "Google Sign-In popup was closed before completing.";
    }
    if (
      code === "auth/invalid-credential" ||
      code === "auth/wrong-password" ||
      code === "auth/user-not-found"
    ) {
      return "Invalid email or password.";
    }
    if (code === "auth/email-already-in-use") {
      return "An account with this email already exists. Try signing in instead.";
    }
    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters.";
    }
    return (
      err.message ||
      "Authentication failed. Please check your Firebase settings."
    );
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google Auth error:", err);
      setError(getFriendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error("Email Auth error:", err);
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginAnonymouslyUser();
    } catch (err) {
      console.error("Anonymous Auth error:", err);
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: 460 }}>
      <Card.Body className="p-4 p-sm-5 text-center">
        <div
          className="rounded-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{ width: 60, height: 60 }}
        >
          <i className="bi bi-shield-lock fs-3"></i>
        </div>

        <h4 className="fw-bold mb-1">Sign In Required</h4>

        {error && (
          <Alert variant="danger" className="text-start small py-2">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {/* Google Sign-in */}
        <Button
          variant="outline-dark"
          className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="bi bi-google text-danger"></i>
          )}
          <span>Continue with Google</span>
        </Button>

        <div className="d-flex align-items-center my-3 text-muted small">
          <hr className="flex-grow-1 my-0" />
          <span className="px-2">or email</span>
          <hr className="flex-grow-1 my-0" />
        </div>

        {/* Email/Password form */}
        <Form onSubmit={handleEmailAuth} className="text-start mb-3">
          <Form.Group className="mb-2" controlId="authEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              size="sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="authPassword">
            <Form.Control
              type="password"
              placeholder="Password (min 6 chars)"
              size="sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-100 py-2 fw-semibold"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : isRegistering ? (
              "Create Account & Enter"
            ) : (
              "Sign In"
            )}
          </Button>
        </Form>

        <div className="d-flex justify-content-between align-items-center pt-2 text-muted small">
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Need an account? Register"}
          </button>

          <button
            type="button"
            className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
            onClick={handleAnonymousSignIn}
            title="Sign in as a temporary guest"
          >
            Guest Sign In
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuthCard;
