import { Button, Collapse, Divider, Input, Modal, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../Context';
import { Form } from 'antd';

import ReactQuill from 'react-quill';
function EditProductModal({ closeModal, product }) {
    const { editProduct, categories } = useAppContext();
    const [fileList, setFileList] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([])
    const [formProduct] = Form.useForm();
    const [description, setDescription] = useState('');

    const onFinishProduct = async (values) => {
        const productID = product.id_product;
        const { productImages, ...valuesToSend } = values;

        await editProduct(productID, valuesToSend, fileList, imagesToDelete);
        formProduct.resetFields();
        setFileList([]);
        setImagesToDelete([]);
        closeModal();


    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };


    useEffect(() => {
        if (product) {
            formProduct.setFieldsValue({
                productName: product.name,
                productPrice: product.price,
                productCategory: product.id_product_category,
                productDescription: product.description,
            })
            const images = product.images.map((image) => ({
                uid: image.id_image,
                name: `image-${image.id_image}.jpg`,
                status: "done",
                url: image.image_url
            }))

            setFileList(images);
            formProduct.setFieldsValue({
                productImages: images,
            });
        }

    }, [product])


    const handleRemoveImages = (value) => {
       
        setFileList(fileList.filter((image) => image.url !== value.url));
        setImagesToDelete([...imagesToDelete, value.url].filter(img => img !== undefined));
    };



    return (
        <Modal
            open={true}
            title="Editar Producto"
            footer={null}
            onCancel={closeModal}
            width={1000}
        >
            <Form
                name='productForm'
                form={formProduct}
                onFinish={onFinishProduct}
                layout='vertical'
            >
                {/* Nombre del producto */}
                <Form.Item
                    name={"productName"}
                    label="Nombre del producto"
                    rules={[{ required: true, message: "Por favor, introduce el nombre del producto" }]}
                >
                    <Input />
                </Form.Item>

                {/* Precio del producto */}
                <Form.Item
                    name={"productPrice"}
                    label="Precio del producto"
                    rules={[
                        { required: true, message: "" },
                        {
                            validator: (_, value) => {
                                if (value < 0 || isNaN(parseFloat(value))) {
                                    return Promise.reject("El precio introducido no es válido");
                                } else if (!value) {
                                    return Promise.reject("Por favor, introduce un precio");
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* Categoria */}
                <Form.Item
                    name={"productCategory"}
                    label="Categoria"
                    rules={[{ required: true, message: "Por favor, introduce la categoría" }]}
                >
                    <Select id='productCategory'>
                        {categories && categories.map((category) => (
                            <Select.Option key={category.id_category} value={category.id_category}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Descripción del producto */}
                
                <Form.Item
                    name={"productDescription"}
                    label="Descripción del producto"
                    rules={[{ required: true, message: "Por favor, introduce la descripción del producto" }]}
                >
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                ['bold', 'italic', 'underline'],

                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['clean']
                            ],
                        }}
                        style={{ height: '200px' }} // Puedes ajustar la altura aquí
                    />
                </Form.Item>
                    <div style={{marginTop:"3rem"}}></div>
                {/* Imágenes */}
                <Form.Item
                    name={"productImages"}
                    label="Imágenes"
                    rules={[
                        { required: true, message: "" },
                        {
                            validator: () => {
                                if (fileList.length < 1 || fileList.length > 4) {
                                    return Promise.reject("Por favor, introduce entre 1 y 4 imágenes");
                                } else {
                                    return Promise.resolve();
                                }
                            }
                        }

                    ]}
                >
                    <Upload
                        multiple
                        listType='picture'
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        showUploadList={true}
                        fileList={fileList}
                        onRemove={(value) => handleRemoveImages(value)}
                    >
                        {fileList.length < 4 && <Button>Subir Imagen</Button>}

                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Guardar producto
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditProductModal;
