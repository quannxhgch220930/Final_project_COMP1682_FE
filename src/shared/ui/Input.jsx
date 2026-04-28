import { Input as AntInput } from 'antd'

function Input({ className = '', type = 'text', ...props }) {
  if (type === 'password') {
    return <AntInput.Password className={className} size="large" {...props} />
  }

  return <AntInput className={className} size="large" type={type} {...props} />
}

export default Input
