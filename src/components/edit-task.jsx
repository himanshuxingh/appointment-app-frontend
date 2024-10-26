import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

export function EditTask() {
    const [appointment, setAppointment] = useState(null); // null to handle loading state
    const { appointmentId } = useParams();
    let navigate = useNavigate();

    const validationSchema = Yup.object({
        Title: Yup.string()
            .required("Tilte is required"),
        Description: Yup.string()
            .required("Description is reqired"),
        Date: Yup.date()
            .required("date is required")
    })

    // Fetch the appointment data
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/appointment/${appointmentId}`)
            .then((response) => {
                console.log(response.data);
                setAppointment(response.data); // Set fetched appointment data
            })
            .catch((error) => {
                console.error("Error fetching appointment", error);
            });
    }, [appointmentId]);

    // Initialize Formik with dynamic initialValues based on fetched data
    const editFormik = useFormik({
        initialValues: {
            Title: appointment?.Title || '', // Default to empty string if appointment is null
            Description: appointment?.Description || '',
            Date: appointment?.Date ? new Date(appointment.Date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        },
        validationSchema,
        onSubmit: (formdata) => {
            axios.put(`${process.env.REACT_APP_API_URL}/edit-task/${appointmentId}`, formdata)
                .then((response) => {
                    console.log("Updated successfully", response.data);
                    navigate('/dashboard')

                })
                .catch((error) => {
                    console.error("Error updating appointment", error);
                });
        },
        enableReinitialize: true // This ensures Formik updates when appointment is fetched
    });

    // Show loading indicator while appointment data is being fetched
    if (!appointment) {
        return <div>Loading...</div>; // or some kind of spinner
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="bg-white p-4 shadow" style={{ width: '30%' }}>
                <h3 className="text-center mb-4">Edit Appointment</h3>
                <form onSubmit={editFormik.handleSubmit}>
                    <div className="mb-3">
                        <dd>Title</dd>
                        <input
                            id="Title"
                            name="Title"
                            className="form-control"
                            onChange={editFormik.handleChange}
                            value={editFormik.values.Title} // Fetched value now reflected here
                            type="text"
                            onBlur={editFormik.handleBlur}
                        />
                        {editFormik.touched.Title&&editFormik.errors.Title?(<div className="text-danger">{editFormik.errors.Title}</div>):null}
                    </div>
                    <div className="mb-3">
                        <dd>Description</dd>
                        <textarea
                            id="Description"
                            rows="4"
                            name="Description"
                            className="form-control"
                            onChange={editFormik.handleChange}
                            value={editFormik.values.Description} // Fetched value reflected here
                            onBlur={editFormik.handleBlur}
                        ></textarea>
                        {editFormik.touched.Description&&editFormik.errors.Description?(<div className="text-danger">{editFormik.errors.Description}</div>):null}
                    </div>
                    <div className="mb-3">
                        <dd>Date</dd>
                        <input
                            id="dte"
                            name="Date"
                            type="date"
                            className="form-control"
                            onChange={editFormik.handleChange}
                            value={editFormik.values.Date} // Date properly formatted and reflected
                            onBlur={editFormik.handleBlur}
                        />
                        {editFormik.touched.Date&&editFormik.errors.Date?(<div className="text-danger">{editFormik.errors.Date}</div>):null}
                    </div>
                    <button className="btn btn-primary w-100" type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}
