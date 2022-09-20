import { Link } from "react-router-dom";

function Logo(props) {
  return (
    <div className="head-logo flex-center height-inherit">
      <h1 className="head-logo-content width-inherit" title="首页">
        <Link className="block width-inherit height-inherit" to="/">
          {props.title}
        </Link>
      </h1>
    </div>
  );
}

export default Logo; 
