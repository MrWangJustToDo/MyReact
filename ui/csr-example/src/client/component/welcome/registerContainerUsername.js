import { ref, createReactive } from "@my-react/react-reactive";

// function RegisterContainerUsername() {
//   return (
//     <label className="block relative">
//       <i className="fas fa-user register-input-icon absolute"></i>
//       <input type="text" placeholder="请输入用户名" name="username" autoFocus />
//     </label>
//   );
// }

// this reactive component only work for @my-react
const RegisterContainerUsername = createReactive({
  setup: () => {
    const valueRef = ref("");
    const changeRef = (e) => {
      valueRef.value = e.target.value;
    };

    return { changeRef, valueRef };
  },
  render: ({ valueRef, changeRef }) => (
    <label className="block relative">
      <i className="fas fa-user register-input-icon absolute"></i>
      <input type="text" placeholder="请输入用户名" name="username" data-val={valueRef} autoFocus value={valueRef} onChange={changeRef} />
    </label>
  ),
});

export default RegisterContainerUsername;
