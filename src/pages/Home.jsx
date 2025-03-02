import { Link } from "react-router-dom";

import LogoutButton from "./LogoutButton";

const Home = (props) => {
  return (
    <div className="mt-4">
      <LogoutButton />
      {props.messages?<button className="btn btn-success">Services Unavailable</button>:<div><button className="btn btn-success">Accepting Orders</button>
      <Link to="/options">
        <button className="btn btn-warning">Use printing services</button>
      </Link>
      <Link to="/options">
        <button className="btn btn-warning">Ongoing Orders</button>
      </Link></div>
      }
    </div>
  );
};

export default Home;
