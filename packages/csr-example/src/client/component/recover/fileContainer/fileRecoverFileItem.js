import FileRecoverItemCheck from "./fileRecoverItemCheck";

function FileTableFileItem(props) {
  return (
    <tr className="fm-table-file">
      <td className="son-inline-block-center relative">
        <FileRecoverItemCheck {...props} />
        <i className="fas fa-file"></i>
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

export default FileTableFileItem;
