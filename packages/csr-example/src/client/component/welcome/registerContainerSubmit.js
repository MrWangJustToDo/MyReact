import React from "react";

// 提交注册请求

export default React.forwardRef((props, ref) => {
  function Submit(props) {
    return (
      <div className="register-submit">
        <button
          className="register-submit-btn flex-center"
          disabled
          ref={props.forwardRef}
        >
          注册
        </button>
      </div>
    );
  }
  return <Submit forwardRef={ref} />;
});
