import { Modal as AntModal, Typography } from 'antd'

const { Paragraph } = Typography

function Modal({ title, description, open, onCancel, footer = null }) {
  return (
    <AntModal open={open} title={title} footer={footer} onCancel={onCancel}>
      {description ? <Paragraph>{description}</Paragraph> : null}
    </AntModal>
  )
}

export default Modal
