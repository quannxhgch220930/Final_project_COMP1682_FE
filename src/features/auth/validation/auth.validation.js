export function validateLogin(values) {
  const errors = {}

  if (!values.email) {
    errors.email = 'Email không được để trống'
  }

  if (!values.password) {
    errors.password = 'Mật khẩu không được để trống'
  }

  return errors
}

export function validateRegister(values) {
  const errors = {}

  if (!values.fullName) {
    errors.fullName = 'Họ tên không được để trống'
  }

  if (!values.email) {
    errors.email = 'Email không được để trống'
  }

  if (!values.password) {
    errors.password = 'Mật khẩu không được để trống'
  } else if (values.password.length < 8) {
    errors.password = 'Mật khẩu phải từ 8 ký tự trở lên'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không được để trống'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }

  return errors
}
