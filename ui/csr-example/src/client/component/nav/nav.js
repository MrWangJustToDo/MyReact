import NavFile from "./navFile";
import NavEcharts from "./navEcharts";
import NavRecover from "./navRecover";
import NavTotalSize from "./navTotalSize";
import "./nav.css";

function Nav() {
  return (
    <nav className="nav absolute overflow">
      <ul className="nav-select">
        <NavFile />
        <NavEcharts />
        <NavRecover />
        <NavTotalSize />
      </ul>
    </nav>
  );
}

export default Nav;
