import { Button as AntButton } from 'antd'

function Button({ children, className = '', type = 'button', variant = 'primary', ...props }) {
  const isPrimary = variant === 'primary'

  return (
    <AntButton
      htmlType={type}
      type={isPrimary ? 'primary' : 'default'}
      size="large"
      className={className}
      style={
        isPrimary
          ? {
              background: 'linear-gradient(135deg,#99582a 0%,#7f4a22 100%)',
              borderColor: '#99582a',
              boxShadow: '0 12px 30px rgba(111,69,24,0.22)',
            }
          : {
              background: 'rgba(245,245,244,0.92)',
              borderColor: 'rgba(214,211,209,0.9)',
              color: '#292524',
              boxShadow: '0 8px 24px rgba(63,39,18,0.08)',
            }
      }
      {...props}
    >
      {children}
    </AntButton>
  )
}

export default Button
