import FileContainerHeadUploadFile from "./fileContainerHeadUploadFile";
import FileContainerHeadAddFile from "./fileContainerHeadAddFile";
import FileContainerHeadAddDir from "./fileContainerHeadAddDir";
import FileContainerHeadDownloadFile from "./fileContainerHeadDownloadFile";

function FileContainerHeadLeftBtn() {
  return (
    <div className="fm-table-header-leftBtns son-input-allHidden">
      <FileContainerHeadUploadFile />
      <FileContainerHeadAddFile />
      <FileContainerHeadAddDir />
      <FileContainerHeadDownloadFile />
    </div>
  );
}

export default FileContainerHeadLeftBtn;
