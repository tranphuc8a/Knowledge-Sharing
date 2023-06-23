import './login.css'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function (props) {
  return (
    <div className="Auth-form-container">
      <div className="vh-100" style={{
        backgroundPosition: 'center 20%',
        backgroundSize: 'auto',
        background: 'linear-gradient(to bottom, rgba(212, 63, 141, 0.9), rgba(2, 80, 197, 0.5))'
      }}>
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Đăng nhập</h3>
            <div className="form-group mt-3">
              <label className="label">Địa chỉ email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Nhập email"
              />
            </div>
            <div className="form-group mt-3">
              <label className="label">Mật khẩu</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
              />
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Đăng nhập
              </button>
            </div>
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

