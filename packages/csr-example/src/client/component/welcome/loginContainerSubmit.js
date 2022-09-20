import React from "react";

// 提交登录请求

export default React.forwardRef((props, ref) => {
  function Submit(props) {
    return (
      <div className="login-submit">
        <button
          className="login-submit-btn flex-center"
          disabled
          ref={props.forwardRef}
        >
          登录
        </button>
      </div>
    );
  }
  return <Submit forwardRef={ref} />;
});
