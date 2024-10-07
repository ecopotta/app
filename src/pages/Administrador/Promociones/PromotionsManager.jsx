import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../Barra de navegacion/AdminNavbar'
import { Button, Card, Col, Collapse, DatePicker, Divider, Form, Input, InputNumber, Popconfirm, Row, Space, Switch, Table, Upload } from 'antd'
import "./promotions.css"
import { ConfigProvider } from "antd"
import es_ES from "antd/locale/es_ES"
import dayjs from 'dayjs'
import { useAppContext } from '../../../Context'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {Element, scroller } from 'react-scroll';
import Markdown from 'react-markdown'
import ReactQuill from 'react-quill'

function PromotionsManager() {
    const [firstForm] = Form.useForm();
    const [enableDiscount, setEnableDiscount] = useState(false);
    const [fileList, setFileList] = useState([])
    const [dates, setDates] = useState({ startDate: null, endDate: null })
    const [editingPromo, setEditingPromo] = useState(false)
    const [selectedPromo, setSelectedPromo] = useState({})
    const [removedImg, setRemovedImg] = useState([])
    const [promotionID, setPromotionID] = useState(null)
    const [description, setDescription] = useState('');
    const { savePromotion, promotions, changePromotionStatus,editPromotion, deletePromotion } = useAppContext();
    const onFinishFirstForm = async (values) => {
        console.log("Imagen a eliminar: ", removedImg)
        const { promotionImage, promotionDiscount, ...valuesToSend } = values
        console.log(valuesToSend)
        editingPromo ? await editPromotion(
            valuesToSend,
            dayjs(dates.startDate),
            dayjs(dates.endDate),
            enableDiscount ? values.promotionDiscount : 0,
            fileList,
            removedImg,
            promotionID
        ) : await savePromotion(valuesToSend,
            dayjs(dates.startDate),
            dayjs(dates.endDate),
            enableDiscount ? values.promotionDiscount : 0,
            fileList,
            
        )
        firstForm.resetFields();
        setFileList([])
        setDates({ startDate: null, endDate: null })
        setEnableDiscount(false)
        setEditingPromo(false)
        setPromotionID(null)
    }

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleDateChange = (field, value) => {
        setDates(prevDates => ({
            ...prevDates,
            [field]: value
        }))
    }
    const [changingState, setChangingState] = useState(false)
    const handleChangePromotionState = async (state, productID) => {
        console.log("Estado: ", state)
        console.log("ID: ", productID)
        setChangingState(true)
        await changePromotionStatus(state, productID)
        setChangingState(false)
        
    }
    const [deletingPromo, setDeletingPromo] = useState(false)
    const handleDeletePromotion = async(promotionID) => {
        console.log(promotionID)
        setDeletingPromo(true)
        await deletePromotion(promotionID)
        setDeletingPromo(false)
    }

    // useEffect(() => {
    //     console.log(promotions)
    // }, [promotions])

    // useEffect(()=>{
    //     console.log("Se removió la imagen: ", removedImg)
    // },[removedImg])
    
    const handleEdit = (promotionID) => {
        setSelectedPromo(promotions.find((promo) => promo.id_promotion === promotionID))
        setEditingPromo(true)
        setPromotionID(promotionID)
        scroller.scrollTo('firstForm', {
            duration: 500,
            delay: 100,
            smooth: true,
            offset: -50 // Ajusta este valor según sea necesario
        });
    }

    const handleRemoveImg = (value) => {        
        setRemovedImg([...removedImg, value.url].filter((img)=> img !== undefined))
        setFileList([])
    }

    const shortenString = (str, limit = 100) => {
        if (str.length > limit) {
            return <Markdown>{str.slice(0,limit) + "..."}</Markdown>
        }else{
            return str
        }
    }

    useEffect(() => {
        if (editingPromo && selectedPromo) {

            firstForm.setFieldsValue({
                promotionName: selectedPromo.name,
                promotionDiscount: selectedPromo.discount,
                promotionDescription: selectedPromo.description,
                promotionPrice: selectedPromo.price,
            })
            setDates({
                startDate: dayjs(selectedPromo.startDate),
                endDate: dayjs(selectedPromo.endDate)
            })
            setEnableDiscount(selectedPromo.discount > 0)
            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: selectedPromo.imageurl
                }
            ])
        } else {
            firstForm.setFieldsValue({
                promotionName: "",
                promotionDiscount: 0,
                promotionDescription: "",
                promotionPrice: 0
            })
            setDates({
                startDate: null,
                endDate: null
            })
            setEnableDiscount(false)
            setRemovedImg([])
            setFileList([])
            setSelectedPromo([])
            setEditingPromo(false)
            setPromotionID(null)
        }
    }, [editingPromo])


    const orderedPromotions = promotions.sort((a, b) => a.id_promotion - b.id_promotion)
    const tablePromotions = [
        {
            key: "1",
            title: "Nombre",
            dataIndex: "name",
        },
        {
            key: "2",
            title: "Fecha de inicio",
            render: (_, record) => <>{dayjs(record.start_date).format('DD/MM/YYYY')}</>
        },
        {
            key: "3",
            title: "Fecha de fin",
            render: (_, record) => <>{dayjs(record.end_date).format('DD/MM/YYYY')}</>
        },
        {
            key: "4",
            title: "Descuento",
            render: (_, record) => <>{record.discount}%</>
        },
        {
            key: "5",
            title: "Estado",
            render: (_, record) => <Space><Switch checked={record.enabled} onChange={() => handleChangePromotionState(!record.enabled, record.id_promotion)} loading={changingState} />{record.enabled ? "Activo" : "Inactivo"}</Space>
        },
        {
            key: "6",
            title: "Acciones",
            render: (_, record) => <Space><Button type='primary' onClick={() => handleEdit(record.id_promotion)}><EditOutlined /></Button>
                <Popconfirm
                title="¿Está seguro de eliminar esta promoción?"
                onConfirm={() => handleDeletePromotion(record.id_promotion)}
                okText="Si"
                cancelText="No"
                okButtonProps={{loading: deletingPromo}}
                >
                    <Button type='primary' danger ><DeleteOutlined /></Button>
                </Popconfirm>
            </Space>
        },
        {
            key: "7",
            title: "Imagen",
            render: (_, record) => <picture className='promotion__image'><img src={record.imageurl} alt='promoimg' /></picture>
        },
        {
            key: "8",
            title: "Descripción",
            render: (_, record) => <div style={{display: "flex", flexDirection:"column",wordBreak: "break-word", maxWidth: "150px", textWrap: "break-word"}}>{shortenString(record.description)}</div>
        }
    ]

    return (
        <>
            <AdminNavbar />

            <div className='container__wrapper'>
                <h1 className='title'>Gestor de promociones</h1>
                <div className="promotions__wrapper">
                    <Row gutter={[16, 16]}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Card title={<>{editingPromo ? <Button type='primary' onClick={() => setEditingPromo(false)} danger>Cancelar</Button> : "Agregar una promoción"}</>}>
                                <Element name='firstForm' style={{ padding: '20px' }}>
                                    <Form
                                        name='firstForm'
                                        onFinish={onFinishFirstForm}
                                        layout='horizontal'
                                        form={firstForm}
                                    >
                                        <Form.Item
                                            name={"promotionName"}
                                            label="Nombre de la promoción"
                                            rules={[
                                                {
                                                    required: true, message: "La promoción debe tener un nombre"
                                                }
                                            ]}
                                        >
                                            <Input placeholder="Escriba el nombre de la promoción" />
                                        </Form.Item>

                                        <Form.Item
                                            name={"promotionPrice"}
                                            label="Precio de la promoción"
                                            
                                        >
                                            <InputNumber placeholder="Escriba el precio de la promoción" style={{ width: "100%" }} />
                                        </Form.Item>

                                        <Form.Item
                                            name={"promotionDescription"}
                                            label="Descripción de la promoción"
                                            rules={[
                                                {
                                                    required: true, message: "La promoción debe tener una descripción"
                                                }
                                            ]}
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

                                        <p>¿Aplicar algun descuento?</p>
                                        <Switch checkedChildren="Si" unCheckedChildren="No" checked={enableDiscount} onChange={() => setEnableDiscount(!enableDiscount)} />

                                        {enableDiscount &&
                                            <Form.Item
                                                name={"promotionDiscount"}
                                                label="Porcentaje de descuento"
                                                rules={[
                                                    {
                                                        required: true, message: "La promoción debe tener un descuento"
                                                    },
                                                    {
                                                        type: "number", transform: (value) => parseInt(value), message: "El descuento debe ser un número"
                                                    },
                                                    {
                                                        min: 5,
                                                        max: 100,
                                                        transform: (value) => parseInt(value),
                                                        message: "El descuento debe estar entre el 5 y el 100%"
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    min={5}
                                                    max={100}
                                                    placeholder="Escriba el porcentaje de descuento"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>}
                                        <Divider />
                                        <Form.Item
                                            name={"promotionImage"}
                                            label={"Sube una imagen"}
                                            rules={[
                                                {
                                                    validator: () => {
                                                        if (!fileList || fileList.length === 0) {
                                                            return Promise.reject(new Error("La imagen es obligatoria"))
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Upload
                                                onChange={handleUploadChange}
                                                onRemove={(value) => handleRemoveImg(value)}
                                                beforeUpload={() => false}
                                                listType="picture"
                                                accept='image/*'
                                                fileList={fileList}
                                                showUploadList={true}

                                            ><Button>Seleccionar Imagen</Button></Upload>


                                        </Form.Item>
                                        <Form.Item>
                                            <ConfigProvider locale={es_ES}>
                                                <Space direction='vertical'>
                                                    <DatePicker id='startDate' value={dates.startDate} onChange={(value) => handleDateChange("startDate", value)} placeholder="Fecha de inicio de la promoción" style={{ width: "100%" }} />
                                                    <DatePicker id='endDate' value={dates.endDate} onChange={(value) => handleDateChange("endDate", value)} placeholder="Fecha de finalización de la promoción" style={{ width: "100%" }} />
                                                </Space>
                                            </ConfigProvider>
                                        </Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Guardar Promoción
                                        </Button>
                                    </Form>
                                </Element>
                            </Card>
                        </Col>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Card title="Lista de promociones">
                                <Table
                                    dataSource={orderedPromotions}
                                    columns={tablePromotions}
                                    rowKey="promotionId"
                                    scroll={{ x: 700 }}
                                />
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        </>
    )
}

export default PromotionsManager