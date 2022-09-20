import { useCallback, useState } from "react";

function LoginContainerPassword() {
  const [passwordCheck, setPasswordCheck] = useState(true);

  let passwordHandler = useCallback(() => {
    setPasswordCheck(!passwordCheck);
  }, [passwordCheck]);

  return (
    <label className="block relative">
      <i
        className={
          "fas register-input-icon password-check absolute " +
          (passwordCheck ? "fa-eye" : "fa-eye-slash")
        }
        onClick={passwordHandler}
      ></i>
      <input
        type={passwordCheck ? "text" : "password"}
        placeholder="请输入密码"
        name="password"
      />
    </label>
  );
}

export default LoginContainerPassword;
