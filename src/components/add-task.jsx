import axios from "axios";
import { useFormik } from "formik";
import { useCookies } from "react-cookie";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export function AddTask() {
    let navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);

    const validationSchema = Yup.object({
        Appointment_Id: Yup.number()
            .required("Appointment_Id is required")
            .positive("Must be a positive integer")
            .integer("Must be an integer"),
        Title: Yup.string()
            .required("Title is required"),
        Description: Yup.string()
            .required("Description is required"),
        Date: Yup.date().required("Date is required"),
    });

    const formik = useFormik({
        initialValues: {
            Appointment_Id: 0,
            Title: '',
            Description: '',
            Date: '',
            UserId: cookies['userid']
        },
        validationSchema,
        onSubmit: (formdata) => {
            const newAppointment = {
                Appointment_Id: formdata.Appointment_Id,
                Title: formdata.Title,
                Description: formdata.Description,
                Date: formdata.Date,
                UserId: cookies['userid']
            };
            axios.post(`${process.env.REACT_APP_API_URL}/add-task`, newAppointment)
                .then(() => {
                    alert('Appointment added successfully');
                    navigate('/dashboard');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light px-3">
            <div className="bg-white p-4 shadow rounded" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4">Add Appointment</h3>
                <form onSubmit={formik.handleSubmit}>
                    <dl className="mb-3">
                        <dt>Appointment_Id</dt>
                        <dd>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                name="Appointment_Id"
                                className="form-control mb-2"
                                type="number"
                            />
                            {formik.touched.Appointment_Id && formik.errors.Appointment_Id && (
                                <div className="text-danger">{formik.errors.Appointment_Id}</div>
                            )}
                        </dd>

                        <dt>Title</dt>
                        <dd>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                name="Title"
                                className="form-control mb-2"
                                type="text"
                            />
                            {formik.touched.Title && formik.errors.Title && (
                                <div className="text-danger">{formik.errors.Title}</div>
                            )}
                        </dd>

                        <dt>Description</dt>
                        <dd>
                            <textarea
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                name="Description"
                                className="form-control mb-2"
                                rows="4"
                                placeholder="Enter description here"
                            ></textarea>
                            {formik.touched.Description && formik.errors.Description && (
                                <div className="text-danger">{formik.errors.Description}</div>
                            )}
                        </dd>

                        <dt>Date</dt>
                        <dd>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                name="Date"
                                className="form-control mb-3"
                                type="date"
                            />
                            {formik.touched.Date && formik.errors.Date && (
                                <div className="text-danger">{formik.errors.Date}</div>
                            )}
                        </dd>
                    </dl>

                    <button className="btn btn-success w-100" type="submit">Add Task</button>
                </form>
            </div>
        </div>
    );
}
