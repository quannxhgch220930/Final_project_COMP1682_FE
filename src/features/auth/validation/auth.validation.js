export function validateLogin(values) {
  const errors = {}

  if (!values.email) {
    errors.email = 'Email is required'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  }

  return errors
}

export function validateForgotPassword(values) {
  const errors = {}

  if (!values.email) {
    errors.email = 'Email is required'
  }

  return errors
}

export function validateResetPassword(values) {
  const errors = {}

  if (!values.newPassword) {
    errors.newPassword = 'New password is required'
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required'
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Confirm password does not match'
  }

  return errors
}

export function validateRegister(values) {
  const errors = {}

  if (!values.fullName) {
    errors.fullName = 'Full name is required'
  }

  if (!values.email) {
    errors.email = 'Email is required'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Password confirmation is required'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Password confirmation does not match'
  }

  return errors
}
