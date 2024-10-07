import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../../Context';
import { useParams } from 'react-router-dom';
import './productDetails.css';
import { Card, Button, Select, InputNumber } from 'antd'; // Importar componentes de Ant Design
import Navbar from '../Navbar/Navbar';

const { Option } = Select;

function ProductDetails() {
    const { fetchingData, productsByImages } = useAppContext();
    const { id } = useParams();
    const product = productsByImages.find(prod => prod.id_product === id);
    
    const [mainImage, setMainImage] = useState();

    useEffect(()=>{
        setMainImage(product ? product?.images[0]?.image_url : '')
    },[product])

    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    const handleAddToCart = () => {
        // Aquí puedes agregar la lógica para agregar al carrito
        console.log('Producto agregado al carrito');
    };

    return (
        <>
            {fetchingData ? (
                <div className='loader__wrapper'>
                    Aguarde...
                    <span className="loader"></span>
                </div>
            ) : product ? (
                <>
                    <Navbar />
                    <Card bordered={false} style={{ minWidth: "100%", minHeight: "100vh" }}>
                        <div className="product__details">
                            <div className="product__images">
                                <div className="product__main-image-container">
                                    <picture className='product__main-image'>
                                        <img src={mainImage} alt="Product" />
                                    </picture>
                                </div>
                                <div className="product__thumbnails">
                                    {product.images.map((image) => (
                                        <picture className='product__thumbnail-container' key={image.image_url}>
                                            <img
                                                src={image.image_url}
                                                alt="Product"
                                                className="product__thumbnail"
                                                onClick={() => handleThumbnailClick(image.image_url)}
                                            />
                                        </picture>
                                    ))}
                                </div>
                            </div>
                            <div className="product__options">
                                <Card title="Descripción" style={{border: "1px solid #ccc"}}>
                                    <p><strong>Nombre del producto:</strong> {product.name}</p>
                                    <p><strong>Precio:</strong> ${product.price}</p>
                                    <p dangerouslySetInnerHTML={{ __html: product.description }}/>
                                    {/* <div style={{ margin: '10px 0' }}>
                                        <strong>Color:</strong>
                                        <Select defaultValue="Selecciona un color" style={{ width: 120, marginLeft: 10 }}>
                                            <Option value="rojo">Rojo</Option>
                                            <Option value="azul">Azul</Option>
                                            <Option value="verde">Verde</Option>
                                        </Select>
                                    </div> */}

                                    {/* <div style={{ margin: '10px 0' }}>
                                        <strong>Número de macetas:</strong>
                                        <InputNumber min={1} defaultValue={1} />
                                    </div>

                                    <Button type="primary" onClick={handleAddToCart}>
                                        Agregar al carrito
                                    </Button> */}
                                </Card>
                                {/* <div className="product__description">
                                <p dangerouslySetInnerHTML={{ __html: product.description }}/>
                                </div> */}
                            </div>
                            
                        </div>
                        
                    </Card>
                </>
            ) : (
                <p>Producto no encontrado.</p>
            )}
        </>
    );
}

export default ProductDetails;
