import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../redux/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleDemoClick = (e) => {
    e.preventDefault();
    dispatch(
      sessionActions.thunkLogin({ email: "demo@aa.io", password: "password" })
    ).then(() => {
      closeModal();
      window.location.href = "/";
    });
  };

  return (
    <div className="login-form-modal">
      <h1 className="login-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-stuff">
          <div className="login-labels">
            <p className="input-label">Email:</p>
            <p className="input-label">Password:</p>
          </div>
          <div className="login-inputs">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p>{errors.email}</p>}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button className="login-button" type="submit">
          Log In
        </button>
        <button className="demo-user" type="button" onClick={handleDemoClick}>
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
