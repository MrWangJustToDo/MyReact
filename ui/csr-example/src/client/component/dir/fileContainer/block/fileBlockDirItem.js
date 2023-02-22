import { Link } from "react-router-dom";

function FileBlockDirItem(props) {
  return (
    <div className="fm-folder-item relative" title={props.readAbleLength}>
      <Link className="block" to={props.linkTarget}>
        <i className="fas fa-folder"></i>
        <span className="fm-file-name block">{props.shortPath}</span>
      </Link>
    </div>
  );
}

export default FileBlockDirItem;
