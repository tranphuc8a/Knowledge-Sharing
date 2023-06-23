import './login.css'
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostAPI from '../../services/api/post-api';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';

export default function (props) {
  // email and password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // for navigating screen
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // loading -> true
      setLoading(true);

      // check password length
      if (password.length < 8) {
        throw new Error('Mật khẩu phải nhiều hơn 8 ký tự');
      }

      // temporily wait 2s for developing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // call login api
      await PostAPI.getInstance().setURL("http://localhost:3000/api/auth/login")
        .setData({
          email: email,
          password: password
        })
        .execute()
        .then(res => {
          if (res.code == 200) { // success
            // navigate to home
            navigate('/home');
          } else if (res.code == 400) { // bad request
            if (res.detail || res.detail.length <= 0)
              setError('Tài khoản hoặc mật khẩu không chính xác.');
            else
              setError(res.detail);
          } else { // server error
            setError('Xin lỗi, server của chúng tôi đang gặp trục trặc');
          }
        });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

  }


  return (
    <div className="Auth-form-container">
      <div className="vh-100" style={{
        backgroundPosition: 'center 20%',
        backgroundSize: 'auto',
        background: 'linear-gradient(to bottom, rgba(212, 63, 141, 0.9), rgba(2, 80, 197, 0.5))'
      }}>
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Đăng nhập</h3>
            <div className="form-group mt-3">
              <label className="label">Địa chỉ email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label className="label">Mật khẩu</label>

              <div className="input-group flex-row">
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="w-auto position-absolute top-50 end-0 translate-middle-y input-eye">
                    <button
                      className="btn mx-2 my-0 px-1 py-0 eye-button"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img
                        className={`eye-icon ${showPassword ? "show" : ""}`}
                        src={showPassword ? "/src/assets/ic_eye_open.png" : "/src/assets/ic_eye_closed.png"}
                        alt="Toggle Password Visibility"
                      />
                    </button>
                  </span>
                </div>


              </div>

            </div>
            <div className="d-flex gap-2 mt-3">
              {(loading) ?
                (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <button type="submit" className="btn btn-primary">Đăng nhập</button>
                )
              }
            </div>

            {error && <p className="error-message text-danger mt-4">{error}</p>}

            <p className="forgot-password text-right mt-2">
              <a href="#" className="text-primary justify-content-start small">Quên mật khẩu?</a>
            </p>

            <div className="divider my-4">
              <p className="or-text text-center fw-bold mx-3 mb-0 text-muted w-30">OR</p>
            </div>
            <a
              className="text-primary text-center"
              href="#!"
              role="button"
            >
              Đăng ký
            </a>
          </div>

        </form>
      </div>


    </div>

  );
}

