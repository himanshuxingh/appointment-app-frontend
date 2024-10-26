import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useCookies } from "react-cookie";

const validationSchema = Yup.object({
    UserId: Yup.string().required("UserId is Required"),
    Password: Yup.string().required("Password is Required").min(4, "Password too short")
});

export function UserLogin() {
    const [cookies, setCookie] = useCookies(['userid']);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            UserId: '',
            Password: ''
        },
        validationSchema,
        onSubmit: (formdata) => {
            axios.get(`${process.env.REACT_APP_API_URL}/get-users`)
                .then(response => {
                    var user = response.data.find(user => user.UserId === formdata.UserId);
                    if (user) {
                        if (user.Password === formdata.Password) {
                            setCookie('userid', formdata.UserId);
                            navigate('/dashboard');
                        } else {
                            alert('Incorrect password');
                        }
                    } else {
                        alert('Incorrect User ID or password');
                    }
                });
        }
    });

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="bg-white p-4 shadow" style={{ width: '90%', maxWidth: '400px', height: 'auto' }}>
                <h1 className="bi bi-person-fill text-center">User Login</h1>
                <form onSubmit={formik.handleSubmit} className="text-dark">
                    <dl>
                        <dt>User Id</dt>
                        <dd>
                            <input
                                name="UserId"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="text"
                                className="form-control"
                                value={formik.values.UserId}
                            />
                            {formik.touched.UserId && formik.errors.UserId ? (
                                <div className="text-danger">{formik.errors.UserId}</div>
                            ) : null}
                        </dd>

                        <dt>Password</dt>
                        <dd>
                            <div className="input-group border rounded px-2">
                                <input
                                    name="Password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    className="form-control border-0"
                                    value={formik.values.Password}
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                        boxShadow: 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn border-0"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    style={{
                                        background: 'none',
                                        boxShadow: 'none'
                                    }}
                                >
                                    <i className={`bi ${isPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>

                            {formik.touched.Password && formik.errors.Password ? (
                                <div className="text-danger">{formik.errors.Password}</div>
                            ) : null}
                        </dd>
                    </dl>
                    <button type="submit" className="btn btn-warning w-100 mt-4">Login</button>
                    <div className="d-flex justify-content-center">
                        <Link to='/register' className="mt-3">
                            New User? Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
