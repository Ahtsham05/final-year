import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import summery from "../common/summery";
import Divider from "../components/Divider";
import { currencyConverter } from "../utils/currencyConverter";
import DiscountConverter from "../utils/DiscountConverter";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const [product, setProduct] = useState({});
  const params = useParams();
  const productId = params?.product?.split("-").slice(-1)[0];
  const [imageIndex, setImageIndex] = useState(0);
  const imageContainer = useRef()

  const fetchProduct = async () => {
    try {
      const response = await Axios({
        ...summery.getProductById,
        data: {
          _id: productId,
        },
      });
      const { data: responseData } = response;
      if (responseData?.success) {
        setProduct(responseData?.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      if (error?.response?.status === 500) {
        toast.error(error?.response?.message);
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [params]);

  const scrollImageLeftHandler = ()=>{
    imageContainer.current.scrollLeft -= 80
  }
  const scrollImageRightHandler = ()=>{
    imageContainer.current.scrollLeft += 80
  }
  return (
    <section className="bg-blue-50 py-2 my-1 min-h-[79vh]">
      <div className="container mx-auto p-2">
        {product?.name && (
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Product Images */}
            <div className="">
              {/* image */}
              <div className="h-96 shadow-md">
                <img
                  src={product?.image[imageIndex]}
                  alt=""
                  className="h-full w-full"
                />
              </div>
              <div className="flex justify-center items-center gap-2 p-2 pt-4">
                {product?.image.map((_, index) => (
                  <div
                    className={`h-3 w-3 rounded-full cursor-pointer ${
                      imageIndex === index ? "bg-gray-400" : "bg-gray-300"
                    }`}
                    key={"imageIndex" + index}
                    onClick={() => setImageIndex(index)}
                  ></div>
                ))}
              </div>
              <div className="relative w-full">
                <div className="flex px-4 py-2 items-center gap-2 overflow-hidden overflow-x-auto scroll-hidden scroll-smooth" ref={imageContainer}>
                  {product?.image.map((image, index) => (
                    <img
                      src={image}
                      alt={"img" + index}
                      className={`h-16 w-16 cursor-pointer ${
                        imageIndex === index ? "border-black border" : "border"
                      }`}
                      onClick={() => setImageIndex(index)}
                      key={"productsmallImage" + index}
                    />
                  ))}
                  <div className="absolute flex items-center justify-between pr-6 bg-red-300 w-full">
                    <button className="absolute z-10 left-1 bg-white shadow-md rounded-full p-1" onClick={scrollImageLeftHandler}>
                      <FaAngleLeft />
                    </button>
                    <button className="absolute z-10 right-8 bg-white shadow-md rounded-full p-1" onClick={scrollImageRightHandler}>
                      <FaAngleRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product details */}
            <div className="px-4">
              <p className="py-1 px-2 text-sm bg-green-400 w-fit rounded-full text-neutral-700">
                10 Min
              </p>
              <h1 className="text-2xl font-semibold py-1">{product?.name}</h1>
              <p className="text-neutral-700">{product?.unit}</p>
              <div className="my-2">
                <Divider />
              </div>
              <p className="text-neutral-700 font-medium">Price</p>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="p-2 px-4 border font-semibold text-lg border-green-500 rounded">
                  {currencyConverter(product?.price)}
                </span>
                <span className="line-through text-neutral-700">
                  {currencyConverter(
                    DiscountConverter(product?.price, product?.discount)
                  )}
                </span>
                <div>
                  <span className="text-lg font-semibold text-green-500">
                    {product?.discount}%
                  </span>
                  <span className="text-neutral-700 px-1 font-medium">
                    Discount
                  </span>
                </div>
              </div>
              {
                product?.stock ? (
                  <div className="my-4">
                    <AddToCartButton product={product}/>
                  </div>
                ):(
                  <p className="text-red-500 p-2 font-semibold">Out Of Stock</p>
                )
              }
              <div>
                <h1 className="font-semibold">Why shop from blinkeyit?</h1>
                <div className="py-3 flex gap-3 items-center">
                  <div>
                    <img
                      src={image1}
                      alt="superfast Delivery"
                      className="h-20 w-20"
                    />
                  </div>
                  <div className="p-2">
                    <h1 className="font-semibold">Superfast Delivery</h1>
                    <p className="text-sm text-neutral-700">
                      Get your order to your doorstep at the earliest from dark
                      stores near you.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div>
                    <img
                      src={image2}
                      alt="Best Prices & Offers"
                      className="h-20 w-20"
                    />
                  </div>
                  <div className="p-2">
                    <h1 className="font-semibold">Best Prices & Offers</h1>
                    <p className="text-sm text-neutral-700">
                      Best Price Destination with Offers directly from the
                      manufacturers
                    </p>
                  </div>
                </div>
                <div className="py-3 flex gap-3 items-center">
                  <div>
                    <img
                      src={image3}
                      alt="Wide Assortment"
                      className="h-20 w-24"
                    />
                  </div>
                  <div className="p-2">
                    <h1 className="font-semibold">Wide Assortment</h1>
                    <p className="text-sm text-neutral-700">
                      Choose from 5000+ products across food personal care,
                      household & other Categories
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* additional details */}
            <div>
              <div>
                <h1 className="font-semibold">Description</h1>
                <p className="text-sm text-neutral-700">{product?.description}</p>
                <h1 className="font-semibold mt-2">Unit</h1>
                <p className="text-sm text-neutral-700">{product?.unit}</p>
              </div>
              <div>
                {
                  product?.moreDetails && (
                    <>
                      {
                        Object.keys(product?.moreDetails).map((val,index)=>(
                          <div className="my-2" key={"moreDetails"+index}>
                            <h1 className="font-semibold">{val}</h1>
                            <p className="text-sm text-neutral-700">{product?.moreDetails[val]}</p>
                          </div>
                        ))
                      }
                    </>
                  )
                }
              </div>
            </div>


          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDisplayPage;
