import { Button, Form, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../Context'

function EditCategoryModal({closeModal, category}) {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { updateCategory } = useAppContext()
    const onFinish = async(values) => {
        const dataToSend = {
            newValue: values.categoryName,
            id: category.id_category
        }
        setLoading(true)
        await updateCategory(dataToSend)
        setLoading(false)
        form.resetFields()
        closeModal()
    }

    useEffect(()=>{
        if (category) {
            form.setFieldsValue({
                categoryName: category.name
            })
        }
    },[category])
  return (
    <>
        <Modal
        open={true}
        title="Editar Categoría"
        footer={null}
        onCancel={closeModal}
        >
            <Form
            name='editCategory'
            layout='vertical'
            form={form}
            onFinish={onFinish}
            >
                <Form.Item
                name='categoryName'
                label='Categoría'
                >
                    <Input
                        value={category.name}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>Guardar</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
  )
}

export default EditCategoryModal