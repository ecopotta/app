import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../../../../Context'
import { Button, Card, Empty, Typography } from 'antd'
import "./promotionsDetails.css"
import Navbar from '../Navbar/Navbar'
function PromotionDetails() {
    const { promotions } = useAppContext()
    const { id } = useParams()
    const promo = promotions.find((prom) => prom.id_promotion === id)
    console.log(promo)
    return (
        <>
            {promo && promo?.id_promotion ? (
                <>
                <Navbar/>
                <Card bordered={false} style={{minHeight: "100vh", minWidth: "100vw"}}>
                <div className="promotion__details">
                    <picture className="promotion__img">
                        <img src={promo.imageurl} alt="promotion__image" />
                    </picture>
                    <div className="promotion__body">
                        <h2 className="promotion__title">{promo.name}</h2>
                        <p className="promotion__description" dangerouslySetInnerHTML={{__html: promo.description}}/>
                    </div>
                </div>
                </Card>
                </>
            ) : (
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                        height: 120,
                    }}
                    description={
                        <Typography.Text>
                            <strong>Promoción no encontrada.</strong>
                            <Button type='primary' onClick={() => window.history.back()}>Volver</Button>
                        </Typography.Text>
                    }
                />
            )}
        </>
    )
}

export default PromotionDetails