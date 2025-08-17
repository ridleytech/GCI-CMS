import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div>
      <ul>
        <li>
          <Link to={"/contacts"}>Contacts</Link>
        </li>
        <li>
          <Link to={"/"}>Compose</Link>
        </li>
        <li>
          <Link to={"templates"}>Templates</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
