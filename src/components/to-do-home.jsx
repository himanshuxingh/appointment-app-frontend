import { Link } from "react-router-dom";

export function ToDoHome() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <h1 className="text-end pt-3 ms-4">Your Appointments - Home</h1>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <main className="d-flex flex-column flex-md-row mt-2">
                    <Link to='/login' className="btn btn-warning btn-lg me-2 mb-4 mb-md-0">User Login</Link>
                    <Link to='/register' className="btn btn-light btn-lg">New User Register</Link>
                </main>
            </div>
        </div>
    );
}
