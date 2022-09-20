import "./load.css";

function Load(props) {
  return (
    <div className="loading absolute" ref={props.foRef}>
      <div className="loading-item absolute"></div>
    </div>
  );
}

export default Load;
