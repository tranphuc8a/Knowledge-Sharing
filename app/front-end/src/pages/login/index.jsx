import './login.css'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// function Login() {
//   return (
//     <section className="vh-100">
//       <div className="container py-5 h-100">
//         <div className="row d-flex align-items-center justify-content-center h-100">
//           <div className="col-md-8 col-lg-7 col-xl-6">
//             <img
//               src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
//               className="img-fluid"
//               alt="Phone image"
//             />
//           </div>
//           <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
//             <form>
//               {/* Email input */}
//               <div className="form-outline mb-4">
//                 <input
//                   type="email"
//                   id="form1Example13"
//                   className="form-control form-control-lg"
//                 />
//                 <label className="form-label" htmlFor="form1Example13">
//                   Email address
//                 </label>
//               </div>
//               {/* Password input */}
//               <div className="form-outline mb-4">
//                 <input
//                   type="password"
//                   id="form1Example23"
//                   className="form-control form-control-lg"
//                 />
//                 <label className="form-label" htmlFor="form1Example23">
//                   Password
//                 </label>
//               </div>
//               <div className="d-flex justify-content-around align-items-center mb-4">
//                 {/* Checkbox */}
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     defaultValue=""
//                     id="form1Example3"
//                     defaultChecked=""
//                   />
//                   <label className="form-check-label" htmlFor="form1Example3">
//                     {" "}
//                     Remember me{" "}
//                   </label>
//                 </div>
//                 <a href="#!">Forgot password?</a>
//               </div>
//               {/* Submit button */}
//               <button type="submit" className="btn btn-primary btn-lg btn-block">
//                 Sign in
//               </button>
//               <div className="divider d-flex align-items-center my-4">
//                 <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
//               </div>
//               <a
//                 className="btn btn-primary btn-lg btn-block"
//                 style={{ backgroundColor: "#3b5998" }}
//                 href="#!"
//                 role="button"
//               >
//                 <i className="fab fa-facebook-f me-2" />
//                 Continue with Facebook
//               </a>
//               <a
//                 className="btn btn-primary btn-lg btn-block"
//                 style={{ backgroundColor: "#55acee" }}
//                 href="#!"
//                 role="button"
//               >
//                 <i className="fab fa-twitter me-2" />
//                 Continue with Twitter
//               </a>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>

//   );
// }

// export default Login;


export default function (props) {
  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}

