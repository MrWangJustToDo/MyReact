import FileRecoverItemCheck from "./fileRecoverItemCheck";

function FileTableDirItem(props) {
  return (
    <tr className="fm-table-folder">
      <td className="son-inline-block-center relative">
        <FileRecoverItemCheck {...props} />
        <i className="fas fa-folder"></i>
        <span>{props.shortPath}</span>
      </td>
      <td>
        <span>{props.readAbleLength}</span>
      </td>
      <td>
        <span>{props.modifyTime}</span>
      </td>
    </tr>
  );
}

export default FileTableDirItem;
