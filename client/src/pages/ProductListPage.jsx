import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import summery from "../common/summery";
import ProductCard from "../components/ProductCard";
import { UrlFormater } from "../utils/UrlFormater";

const ProductListPage = () => {
  const allSubCategory = useSelector((state) => state.product.allSubCategories);
  const params = useParams();
  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subcategory.split("-").slice(-1)[0];
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const totalPages = Math.ceil(totalProducts/limit)

  const subCategories = allSubCategory.filter((cate) =>
    cate.category.some((cat) => cat._id === categoryId)
  );

  const fetchProduct = async () => {
    try {
      const response = await Axios({
        ...summery.getProductBySubCategory,
        data: {
          _id: subCategoryId,
          page: page,
          limit: limit,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setProducts(responseData?.data?.data);
        setTotalProducts(responseData?.data?.totalCount);
        setLimit(responseData?.data?.limit)
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchProduct();
  }, [params,page]);

  return (
    <section className="min-h-[79vh] container mx-auto">
      <div className="grid grid-cols-[100px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Left Part */}
        <div className=" min-h-[79vh] max-h-[79vh] overflow-hidden overflow-y-auto border-r border-l grid scrollbar-style py-2">
          {subCategories[0] &&
            subCategories.map((cate) => (
              <Link
                to={`/${params.category}/${UrlFormater(cate.name)}-${cate._id}`}
                key={cate._id + "subCategoriesKey"}
                className={`flex flex-col lg:flex-row items-center gap-2 border-b text-sm hover:bg-green-200 cursor-pointer relative p-1 ${
                  cate._id === subCategoryId ? "bg-green-200" : ""
                } select-none`}
              >
                <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center">
                  <img
                    src={cate.image}
                    alt={cate.name}
                    className="h-full w-full object-scale-down"
                  />
                </div>
                <p className="text-xs text-center md:text-sm -mt-3 md:mt-0">
                  {cate.name}
                </p>
              </Link>
            ))}
        </div>
        {/* Right Part */}
        <div className="min-h-[79vh] max-h-[79vh] p-2">
          <div className="shadow-md p-2">
            <h1 className="font-semibold">Product List</h1>
          </div>
          <div className="h-full max-h-[71vh]  overflow-hidden overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-3 gap-4">
              {products[0] &&
                products.map((product) => (
                  <Link to={`/product/${UrlFormater(product.name)}-${product._id}`} className="max-h-72">
                    <ProductCard product={product} />
                  </Link>
                ))}
            </div>
            {
              totalPages > 1 && (
                <div className="flex justify-between">
                  <button className="py-2 text-sm px-2 rounded border border-primary200 hover:bg-primary200 hover:text-gray-100" onClick={()=>page > 1 ? setPage(prev => prev-1):null}>Previous</button>
                  <p>{page}/{totalPages}</p>
                  <button className="py-2 text-sm px-2 rounded border border-primary200 hover:bg-primary200 hover:text-gray-100" onClick={()=>page < totalPages ? setPage(prev => prev+1):null}>Next</button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
