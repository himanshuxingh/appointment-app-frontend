import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Define a validation schema using Yup
const validationSchema = Yup.object({
  UserId: Yup.string()
    .required('UserId is required'), // Must be filled in
  UserName: Yup.string()
    .required('UserName is required'), // Must be filled in
  Password: Yup.string()
    .min(4, 'Password must be at least 4 characters long') // Must be at least 4 characters
    .required('Password is required'), // Must be filled in
  Email: Yup.string()
    .email('Invalid email address') // Must be a valid email
    .required('Email is required'), // Must be filled in
  Mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits') // Must be a valid 10-digit number
    .required('Mobile is required'), // Must be filled in
});

export function UserRegister() {
  const [error, setError] = useState('');
  const [errorClass, setErrorClass] = useState('');
  let navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Use Formik for form handling, and apply validation schema
  const formik = useFormik({
    initialValues: {
      UserId: '',
      UserName: '',
      Password: '',
      Email: '',
      Mobile: ''
    },
    validationSchema, // Connect the validation schema to Formik
    onSubmit: (formdata) => {
      const user = {
        UserId: formdata.UserId,
        UserName: formdata.UserName,
        Password: formdata.Password,
        Email: formdata.Email,
        Mobile: formdata.Mobile
      };

      axios.post(`${process.env.REACT_APP_API_URL}/register-user`, user)
        .then(response => {
          alert("User registered successfully!");
          navigate('/login');
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  });

  function verifyUserId(e) {
    if (e.target.value === '') {
      setError('');
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/get-users`)
      .then(response => {
        const userExists = response.data.some(user => user.UserId === e.target.value);
        if (userExists) {
          setError('UserId taken, use another.');
          setErrorClass('text-danger');
        } else {
          setError('UserId available');
          setErrorClass('text-success');
        }
      });
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="bg-white p-4 shadow" style={{ width: '90%', maxWidth: '500px', height: 'auto' }}>
        <h1 className="bi bi-person-fill text-center">User Register</h1>
        <form onSubmit={formik.handleSubmit} className="text-dark">
          <dl>
            <dt>User Id</dt>
            <dd>
              <input
                name="UserId"
                onKeyUp={verifyUserId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // Handle field blur (user leaves the field)
                type="text"
                className="form-control"
              />
              {/* Show error message if validation fails */}
              {formik.touched.UserId && formik.errors.UserId ? (
                <div className="text-danger">{formik.errors.UserId}</div>
              ) : null}
            </dd>
            <dd className={errorClass}>{error}</dd>

            <dt>User Name</dt>
            <dd>
              <input
                name="UserName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="form-control mb-3"
              />
              {/* Show error message if validation fails */}
              {formik.touched.UserName && formik.errors.UserName ? (
                <div className="text-danger">{formik.errors.UserName}</div>
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

            <dt>Email</dt>
            <dd>
              <input
                name="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                className="form-control mb-3"
              />
              {/* Show error message if validation fails */}
              {formik.touched.Email && formik.errors.Email ? (
                <div className="text-danger">{formik.errors.Email}</div>
              ) : null}
            </dd>

            <dt>Mobile</dt>
            <dd>
              <input
                name="Mobile"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                className="form-control mb-3"
              />
              {/* Show error message if validation fails */}
              {formik.touched.Mobile && formik.errors.Mobile ? (
                <div className="text-danger">{formik.errors.Mobile}</div>
              ) : null}
            </dd>
          </dl>

          <button type="submit" className="btn btn-warning w-100 mt-3">Register</button>
          <div className="d-flex justify-content-center">
            <Link to='/login' className="mt-4">
              Existing user? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
