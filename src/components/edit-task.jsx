import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

export function EditTask() {
    const [appointment, setAppointment] = useState(null);
    const { appointmentId } = useParams();
    let navigate = useNavigate();

    const validationSchema = Yup.object({
        Title: Yup.string()
            .required("Title is required"),
        Description: Yup.string()
            .required("Description is required"),
        Date: Yup.date()
            .required("Date is required")
    });

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/appointment/${appointmentId}`)
            .then((response) => {
                console.log(response.data);
                setAppointment(response.data);
            })
            .catch((error) => {
                console.error("Error fetching appointment", error);
            });
    }, [appointmentId]);

    const editFormik = useFormik({
        initialValues: {
            Title: appointment?.Title || '',
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
        enableReinitialize: true
    });

    if (!appointment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light p-3">
            <div className="bg-white shadow p-3 p-md-4 rounded col-12 col-md-6 col-lg-4">
                <h3 className="text-center mb-4">Edit Appointment</h3>
                <form onSubmit={editFormik.handleSubmit}>
                    <div className="mb-3">
                        <dd className="mb-1">Title</dd>
                        <input
                            id="Title"
                            name="Title"
                            className="form-control w-100"
                            onChange={editFormik.handleChange}
                            value={editFormik.values.Title}
                            type="text"
                            onBlur={editFormik.handleBlur}
                        />
                        {editFormik.touched.Title && editFormik.errors.Title ? (
                            <div className="text-danger">{editFormik.errors.Title}</div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                        <dd className="mb-1">Description</dd>
                        <textarea
                            id="Description"
                            rows="4"
                            name="Description"
                            className="form-control w-100"
                            onChange={editFormik.handleChange}
                            value={editFormik.values.Description}
                            onBlur={editFormik.handleBlur}
                        ></textarea>
                        {editFormik.touched.Description && editFormik.errors.Description ? (
                            <div className="text-danger">{editFormik.errors.Description}</div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                        <dd className="mb-1">Date</dd>
                        <input
                            id="Date"
                            name="Date"
                            type="date"
                            className="form-control w-100"
                            onChange={editFormik.handleChange}
                            value={editFormik.values.Date}
                            onBlur={editFormik.handleBlur}
                        />
                        {editFormik.touched.Date && editFormik.errors.Date ? (
                            <div className="text-danger">{editFormik.errors.Date}</div>
                        ) : null}
                    </div>
                    <button className="btn btn-primary w-100" type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}
