import React, { useState } from 'react'
import { useAppContext } from '../../Context'
import Carousel from './componentes/Carousel/Carousel'
import Navbar from './componentes/Navbar/Navbar'
import ProductsView from './componentes/VistaProductos/ProductsView'
import "./shop.css"
import Search from 'antd/es/transfer/search'
import { Empty, Select, Typography } from 'antd'
const { Option } = Select
function Shop() {
  const { categories, productsByImages, ajustes, fetchingData } = useAppContext()
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null);

  const parsedSettings = (() => {
    try {
      return ajustes.length > 0 ? JSON.parse(ajustes[0]?.settings) : {};
    } catch (error) {
      console.log("Error al formatear los ajustes:", error);
      return {};
    }
  })();

  const settings = parsedSettings || {}
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };
  const filteredProducts = productsByImages.filter((prod) => {
    const matchedSearch = prod.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory ? prod.id_product_category === selectedCategory : true
    return matchedSearch && matchesCategory
  }) || []
  console.log(fetchingData)
  return (
    <>
      {fetchingData ? (
        <div className='loader__wrapper'>Aguarde...<span class="loader"></span></div>
      ) : (
        <div className="container__wrapper">
          {settings.page_enabled ? (
            <>
              <Navbar />
              <Carousel />
              <div className="products__filters">
                <div className="search__container">
                  <Search placeholder="Buscar..." style={{ minWidth: "100%" }}
                    onChange={(e) => handleSearch(e.target.value)}

                  />
                </div>
                <div className="categories__container">
                  <Select style={{ minWidth: "100%" }} onChange={handleCategoryChange} allowClear >
                    {categories?.length > 0 && categories.map((cat) => (
                      <Option value={cat.id_category} key={cat.id_category}>{cat.name}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="products__container">
                <ProductsView products={filteredProducts} />
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
                    <strong>Por el momento, Esta página esta inhabilitada, por favor vuelve mas tarde!.</strong>
                  </Typography.Text>
                }
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Shop