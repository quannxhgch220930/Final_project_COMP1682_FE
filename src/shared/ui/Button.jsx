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
              background: 'linear-gradient(135deg,#7c2d12 0%,#431407 100%)',
              borderColor: '#431407',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 12px 30px rgba(67,20,7,0.24)',
            }
          : {
              background: '#ffffff',
              borderColor: '#a8a29e',
              color: '#1c1917',
              fontWeight: 700,
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
