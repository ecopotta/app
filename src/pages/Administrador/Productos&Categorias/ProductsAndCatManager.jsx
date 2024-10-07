import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../Barra de navegacion/AdminNavbar';
import "./productsAndCat.css";
import { Button, Card, Col, Form, Input, Popconfirm, Row, Select, Space, Switch, Table, Upload } from "antd";
import { useAppContext } from '../../../Context';
import EditCategoryModal from '../EditarCategorias/EditCategoryModal';
import EditProductModal from '../EditarProductos/EditProductModal';
import {DeleteOutlined} from "@ant-design/icons"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de Quill
function ProductsAndCatManager() {
    const [formProduct] = Form.useForm();
    const [formCategory] = Form.useForm();
    const [enabledOptions, setEnabledOptions] = useState([]);
    const [optionsValues, setOptionsValues] = useState([]);
    const { saveProduct, uploadCategory,categories,productsByImages,deleteCategory, changeProductState,deleteProduct } = useAppContext();
    const [fileList, setFileList] = useState([]);
    const [description, setDescription] = useState('');
    const onFinishProduct = async(values) => {
        const { productImages, ...valuesToSend } = values;
        await saveProduct({ ...valuesToSend, productDescription: description }, fileList);
        formProduct.resetFields();
        setFileList([]);
        setDescription(''); // Resetear la descripción
    }
    const [savingCat, setSavingCat] = useState(false)
    const onFinishCategory =async (values) => {
        setSavingCat(true)
        await uploadCategory(values.categoryName);
        setSavingCat(false)
        formCategory.resetFields()
    }

    const handleImageChange = async ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const [changingState, setChangingState] = useState(false);
    const handleSwitchProductState = async(value, productID) => {
        setChangingState(true)
        await changeProductState(value,productID)
        setChangingState(false)
    }   
    const [deletingProduct, setDeletingProduct] = useState(false)
    const handleDeleteProduct = async(productID) =>{
        setDeletingProduct(true)
        const imageUrls = productsByImages.find((prod)=> prod.id_product === productID).images
        await deleteProduct(productID,imageUrls)
        setDeletingProduct(false)
    }


    const productsTableColumns = [
        {
            key: "1",
            title: "Producto",
            render: (_, record) => (
                <>
                    <strong>{record.name}</strong>
                </>
            )
        },
        {
            key: "2",
            title: "Disponible",
            render: (_, record) => (
                <>
                    <Space>
                        <strong>{record.is_available ? "Si" : "No"}</strong>
                        <Switch value={record.is_available} loading={changingState[record.id_product]} onChange={(val)=> handleSwitchProductState(val, record.id_product)}/>
                    </Space>
                </>
            )
        },
        {
            key: "3",
            title: "Categoría",
            render: (_, record) => (
                <>
                    <strong>{categories.find((cat)=> cat.id_category === record.id_product_category)?.name?.toUpperCase()}</strong>
                </>
            )
        },
        {
            key: "3",
            title: "Descripción e imágenes",
            render: (_, record) => (
                <>
                    <Space>
                        <Button onClick={()=>handleEditProduct(record.id_product)}>Revisar</Button>
                        <Popconfirm
                        onConfirm={() => handleDeleteProduct(record.id_product)}
                        okText="Si"
                        cancelText="No"
                        title="¿Seguro que quieres eliminar este producto?"
                        okButtonProps={{ loading: deletingProduct }}
                        >
                            <Button type='primary' danger ><DeleteOutlined/></Button>
                        </Popconfirm>
                    </Space>
                </>
            )
        },
    ]

    const categoriesTableColumns = [
        {
            key: "1",
            title: "Categoría",
            render: (_, record) => (
                <>
                    <strong>{record.name}</strong>
                </>
            )
        },
        {
            key:"2",
            title: "Acciónes",
            render: (_, record) => (
                <>
                    <Space>
                        <Popconfirm
                        title="¿Seguro que quieres eliminar esta categoría?"
                        onConfirm={() => deleteCategory(record.id_category)}
                        okText="Si"
                        cancelText="No"

                        >
                            <Button type='primary' danger>Eliminar</Button> 
                        </Popconfirm>
                        <Button type='primary' onClick={()=>handleEditCategory(record.id_category)}>Editar</Button>
                    </Space>
                </>
            )
        }
    ]

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false)
    const handleEditCategory = (categoryID) =>{
        setSelectedCategory(categories.find((cat)=> cat.id_category === categoryID))
        setOpenEditCategoryModal(true)
    }
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [openEditProductModal, setEditProductModal] = useState(false)
    const handleEditProduct = (productID) =>{
        setSelectedProduct(productsByImages.find((p)=> p.id_product === productID))
        setEditProductModal(true)
    }

    const orderedProducts = productsByImages.sort((a,b)=> a.id_product - b.id_product)


    return (
        <>
            <AdminNavbar />
            <div className="container__wrapper">
                <h1 className='title'>Productos y Categorías</h1>
                <div className="productsAndCat__wrapper">
                    <div className="productsAndCat__forms">
                        <Row gutter={[16, 16]}>
                            <Col sx={24} sm={24} md={16} lg={14}>
                                <Card title="Añadir un producto">
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
                                                { required: true, message: ""},
                                                {validator: (_,value)=> {
                                                    if (value < 0 || isNaN(parseFloat(value))) {
                                                        return Promise.reject("El precio introducido no es válido")
                                                    }else if(!value){
                                                        return Promise.reject("Por favor, introduce un precio")
                                                    }
                                                    return Promise.resolve();
                                                }}
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        {/* Categoria */}
                                        <Form.Item
                                            name={"productCategory"}
                                            label="Categoria"
                                            rules={[{ required: true, message: "Por favor, introduce la categoria" }]}
                                        >
                                            <Select
                                            id='productCategory'
                                            >
                                            {categories && categories.map((category) => (
                                                <Select.Option key={category.id_category} value={category.id_category}>{category.name}</Select.Option>
                                            ))}
                                            </Select>
                                        </Form.Item>
                                        {/* <Space>
                                            <p>Habilitar Opciones de compra</p>
                                        <Switch checked={enabledOptions} onChange={() => setEnabledOptions(!enabledOptions)}/>
                                        </Space>
                                        {enabledOptions ? (
                                            <>
                                                <Form.Item
                                                name={"productOptions"}
                                                >
                                                    
                                                </Form.Item>
                                            </>
                                        ) : null} */}
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
                                                <div style={{marginTop: "3rem"}}></div>
                                        {/* Imágenes */}

                                        <Form.Item
                                            name={"productImages"}
                                            label="Imágenes"
                                            
                                            rules={[{ required: true, message: "Por favor, introduce las imágenes del producto" }]}
                                        >
                                            <Upload
                                                multiple
                                                listType='picture'
                                                onChange={handleImageChange}
                                                beforeUpload={() => false}
                                                showUploadList={true}
                                                fileList={fileList}
                                            >
                                                {fileList.length > 4 ? null : (
                                                    <Button>Subir Imagen</Button>
                                                )}
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
                                </Card>
                            </Col>

                            <Col sx={24} sm={24} md={8} lg={10}>
                                <Card title="Añadir una Categoría">
                                    <Form
                                        name='categoryForm'
                                        form={formCategory}
                                        onFinish={onFinishCategory}
                                        layout='vertical'
                                    >
                                        {/* Nombre de la Categoría */}
                                        <Form.Item
                                            name={"categoryName"}
                                            label="Nombre de la Categoría"
                                            rules={[{ required: true, message: "Por favor, introduce el nombre de la categoría" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={savingCat}
                                            >
                                                Guardar Categoría
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{marginTop: "1rem"}}>
                        <Col sx={24} sm={24} md={24} lg={12} style={{width: "100%"}}>
                            <Card title="Categorías" className='categories__card'>
                                <Table
                                style={{width:"100%"}}
                                columns={categoriesTableColumns}
                                dataSource={categories}
                                scroll={{x: 500}}
                                pagination= {{pageSize: 5}}
                                />
                            </Card>
                        </Col>
                        <Col sx={24} sm={24} md={24} lg={12} style={{width: "100%"}}>
                            <Card title="Productos" className='products__card'>
                                <Table
                                dataSource={orderedProducts}
                                columns={productsTableColumns}
                                scroll={{x:  500}}
                                pagination= {{pageSize: 5}}
                                style={{width: "100%"}}
                                />
                            </Card>
                        </Col>
                    </Row>
                    </div>
                    
                </div>
            </div>
            {openEditCategoryModal && <EditCategoryModal closeModal={()=> setOpenEditCategoryModal(false)} category={selectedCategory}/>}
            {openEditProductModal && <EditProductModal closeModal={()=> setEditProductModal(false)} product={selectedProduct}/>}
        </>
    );
}

export default ProductsAndCatManager;
