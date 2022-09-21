import { useSelector } from "react-redux";
import FileRecoverBody from "./fileRecoverBody";

function FileRecover() {
  let { isLoaded } = useSelector((state) => state);
  return (
    <div className="fm-table relative animate__animated animate__fadeIn animate__faster">
      <table className="fm-table-show relative">
        <thead>
          <tr>
            <th>文件名</th>
            <th>大小</th>
            <th>修改日期</th>
          </tr>
        </thead>
        {isLoaded && <FileRecoverBody />}
      </table>
    </div>
  );
}

export default FileRecover;
