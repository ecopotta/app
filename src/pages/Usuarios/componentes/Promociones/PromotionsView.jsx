import React from 'react'
import Navbar from '../Navbar/Navbar'
import { useAppContext } from '../../../../Context'
import { Empty, Typography } from 'antd'
import { Link } from 'react-router-dom'
function PromotionsView() {
    const { promotions } = useAppContext()
    return (
        <>
            <Navbar />


            {promotions && promotions.length > 0 ? (
                <>
                    <div className='container__wrapper'>
                        <h2 className='title'>Promociones</h2>
                        <div className="products__container">
                            {promotions.map((prom, index) => (
                                <div className="card">

                                    <div className="card__title">
                                        <h2>{prom.name}</h2>
                                    </div>
                                    <div className="card__body">
                                        <picture className="card__image">
                                            <img src={prom.imageurl} alt="" />
                                        </picture>
                                        <div className="card__footer">
                                            <Link to={`/shop/promotions/details/${prom.id_promotion}`}>
                                                <button className='card__btn'>Ver más detalles </button>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty__container">
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                            height: 120,
                        }}
                        description={
                            <Typography.Text>
                                <strong>Por el momento, No hay nada que visualizar aqui, por favor, vuelve más tarde!.</strong>
                            </Typography.Text>
                        }
                    />
                </div>
            )}


        </>
    )
}

export default PromotionsView