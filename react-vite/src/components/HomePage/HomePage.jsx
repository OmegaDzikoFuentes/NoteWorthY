import { useSelector } from "react-redux";
import "./HomePage.css";

function HomePage() {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <div className="home-page-container">
      {sessionUser ? (
        <h1 className="home-page-header">
          Welcome {sessionUser.username}, <br /> We&apos;re happy to see you
          again!{" "}
        </h1>
      ) : (
        <h1 className="home-page-header">
          Welcome to Noteworthy! <br /> Please signup or login as a demo user
          for the full experience!
        </h1>
      )}
    </div>
  );
}

export default HomePage;
