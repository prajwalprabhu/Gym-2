import { useRef } from 'react';
import { UsersService } from '../../client';

function Login() {
  const userName = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  return (
    <div className="">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 col-lg-4">
            <div className="card position-absolute top-50 start-50 translate-middle w-25">
              <div className="card-body">
                <h3 className="card-title text-center">Login</h3>
                <form
                  className="needs-validation"
                  noValidate
                  onSubmit={async (e) => {
                    e.currentTarget.classList.add('was-validated');
                    e.preventDefault();
                    if (!e.currentTarget.checkValidity()) {
                      return;
                    }

                    let res = await UsersService.login({
                      body: {
                        name: userName.current?.value,
                        password: password.current?.value,
                      },
                    });
                    if (res.data.success) {
                      alert('Login Successful');
                    } else {
                      alert('Login Failed');
                    }
                    if (res) e.currentTarget.classList.remove('was-validated');
                  }}>
                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      required
                      ref={userName}
                    />
                    <div className="invalid-feedback">
                      User Name Cannot be empty{' '}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      required
                      minLength={8}
                      ref={password}
                    />
                    <div className="invalid-feedback">
                      Password should have at least 8 characters
                    </div>
                  </div>
                  {/* <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div> */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
