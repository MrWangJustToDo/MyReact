import React from "react";

export default React.forwardRef((props, ref) => {
  function Checkcode(props) {
    return (
      <label
        className="block relative form-checkcode overflow"
        ref={props.forwardRef}
      >
        <div className="form-checkcode-box flex height-inherit">
          <img
            src=""
            className="checkcode-img block"
            height="100%"
            alt="验证码图片"
          />
          <input
            type="text"
            className="login-input-checkcode"
            placeholder="请输入验证码"
            name="checkcode"
          />
        </div>
      </label>
    );
  }

  return <Checkcode forwardRef={ref} />;
});
