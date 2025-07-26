import { Product } from "../models/product.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    categoryId,
    subCategoryId,
    unit,
    stock,
    price,
    discount,
    description,
    moreDetails,
  } = req.body;

  if (
    !name ||
    !image[0] ||
    !categoryId[0] ||
    !subCategoryId[0] ||
    !unit ||
    !stock ||
    !price ||
    !description
  )
    return res
      .status(404)
      .json(new apiResponse(404, "All Fields are required!"));

  try {
    const response = await Product.create({
      name,
      image,
      categoryId,
      subCategoryId,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
    });
    if (!response)
      return res
        .status(401)
        .json(new apiResponse(401, "Product Creation Failed!"));

    return res
      .status(200)
      .json(new apiResponse(200, "Product Created Successfully!", response));
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, "Create Product Server Error !", error));
  }
});

const getProducts = asyncHandler(async (req, res) => {
  let { page, limit, search } = req.body;
  if (!page) {
    page = 1;
  }
  if (!limit) {
    limit = 10;
  }

  const query = search
    ? {
        $text: {
          $search: search,
        },
      }
    : {};
  const skip = (page - 1) * limit;

  try {
    const [data, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categoryId subCategoryId"),
      Product.countDocuments(query),
    ]);
    if (!data || !totalCount) {
      return res.status(404).json(new apiResponse(404, "Products Not Found!"));
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, "Products Fetched Successfully!", {
          data,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        })
      );
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, "Get Products Server Error!", error));
  }
});

const getProductByCategory = asyncHandler(async (req, res) => {
  let { categoryId, page, limit } = req.body;
  if (!categoryId)
    return res
      .status(404)
      .json(new apiResponse(404, "Category ID is required!"));
  if (!page) {
    page = 1;
  }
  if (!limit) {
    limit = 10;
  }
  const skip = (page - 1) * limit;

  try {
    const [data, totalCount] = await Promise.all([
      Product.find({ categoryId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categoryId subCategoryId"),
      Product.countDocuments({ categoryId }),
    ]);
    return res
      .status(200)
      .json(
        new apiResponse(200, "Products Fetched Successfully!", {
          data,
          totalCount,
        })
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiResponse(500, "Get Product By Category Server Error!", error)
      );
  }
});

const getProductBySubCategory = asyncHandler(async (req, res) => {
  try {
    let { _id, limit, page } = req.body;
    if (!_id)
      return res
        .status(404)
        .json(new apiResponse(404, "Sub Category ID is required!"));

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 8;
    }
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      Product.find({ subCategoryId: _id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categoryId subCategoryId"),
      Product.countDocuments({ subCategoryId: _id }),
    ]);

    return res
      .status(200)
      .json(
        new apiResponse(200, "Products Fetched Successfully!", {
          data,
          totalCount,
          limit,
        })
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiResponse(500, "Get Product By SubCategory Server Error!", error)
      );
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id)
      return res
        .status(404)
        .json(new apiResponse(404, "Product ID is required!"));

    const response = await Product.findByIdAndDelete(_id);
    if (!response)
      return res.status(404).json(new apiResponse(404, "Product Not Found!"));

    return res
      .status(200)
      .json(new apiResponse(200, "Product Deleted Successfully!"));
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, "Delete Product Server Error!", error));
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      _id,
      name,
      image,
      categoryId,
      subCategoryId,
      unit,
      stock,
      price,
      discount,
      description,
      moreDetails,
    } = req.body;
    if (
      !_id ||
      !name ||
      !image[0] ||
      !categoryId[0] ||
      !subCategoryId[0] ||
      !unit ||
      !stock ||
      !price ||
      !description
    )
      return res
        .status(404)
        .json(new apiResponse(404, "All Fields are required!"));

    const response = await Product.findByIdAndUpdate(
      _id,
      {
        name,
        image,
        categoryId,
        subCategoryId,
        unit,
        stock,
        price,
        discount,
        description,
        moreDetails,
      },
      { new: true }
    );
    if (!response)
      return res.status(404).json(new apiResponse(404, "Product Not Found!"));

    return res
      .status(200)
      .json(new apiResponse(200, "Product Updated Successfully!", response));
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, "Update Product Server Error!", error));
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body
    if (!_id) return res.status(404).json(
      new apiResponse(404, "Product ID is required!")
    )

    const response = await Product.findById(_id).populate("categoryId subCategoryId")
    if (!response) return res.status(404).json(
      new apiResponse(404, "Product Not Found!")
    )

    return res.status(200).json(
      new apiResponse(200, "Product Fetched Successfully!", response)
    )
  } catch (error) {
    return res.status(500).json(
      new apiResponse(500, "Get Product By ID Server Error!", error)
    )
  }
})

const searchProduct = asyncHandler(async (req,res)=>{
  try {
    let { search , page , limit } = req.body

    const query = search ? {
      $text: {
        $search: search,
      },
    } : {}

    if (!page) page = 1
    if (!limit) limit = 10
    const skip = (page - 1) * limit

    const [data, totalCount] = await Promise.all([
      Product.find(query)
       .sort({ createdAt: -1 })
       .skip(skip)
       .limit(limit)
       .populate("categoryId subCategoryId"),
      Product.countDocuments(query),
    ])

    return res.status(200).json(
      new apiResponse(200, "Products Fetched Successfully!", {
        data,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        page,
        limit,
      })
    )
    
  } catch (error) {
    return res.status(500).json(
      new apiResponse(500, "Search Product Server Error!", error)
    )
  }
})

export {
  createProduct,
  getProducts,
  getProductByCategory,
  getProductBySubCategory,
  deleteProduct,
  updateProduct,
  getProductById,
  searchProduct
};
