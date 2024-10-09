import { createContext, useContext, useEffect, useRef, useState } from "react";
import Pica from "pica";
import { message } from "antd";
import { config } from "./config";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";

const Context = createContext();

export const useAppContext = () => {
    const ctx = useContext(Context);
    if (!ctx) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return ctx;
}

export const AppContextProvider = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();
    const processImages = async (imagesArray) => {
        const pica = Pica();
        if (imagesArray.length === 0 || !imagesArray) {
            return [];
        }
          const compressedFiles = await Promise.all(
            imagesArray.map(async (file) => {
              // Crear una instancia de Image para cargar el archivo y obtener sus dimensiones
              const img = new Image();
              img.src = URL.createObjectURL(file.originFileObj);
        
              return new Promise((resolve, reject) => {
                img.onload = async () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 1600;
        
                  // Mantener la relación de aspecto al redimensionar
                  const scale = MAX_WIDTH / img.width;
                  canvas.width = MAX_WIDTH;
                  canvas.height = img.height * scale;
        
                  // Redimensionar con Pica
                  const resizedCanvas = await pica.resize(img, canvas, {
                    quality: 2, // Calidad de la compresión
                  });
        
                  // Convertir el canvas comprimido en un Blob
                  const compressedBlob = await pica.toBlob(resizedCanvas, 'image/jpeg', 0.9);
        
                  // Crear un nuevo archivo a partir del Blob
                  const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
        
                  resolve(compressedFile);
                };
                img.onerror = (err) => reject(err);
              });
            })
          );
        
          return compressedFiles;
    };

    const saveProduct = async (product,fileList) => {
        const formData = new FormData()
        const hiddenMessage = message.loading("Aguarde...", 0);
        const processedImages = await processImages(fileList)
        console.log("Imagenes Procesadas: ", processedImages)
        formData.append("productName", product.productName);
        formData.append("productPrice", product.productPrice);
        formData.append("productDescription", product.productDescription);
        formData.append("productCategory", product.productCategory);
        processedImages.forEach((file) => formData.append("productImages", file));
        try {
            const response = await fetch(`${config.apibaseUrl}/upload-product`, {
                method: "POST",

                body: formData
            })
            const responseData = await response.json()

            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`, 3)
            } else {
                message.error(`${responseData.message}`, 5)
            }
        } catch (error) {
            if (error.response) {
                message.error(`${error.responseData.data.message}`, 5)
            } else {
                message.error("Error de conexión, verifique su internet.", 3)
            }
        } finally {
            hiddenMessage()
        }
    }

    const uploadCategory = async (categoryName) => {
        const hiddenMessage = message.loading("Aguarde...", 0);

        try {
            const response = await fetch(`${config.apibaseUrl}/upload-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Especificar que el contenido es JSON
                },
                body: JSON.stringify({ name: categoryName }) // Convertir el cuerpo a JSON
            });

            const responseData = await response.json();

            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`, 3);
            } else {
                message.error(`${responseData.message}`, 5);
            }
        } catch (error) {
            if (error.response) {
                message.error(`${error.response.data.message}`, 5); // Revisé cómo accedes al mensaje de error
            } else {
                message.error("Error de conexión, verifique su internet.", 3);
            }
        } finally {
            hiddenMessage();
        }
    };

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [imagesArray, setImagesArray] = useState([])
    const [promotions, setPromotions] = useState([])
    const [banners, setBanners] = useState([])  
    const [fetchingData, setFetchingData] = useState(false)

const getData = async () => {
        const hiddenMessage = message.loading("Aguarde...", 0)
        
        try {
            const response = await fetch(`${config.apibaseUrl}/get-data`);
            const data = await response.json();
            setProducts(data.products)
            setCategories(data.categories)
            setImagesArray(data.imageUrls)
            setPromotions(data.promotions)
            setBanners(data.banners)
        } catch (error) {
            if (error.response) {
                message.error(`${error.response.message}`, 5);
            } else {
                message.error("Error de conexión, verifique su internet.", 3)
            }
        } finally {
            hiddenMessage()
            
        }
    }

    const [productsByImages, setProductsByImages] = useState([])
    const groupProductsByImages = () => {
        const groupedProducts = products.map((product) => {
            const productsImages = imagesArray.filter((image) => image.id_product_image === product.id_product)
            return {
                ...product,
                images: productsImages
            }
        })

        if (groupedProducts.length > 0) {
            setProductsByImages(groupedProducts)
        } else {
            setProductsByImages([])
        }
    }

    useEffect(() => {
        if (products.length > 0 && imagesArray.length > 0) {
            groupProductsByImages()
        }else{
            setProductsByImages([])
        }
    }, [products, imagesArray])

    const alreadyFetch = useRef(false)
    useEffect(() => {
        (async () => {
            setFetchingData(true)
            if (!alreadyFetch.current && !isLoading) {
                
                const hiddenMessage = message.loading("Cargando...", 0)
                alreadyFetch.current = true
                await getData()
                hiddenMessage()
                setFetchingData(false)
            }
        })()
    }, [isLoading, isAuthenticated])

    const updateCategory = async(category) => {
        const hiddenMessage = message.loading("Aguarde...", 0)
        try {
            const response = await fetch(`${config.apibaseUrl}/update-category`,{
                headers: {
                    "Content-Type": "application/json", 
                },
                method: "PUT",
                body: JSON.stringify(category)
            })
            const responseData = await response.json()
            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`, 3)
            } else {
                message.error(`${responseData.message}`, 5)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.message}`, 5)
            }else{
                message.error("Error de conexión, verifique su internet.", 3)
            }
        }finally{
            hiddenMessage()
        }
    }

    const deleteCategory = async(id)=> {
        const hiddenMessage = message.loading("Eliminando...",0)
        try {
            const response = await fetch(`${config.apibaseUrl}/delete-category/${id}`,{
                headers:{
                    "Content-Type": "application/json",
                },
                method: "DELETE",
            })

            const responseData = await response.json()
            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`)
            }else{
                message.error(`${responseData.message}`)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.message}`)
            }else{
                message.error("Error de conexión, verifique su internet.", 3)
            }
        }finally{
            hiddenMessage()
        }
    }

    const editProduct = async(productID, newProduct, images, imagesToDelete) =>{
        const formData = new FormData()
        const newImages = images.filter(img => img.originFileObj)
        const processedImages = await processImages(newImages)
        // console.log("Imagenes nuevas procesadas: ", JSON.stringify(processedImages))
        formData.append("productID", productID)
        formData.append("newProduct", JSON.stringify(newProduct))
        processedImages.forEach(image => {
            formData.append("newImages", image)
        })
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete))
        const hiddenMessage = message.loading("Aguarde...", 0)
        try {
            const response = await fetch(`${config.apibaseUrl}/edit-product`,{
                method: "PUT",
                body: formData
            })
            const responseData = await response.json()
            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`, 3)
            } else {
                message.error(`${responseData.message}`, 5)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.message}`, 5)
            }else{
                message.error("Error de conexión, verifique su internet.", 3)
            }
        }finally{
            hiddenMessage()
        }
        
    }

    const changeProductState = async(state, productID) =>{
        const hiddenMessage = message.loading("Actualizando...",0)
       
        try {
            const response = await fetch(`${config.apibaseUrl}/change-product-state`,{
                headers:{
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({state, productID})
            })
            const responseData = await response.json()
            
            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`)
            }else{
                message.error(`${responseData.messgae}`)
            }
        } catch (error) {
            console.log(error)
            message.error("Error de conexión o del servidor")
        }finally{
            hiddenMessage()
        }
    };

    const deleteProduct = async (productID, imagesToDelete) => {
        const hiddenMessage = message.loading("Eliminando...", 0);
        
        try {
            const response = await fetch(`${config.apibaseUrl}/delete-product/${productID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imagesToDelete }),
            });
    
            const responseData = await response.json();
    
    
            if (response.ok) {
                await getData(); 
                message.success(responseData.message);
            } else {
                message.error(responseData.message || "Error al eliminar el producto");
            }
        } catch (error) {
            console.error(error); 
            message.error("Error de conexión o del servidor");
        } finally {
            hiddenMessage();
        }
    };
    
    const savePromotion = async(promotionData, startDate, endDate, discount,image ) =>{
        const formData = new FormData()
        const hiddenMessage = message.loading("Guardando...", 0)
        const processedImage = await processImages(image)
        formData.append("promotionData", JSON.stringify(promotionData))
        formData.append("startDate", startDate)
        formData.append("endDate", endDate)
        formData.append("discount", discount)
        processedImage.forEach(image => {
            formData.append("promotionImage", image)
        })

        try {
            const response = await fetch(`${config.apibaseUrl}/save-promotion`,{
                method: "POST",
                body: formData
            })
            const responseData = await response.json()
            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`, 3)
            } else {
                message.error(`${responseData.message}`, 5)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.message}`, 5)
            }else{
                message.error("Error de conexión, verifique su internet.", 3)
            }
        }finally{
            hiddenMessage()
        }
    }

    const changePromotionStatus = async(status,promotionID, ) =>{
        const hiddenMessage = message.loading("Actualizando...",0)
       
        try {
            const response = await fetch(`${config.apibaseUrl}/change-promotion-status`,{
                headers:{
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({promotionID, status})
            })
            const responseData = await response.json()
            
            if (response.status === 200) {
                await getData()
                message.success(`${responseData.message}`)
            }else{
                message.error(`${responseData.message}`)
            }
        } catch (error) {
            console.log(error)
            message.error("Error de conexión o del servidor")
        }finally{
            hiddenMessage()
        }
    }

    const editPromotion = async(promotionData, startDate, endDate, discount,image,removedImg,promotionID) => {
        const hiddenMessage = message.loading("Aguarde...",0)
        console.log(promotionData)

        const formData = new FormData()
        formData.append("promotionData", JSON.stringify(promotionData))
        formData.append("startDate", startDate)
        formData.append("endDate", endDate)
        formData.append("discount", discount)
        formData.append("removedImg", removedImg)
        if (image[0]?.originFileObj !== undefined) {
            const processedImage = await processImages(image)
            processedImage.forEach(image => {
                formData.append("image", image)
            })
        }else{
            
            formData.append("image", image[0].url)
        }
        formData.append("promotionID", promotionID)

        try {
            const response = await fetch(`${config.apibaseUrl}/edit-promotion`,{
                method: "PUT",
                body: formData
            });
            const responseData = await response.json();
            if (response.status === 200) {
                await getData();
                message.success(`${responseData.message}`, 3);
            }else{
                message.error(`${responseData.message}`, 5);
            }
        } catch (error) {
            console.log(error);
            message.error("Error de conexión, verifique su internet.", 3);
        }finally{
            hiddenMessage()
        }
    };

    const deletePromotion = async(promotionID) =>{
        const hiddenMessage = message.loading("Aguarde...",0)
        const deleteImgUrl = promotions.find((promo) => promo.id_promotion === promotionID).imageurl
        try {
            const response = await fetch(`${config.apibaseUrl}/delete-promotion/${promotionID}?deleteImgUrl=${encodeURIComponent(deleteImgUrl)}`, {
                method: "DELETE",
            });
            const responseData = await response.json();
            if (response.status === 200) {
                await getData();
                message.success("Eliminado con exito");
            } else {
                message.error(responseData.message);
            }
        } catch (error) {
            console.log(error)
            message.error("Error de conexión o del servidor")
        }finally{
            hiddenMessage()
        }
    }

    const uploadBanner = async(name, image) => {
        const hiddenMessage = message.loading("Guardando...", 0)
        const formData = new FormData();
        const processedImage = await processImages(image)
        formData.append("name", name)
        processedImage.forEach(image => {
            formData.append("bannerImage", image)
        })
        try {
            const response = await fetch(`${config.apibaseUrl}/upload-banner`, {
                method: "POST",
                body: formData
            })
            const responseData = await response.json()

            if (response.status === 200) {
                await getData()
                message.success("Guardado con exito")
            }else{
                message.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
            message.error("Error de conexión o del servidor")
        }finally{
            hiddenMessage()
        }
    }

    const updateBanner = async (bannerName, image, removedImage, bannerId) => {
        console.log("Update banner: ", bannerName, image, removedImage);
        const formData = new FormData();
    
        if (Array.isArray(image) && image[0]?.originFileObj !== undefined) {
            console.log("Hay nueva imagen")
            const processedImage = await processImages(image);
            console.log("Imagen procesada: ", processedImage)
            processedImage.forEach(image => {
                formData.append("newImage", image)
            })
            formData.append("removedImage", removedImage || ""); 
        } else if (Array.isArray(image) && image[0]?.url) {
            console.log("No hay nueva imagen")
            formData.append("image", image[0].url); 
            formData.append("removedImage", removedImage || ""); 
        } else {
            console.error("Error: No se encontró una imagen válida.");
            return;
        }
    
        formData.append("bannerName", bannerName);
        formData.append("bannerId", bannerId);
    
        try {
            const response = await fetch(`${config.apibaseUrl}/update-banner`, {
                method: "PUT",
                body: formData,
            });
    
            const responseData = await response.json();
    
            if (response.status === 200) {
                await getData(); // Llamar a getData para actualizar la vista
                message.success("Banner actualizado");
            } else {
                message.error(responseData.message);
            }
        } catch (error) {
            console.log(error);
            message.error("Error de aplicación o del servidor");
        }
    };

    const deleteBanner = async(bannerId, bannerUrl) => {
        const hiddenMessage = message.loading("Eliminando...", 0)
        try {
            const response = await fetch(`${config.apibaseUrl}/delete-banner/${bannerId}?bannerUrl=${encodeURIComponent(bannerUrl)}`, {
                method: "DELETE",
            });

            if (response.status === 200) {
                await getData();
                message.success("Banner eliminado!")
            }else{
                message.error("Error al eliminar el banner")
            }
        } catch (error) {
            console.log(error)
            message.error("Error de aplicación o del servidor")
        }finally{
            hiddenMessage()
        }
    }
    
    const updateSettings = async(settings) => {
        console.log(settings)
        const hiddenMessage = message.loading("Guardando...", 0)
        try {
            const response = await fetch(`${config.apibaseUrl}/update-settings/?state=${settings}`, {
                method: "PUT",                
            });
            const responseData = await response.json()
            if (response.status === 200) {
                await getData()
                message.success("Guardado con exito")
            }else{
                message.error(responseData.message)
            }
        } catch (error) {
            console.log(error)
            message.error("Error de aplicación o del servidor")
        }finally{
            hiddenMessage()
        }
    }

    return (
        <Context.Provider value={{
            processImages,
            saveProduct,uploadCategory, 
            categories, productsByImages,
            updateCategory,deleteCategory,
            editProduct,changeProductState,
            deleteProduct,savePromotion,
            promotions,changePromotionStatus,
            editPromotion,deletePromotion,
            uploadBanner,banners,
            updateBanner,deleteBanner,
            fetchingData
        }}>
            {children}
        </Context.Provider>
    );
}
