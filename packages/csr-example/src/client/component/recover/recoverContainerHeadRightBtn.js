
function FileContainerHeadRightBtn() {
  return (
    <div className="fm-table-header-rightTools">
      <label className="fm-table-header-search inline-flex">
        <input
          type="text"
          className="fm-table-header-search-input"
          placeholder="搜索你的文件"
        />
        <i className="fm-table-search-btn relative fas fa-search"></i>
      </label>
    </div>
  );
}

export default FileContainerHeadRightBtn;
