import { Link } from "react-router-dom";

export function UserError() {
    return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light p-3">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h2 className="mb-3">Oops! Something went wrong</h2>
                <p className="mb-4 text-muted">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn btn-primary btn-lg">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
