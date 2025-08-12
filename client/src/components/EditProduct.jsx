import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { toast } from "react-toastify";
import uploadImage from "../utils/uploadImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddField from "../components/AddField";
import Axios from "../utils/Axios";
import summery from "../common/summery";

const EditProduct = ({product,setProduct,close,fetchProduct}) => {
  const getAllCategories = useSelector((state) => state.product.allCategories);
  const getSubCategories = useSelector(
    (state) => state.product.allSubCategories
  );
  const [loadingImage, SetLoadingImage] = useState(false);
  const [subCategories, setSubCategories] = useState(getSubCategories);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [data, setData] = useState({
    _id:product._id,
    name: product.name,
    image: product.image,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    unit: product.unit,
    stock: product.stock,
    price: product.price,
    discount: product.discount,
    description: product.description,
    moreDetails: product.moreDetails || {},
  });

  const validateFields = () => {
    const optionalFields = ["discount", "moreDetails"];

    const emptyFields = Object.keys(data).filter((key) => {
      if (optionalFields.includes(key)) return false; // Skip optional fields
      const value = data[key];
      // Check if the value is empty
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length === 0;
      }
      return value === "";
    });
    return emptyFields;
  };
  const isEmptyFields = validateFields();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const fileHandler = async (e) => {
    const files = e.target.files[0];
    if (!files) {
      return;
    }

    try {
      SetLoadingImage(true);
      const uploaded = await uploadImage(files);
      if (!uploaded?.data?.success)
        return toast.error("Failed to upload image");
      setData((prev) => {
        return {
          ...prev,
          image: [...prev.image, uploaded?.data?.data?.url],
        };
      });
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      SetLoadingImage(false);
    }
  };

  const removeImage = (index) => {
    data.image.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleCategory = (e) => {
    const newcategoryId = e.target.value;
    if (!newcategoryId) {
      return;
    }
    const categoryDetails = getAllCategories.find(
      (c) => c._id === newcategoryId
    );
    setData((prev) => {
      return {
        ...prev,
        categoryId: [...prev.categoryId, categoryDetails],
      };
    });
    setSubCategories(
      getSubCategories.filter((item) =>
        item.category.some((cat) => cat._id === newcategoryId)
      )
    );
  };

  const removeCategory = (index) => {
    data.categoryId.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleSubCategory = (e) => {
    const newSubCategoryId = e.target.value;
    if (!newSubCategoryId) {
      return;
    }

    const subCategoryDetails = getSubCategories.find(
      (s) => s._id === newSubCategoryId
    );

    setData((prev) => {
      return {
        ...prev,
        subCategoryId: [...prev.subCategoryId, subCategoryDetails],
      };
    });
  };

  const removeSubCategory = (index) => {
    data.subCategoryId.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        moreDetails: {
          ...prev.moreDetails,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleAddFieldChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        moreDetails: {
          ...prev.moreDetails,
          [name]: value,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data",data)
    if (isEmptyFields.length > 0) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      const response = await Axios({
        ...summery.updateProduct,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData?.message);
        setData({
          name: "",
          image: [],
          categoryId: [...data.categoryId],
          subCategoryId: [...data.subCategoryId],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          moreDetails: {},
        });
        if(close){
            close();
        }
        fetchProduct()
        setProduct(data)
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
      if (error?.response?.status === 500) {
        toast.error("Internal Server Error :", error?.response?.message);
      }
    }
    
  };

  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-700 bg-opacity-60 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white p-2 w-full max-w-3xl rounded max-h-[95vh] overflow-hidden overflow-y-auto">
        <section className="p-2 h-full">
          <div className="grid gap-5">
            <div className="shadow-md p-2 flex justify-between">
              <h1 className="font-semibold">Edit Product</h1>
              <button onClick={close}><IoClose size={22}/></button>
            </div>
            <div className="grid">
              <form className="grid gap-2" onSubmit={handleSubmit}>
                <div className="grid gap-1">
                  <label htmlFor="name" className="text-sm font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Product Name"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={handleInputChange}
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                  />
                </div>
                <div className="grid gap-1">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Enter Product Description"
                    value={data.description}
                    onChange={handleInputChange}
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm resize-none"
                    multiple
                    rows={5}
                  ></textarea>
                </div>
                <div className="grid gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Select Images
                  </label>
                  <label
                    htmlFor="image"
                    className="bg-slate-50 p-2 h-32 flex items-center justify-center flex-col cursor-pointer border rounded text-sm focus-within:border-primary200"
                  >
                    {loadingImage ? (
                      <span className="flex gap-2 items-center justify-center">
                        <div
                          className={`border-gray-400 h-12 w-12 animate-spin rounded-full border-8 border-t-primary200`}
                        />
                        <span className="text-lg">Loading...</span>
                      </span>
                    ) : (
                      <>
                        <IoMdCloudUpload size={80} />
                        <span>Upload Image</span>
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    hidden
                    multiple
                    onChange={fileHandler}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.image[0] && (
                      <>
                        {data.image.map((img, idx) => (
                          <div
                            key={"images" + idx}
                            className="h-32 w-32 object-scale-down rounded bg-blue-50 pt-2 flex items-center justify-center relative group cursor-pointer"
                          >
                            <img
                              src={img}
                              className="h-full w-full object-scale-down"
                            />
                            <span
                              className="absolute bottom-0 right-0 p-1 rounded cursor-pointer hidden group-hover:block"
                              onClick={() => {
                                removeImage(idx);
                              }}
                            >
                              <MdDelete className="text-red-500" size={23} />
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-1">
                  <label htmlFor="category" className="text-sm font-semibold">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                    onChange={handleCategory}
                  >
                    <option value="">Select Category</option>
                    {getAllCategories.map((category, idx) => (
                      <option
                        key={category._id + "category"}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div>
                    {data.categoryId[0] && (
                      <div className="flex gap-1 flex-wrap">
                        {data.categoryId.map((val, idx) => (
                          <div
                            key={val._id}
                            className="flex items-center gap-2 py-1 px-2 shadow-sm border rounded"
                          >
                            <span>{val.name}</span>
                            <span
                              className="cursor-pointer"
                              onClick={() => removeCategory(idx)}
                            >
                              <IoClose size={20} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-1">
                  <label
                    htmlFor="subCategory"
                    className="text-sm font-semibold"
                  >
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    id="subCategory"
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                    onChange={handleSubCategory}
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories.map((category, idx) => (
                      <option
                        key={category._id + "category"}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div>
                    {data.subCategoryId[0] && (
                      <div className="flex flex-wrap gap-1">
                        {data.subCategoryId.map((val, idx) => (
                          <div
                            key={val._id + "subCategory"}
                            className="flex items-center justify-center gap-2 py-1 px-2 shadow-sm border rounded"
                          >
                            <span>{val.name}</span>
                            <span
                              className="cursor-pointer"
                              onClick={() => removeSubCategory(idx)}
                            >
                              <IoClose size={20} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-1">
                  <label htmlFor="unit" className="text-sm font-semibold">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Product Unit"
                    name="unit"
                    id="unit"
                    value={data.unit}
                    onChange={handleInputChange}
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="stock" className="text-sm font-semibold">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Product Stock"
                    name="stock"
                    id="stock"
                    value={data.stock}
                    onChange={handleInputChange}
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="price" className="text-sm font-semibold">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Product Price"
                    name="price"
                    id="price"
                    value={data.price}
                    onChange={handleInputChange}
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="discount" className="text-sm font-semibold">
                    Discount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Product Discount"
                    name="discount"
                    id="discount"
                    value={data.discount}
                    onChange={handleInputChange}
                    className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                  />
                </div>
                {Object.keys(data.moreDetails).length > 0 &&
                  Object.keys(data.moreDetails).map((val) => (
                    <div key={val + "addField"} className="grid gap-1">
                      <label
                        htmlFor={val}
                        className="text-sm font-semibold capitalize"
                      >
                        {val}
                      </label>
                      <input
                        type="text"
                        name={val}
                        id={val}
                        value={data.moreDetails[val]}
                        onChange={handleAddFieldChange}
                        className="bg-blue-50 outline-none border rounded p-2 focus-within:border-primary200 text-sm"
                      />
                    </div>
                  ))}
                <div className="grid">
                  <div
                    className="border border-primary200 w-fit py-2 px-4 text-sm rounded hover:bg-primary200 cursor-pointer"
                    onClick={() => setOpenAddField(true)}
                  >
                    Add Field
                  </div>
                </div>
                <div className="grid gap-1">
                  <button
                    type="submit"
                    className="border border-primary200 py-2 px-4 rounded text-sm hover:bg-primary200 hover:text-white"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
          {openAddField && (
            <AddField
              close={() => setOpenAddField("")}
              add={handleAddField}
              field={fieldName}
              setfield={setFieldName}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProduct;
