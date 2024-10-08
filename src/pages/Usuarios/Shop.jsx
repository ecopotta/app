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
  const { categories, productsByImages, fetchingData } = useAppContext()
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null);


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
  return (
    <>
      {fetchingData ? (
        <div className='loader__wrapper'>Aguarde...<span class="loader"></span></div>
      ) : (
        <div className="container__wrapper">
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
        </div>
      )}
    </>
  )
}

export default Shop