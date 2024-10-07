import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../Barra de navegacion/AdminNavbar'
import { Card, Col, Row,Form, Input, Upload, Button, Divider, Table, Popconfirm, Space } from 'antd'
import { DeleteOutlined, EditOutlined, QuestionCircleFilled } from '@ant-design/icons'
import { useAppContext } from '../../../Context';
import "./bannersManager.css"
function BannersManager() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([])
    const [savingBanner, setSavingBanner] = useState(false)
    const { uploadBanner, banners,updateBanner,deleteBanner } = useAppContext()
    const [removedImg, setRemovedImg] = useState([])
    const [bannerId, setBannerId] = useState(null)
    const onFinish = async (values) => {
        setSavingBanner(true);
        isEditing ? await updateBanner(values.bannerName, fileList, removedImg,bannerId) : await uploadBanner(values.bannerName, fileList);
        setSavingBanner(false)
        form.resetFields();
        setFileList([]);
        setIsEditing(false)
        setRemovedImg([])
        setBannerId(null)
    }
    
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // useEffect(()=>{
    //     console.log("Imagen a enviar: " , fileList)
    //     console.log("A eliminar: ", removedImg)
    // },[fileList, removedImg])

    const [isEditing, setIsEditing] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState({});
    const handleEditBanner = (bannerID) => {
        setIsEditing(true);
        setBannerId(bannerID)
        setSelectedBanner(banners.find((ban)=> ban.id === bannerID));
    }

    const handleRemoveImg = (value) =>{
        setRemovedImg([...removedImg, value].filter((img)=> img !== undefined))
    }
    const [removingBanner, setRemovingBanner] = useState(false);
    const handleRemoveBanner = async(bannerID, bannerUrl) => {
        setRemovingBanner(true)
        await deleteBanner(bannerID, bannerUrl)
        setRemovingBanner(false)
    }


    useEffect(()=>{
        if (isEditing) {
            form.setFieldsValue({
                bannerName: selectedBanner?.nombre_banner
            })

            setFileList([{
                uid: '1',
                name: selectedBanner?.nombre_banner,
                status: 'done',
                url: selectedBanner?.image_urls
            }])
        }else{
            form.resetFields();
            setFileList([]);
            setRemovedImg([]);
        }
    },[isEditing])

    const tableColumns = [
        {
            key: "1",
            title: "Nombre",
            dataIndex: "nombre_banner"
        },
        {
            key: "2",
            title: "Imagen",
            dataIndex: "imagen_banner",
            render: (_, record)=> (
                <>
                    <picture className='banner__image'><img src={record.image_urls} alt="Banner" style={{width: "100%"}}/></picture>
                </>
            )
        },
        {
            key: "3",
            title: "Acciones",
            render: (_, record) => (
                <Space>

<Button
                    type="primary"
                    onClick={() => handleEditBanner(record.id)}
                >
                    <EditOutlined/>
                </Button>
                <Popconfirm
                    title="¿Deseas eliminar este banner?"
                    onConfirm={() => handleRemoveBanner(record.id, record.image_urls)}
                    okText="Si"
                    cancelText="No"
                    okButtonProps={{loading: removingBanner}}
                >
                    <Button type="primary" danger>
                        <DeleteOutlined/>
                    </Button>
                </Popconfirm>
                </Space>
            )
        }
    ]

  return (
    <>
        <AdminNavbar/>
        <div className="container__wrapper">
            <h1 className='title'>Banners</h1>
            <Row gutter={[16, 16]} style={{margin: "1rem"}}>
                <Col sx={24} sm={24} md={12}>
                    <Card title={isEditing ? <Button type='primary' danger onClick={() => setIsEditing(false)}>Cancelar editado</Button> : "Añadir un banner"}>
                    <p><QuestionCircleFilled/> El nombre es simplemente un identificador para usted</p>
                        <Form
                        name='bannerForm'
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                        >
                            <Form.Item
                            name="bannerName"
                            label="Nombre del banner"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor ingrese el nombre del banner',
                                },
                            ]}
                            >
                                <Input /> 
                            </Form.Item>
                        <Form.Item
                        name={"bannerImage"}
                        label="Imagen del banner"
                        rules={[
                            {
                                required: true,
                                validator: () => {
                                    if (fileList.length > 0) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Por favor seleccione una imagen'));
                                }
                            },
                        ]}
                        >
                            <Upload
                            listType='picture'
                            onChange={handleUploadChange}
                            maxCount={1}
                            onRemove={(image) => handleRemoveImg(image.url)}
                            fileList={fileList}
                            beforeUpload={() => false}
                            >
                            <Button type="primary">Subir imagen</Button>
                            </Upload>
                            
                        </Form.Item>
                        <Divider/>
                        <Button type="primary" htmlType="submit" loading={savingBanner}>{savingBanner ? "Guardando..." : "Guardar"}</Button>
                        </Form>
                    </Card>
                </Col>
                <Col sx={24} sm={24} md={12}>
                    <Card title="Listar banners">
                        <Table
                        dataSource={banners}
                        columns={tableColumns}
                        pagination={{pageSize: 5}}

                        />
                    </Card>
                </Col>
            </Row>
        </div>
    </>
  )
}

export default BannersManager