import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

export function UserDashboard() {
    let navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies('userid');

    // Redirect if user ID is not present in cookies
    if (!cookies['userid']) {
        navigate('/');
    }

    const [appointments, setAppointments] = useState([]);

    // Load appointments from API
    function loadAppointments() {
        axios.get(`${process.env.REACT_APP_API_URL}/get-appointments/${cookies['userid']}`)
            .then(response => {
                setAppointments(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }

    // Handle user sign-out
    function handlesignout() {
        removeCookie('userid');
        navigate('/');
    }

    // Handle appointment deletion
    function handleRemoveClick(appointmentId) {
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (confirmDelete) {
            axios.delete(`${process.env.REACT_APP_API_URL}/remove-task/${appointmentId}`)
                .then(() => {
                    console.log('Appointment deleted.');
                    loadAppointments(); // Reload appointments after deletion
                })
                .catch((error) => {
                    console.log("Error deleting appointment:", error);
                });
        } else {
            console.log("Delete action canceled");
        }
    }

    // Navigate to edit task
    function handleEditTask(appointmentId) {
        navigate(`/edit-task/${appointmentId}`);
    }

    // Load appointments when the component mounts
    useEffect(() => {
        loadAppointments();
    }, []);

    return (
        <div className="container pt-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-3 mb-md-0">
                    <h3 className="pe-3">{cookies['userid']} - Dashboard</h3>
                    <Link to={'/add-task'} className="bi bi-calendar btn btn-success">
                        Add Appointment
                    </Link>
                </div>
                <button onClick={handlesignout} className="btn btn-danger">Logout</button>
            </div>
            <div className="mt-4">
                {
                    appointments.length > 0 ? appointments.map(appointment => (
                        <div className="alert alert-success alert-dismissible mb-3" key={appointment.Appointment_Id}>
                            <button onClick={() => { handleRemoveClick(appointment.Appointment_Id) }} data-bs-dismiss="alert" className="btn btn-close"></button>
                            <h2 className="alert-title">{appointment.Title}</h2>
                            {/* Display Description in a new line without truncating */}
                            <p className="alert-text mb-1" style={{ overflowWrap: 'break-word' }}>{appointment.Description}</p>
                            <p className="mb-1">{new Date(appointment.Date).toLocaleDateString()}</p> {/* Format the date */}
                            <button onClick={() => { handleEditTask(appointment.Appointment_Id) }} className="btn btn-warning bi bi-pencil"> Edit Task</button>
                        </div>
                    )) : (
                        <div className="alert alert-warning">No appointments found.</div>
                    )
                }
            </div>
        </div>
    );
}
