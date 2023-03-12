import { ref, createReactive } from "@my-react/react-reactive";
import { useCallback, useState } from "react";

const ReactiveLoginContainerPassword = createReactive({
  setup() {
    const passwordCheckRef = ref(false);
    const valueRef = ref("");
    const passwordHandler = () => {
      passwordCheckRef.value = !passwordCheckRef.value;
    };
    const onChange = (e) => {
      valueRef.value = e.target.value;
    };

    return { passwordCheckRef, passwordHandler, valueRef, onChange };
  },
  render({ passwordCheckRef, passwordHandler, valueRef, onChange }) {
    return (
      <label className="block relative">
        <i className={"fas login-input-icon password-check absolute " + (passwordCheckRef ? "fa-eye" : "fa-eye-slash")} onClick={passwordHandler}></i>
        <input type={passwordCheckRef ? "text" : "password"} placeholder="请输入密码" name="password" value={valueRef} onChange={onChange} />
      </label>
    );
  },
});

function LoginContainerPassword() {
  const [passwordCheck, setPasswordCheck] = useState(false);

  let passwordHandler = useCallback(() => {
    setPasswordCheck(!passwordCheck);
  }, [passwordCheck]);

  return (
    <label className="block relative">
      <i className={"fas login-input-icon password-check absolute " + (passwordCheck ? "fa-eye" : "fa-eye-slash")} onClick={passwordHandler}></i>
      <input type={passwordCheck ? "text" : "password"} placeholder="请输入密码" name="password" />
    </label>
  );
}

export default ReactiveLoginContainerPassword;
