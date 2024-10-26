import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

export function UserDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [cookies, , removeCookie] = useCookies(['userid']);
    let navigate = useNavigate();

    // Redirect if user ID is not present in cookies
    if (!cookies['userid']) {
        navigate('/');
    }

    // Load appointments from API
    const loadAppointments = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-appointments/${cookies['userid']}`)
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            })
            .finally(() => setLoading(false));
    };

    // Handle user sign-out
    const handlesignout = () => {
        removeCookie('userid');
        navigate('/');
    };

    // Handle appointment deletion
    const handleRemoveClick = (appointmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (confirmDelete) {
            axios.delete(`${process.env.REACT_APP_API_URL}/remove-task/${appointmentId}`)
                .then(() => {
                    loadAppointments(); // Reload appointments after deletion
                })
                .catch((error) => {
                    console.log("Error deleting appointment:", error);
                });
        }
    };

    // Navigate to edit task
    const handleEditTask = (appointmentId) => {
        navigate(`/edit-task/${appointmentId}`);
    };

    // Load appointments when the component mounts
    useEffect(() => {
        loadAppointments();
    }, []);

    return (
        <div className="container pt-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-3 mb-md-0">
                    <h3 className="pe-3">{cookies['userid']} - Dashboard</h3>
                    <Link to='/add-task' className="btn btn-success bi bi-calendar ms-md-3">
                        Add Appointment
                    </Link>
                </div>
                <button onClick={handlesignout} className="btn btn-danger">Logout</button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center mt-5">
                    <p>Loading appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <div className="mt-4">
                    {appointments.map(appointment => (
                        <div key={appointment.Appointment_Id} className="alert alert-success alert-dismissible mb-3">
                            <button onClick={() => handleRemoveClick(appointment.Appointment_Id)} className="btn btn-close"></button>
                            <h4 className="alert-title mb-1">{appointment.Title}</h4>
                            <p className="alert-text mb-1" style={{ overflowWrap: 'break-word' }}>
                                {appointment.Description}
                            </p>
                            <p className="mb-1">{new Date(appointment.Date).toLocaleDateString()}</p>
                            <button onClick={() => handleEditTask(appointment.Appointment_Id)} className="btn btn-warning bi bi-pencil me-2">
                                Edit Task
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-warning text-center mt-4">No appointments found.</div>
            )}
        </div>
    );
}
