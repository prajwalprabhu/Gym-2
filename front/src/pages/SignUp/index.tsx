import { useRef } from "preact/hooks";
import { client, UsersService } from "../../client";


function Signup() {

  const userName = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const gender = useRef<HTMLSelectElement>(null);
  const age = useRef<HTMLInputElement>(null);
  const height = useRef<HTMLInputElement>(null);
  const weight = useRef<HTMLInputElement>(null);

  return (
    <div class="">
      <div class="container">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6 col-lg-4">
            <div class="card position-absolute top-50 start-50 translate-middle w-25">
              <div class="card-body">
                <h3 class="card-title text-center">Signup</h3>
                <form
                  class="needs-validation"
                  noValidate
                  onSubmit={(e) => {
                    e.currentTarget.classList.add('was-validated');
                    e.preventDefault();
                    if (!e.currentTarget.checkValidity()) {
                      return;
                    }
                    if (
                      password.current?.value !== confirmPassword.current?.value
                    ) {
                      alert('Passwords do not match');
                      return;
                    }
                    UsersService.createUser({
                      body: {
                        name: userName.current?.value || '',
                        password: password.current?.value || '',
                        gender: gender.current?.value || '',
                        age: parseInt(age.current?.value) || 0,
                        height: parseInt(height.current?.value) || 0,
                        weight: parseInt(weight.current?.value) || 0,
                        user_id: 0,
                      }
                    })
                    e.currentTarget.classList.remove('was-validated');
                  }}>
                  <div class="mb-3">
                    <label
                      htmlFor="username"
                      class="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Enter username"
                      required
                      ref={userName}
                    />
                    <div class="invalid-feedback">
                      User Name Cannot be empty
                    </div>
                  </div>
                  <div class="mb-3">
                    <label
                      htmlFor="password"
                      class="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Password"
                      required
                      minLength={8}
                      ref={password}
                    />
                    <div class="invalid-feedback">
                      Password should have at least 8 characters
                    </div>
                  </div>
                  <div class="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      class="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      required
                      minLength={8}
                      ref={confirmPassword}
                    />
                    <div class="invalid-feedback">
                      Confirm Password should have at least 8 characters
                    </div>
                  </div>
                  <div class="mb-3">
                    <label
                      htmlFor="gender"
                      class="form-label">
                      Gender
                    </label>
                    <select
                      class="form-select"
                      id="gender"
                      required
                      ref={gender}>
                      <option value="">Select gender</option>
                      <option value="m">Male</option>
                      <option value="f">Female</option>
                      <option value="o">Other</option>
                    </select>
                    <div class="invalid-feedback">
                      Please select a gender
                    </div>
                  </div>
                  <div class="mb-3">
                    <label
                      htmlFor="age"
                      class="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="age"
                      placeholder="Enter your age"
                      required
                      ref={age}
                    />
                    <div class="invalid-feedback">Age is required</div>
                  </div>
                  <div class="mb-3">
                    <label
                      htmlFor="height"
                      class="form-label">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="height"
                      placeholder="Enter your height in cm"
                      required
                      ref={height}
                    />
                    <div class="invalid-feedback">Height is required</div>
                  </div>
                  <div class="mb-3">
                    <label
                      htmlFor="weight"
                      class="form-label">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="weight"
                      placeholder="Enter your weight in kg"
                      required
                      ref={weight}
                    />
                    <div class="invalid-feedback">Weight is required</div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary w-100">
                    Signup
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

export default Signup;
