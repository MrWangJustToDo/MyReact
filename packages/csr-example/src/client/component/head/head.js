// head组件
import HeadLogo from "./headLogo";
import HeadPath from "./headPath";
import HeadUser from "./headUser";
import "./head.css";

function Head() {
  return (
    <header className="header relative">
      <div className="header-nav height-inherit flex">
        <HeadLogo title="hello world!" />
        <HeadPath />
        <HeadUser />
      </div>
    </header>
  );
}

export default Head
