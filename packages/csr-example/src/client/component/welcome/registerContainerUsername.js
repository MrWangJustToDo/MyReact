function RegisterContainerUsername() {
  return (
    <label className="block relative">
      <i className="fas fa-user register-input-icon absolute"></i>
      <input type="text" placeholder="请输入用户名" name="username" autoFocus />
    </label>
  );
}

export default RegisterContainerUsername;
