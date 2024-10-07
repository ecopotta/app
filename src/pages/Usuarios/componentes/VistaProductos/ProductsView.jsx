import React from 'react'
import { ShoppingCartOutlined } from "@ant-design/icons"
import "./productsView.css"
import { Empty, Typography } from 'antd'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
function ProductsView({ products }) {

    return (
        <>
            {products && products.length > 0 ? (products.map((prod, index) => (
                <div className="card">

                    <div className="card__title">
                        <h2>{prod.name}</h2>
                    </div>
                    <div className="card__body">
                        <picture className="card__image">
                            <img src={prod.images[0].image_url} alt="" />
                        </picture>
                        <div className="card__footer">
                            <Link to={`/shop/product/${prod.id_product}`}>
                            <button className='card__btn'>Ver más detalles </button>
                        </Link>
                        </div>
                    </div>

                </div>
            ))) : (
                <>
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                            height: 120,
                        }}
                        description={
                            <Typography.Text>
                                <strong>No se encontraron resultados</strong>
                            </Typography.Text>
                        }
                    />
                </>
            )}
        </>
    )
}

export default ProductsView