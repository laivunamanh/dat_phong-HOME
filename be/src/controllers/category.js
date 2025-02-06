import { StatusCodes } from "http-status-codes";
import Categories from "../models/category";
import Product from "../models/product";
import slugify from "slugify";
export const create = async(req, res) => {
    try {
        const categoy = await Categories.create({
            name: req.body.name,
            slug: slugify(req.body.name, "-"),
        });

        return res.status(StatusCodes.CREATED).json(categoy);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error, message });
    }
};

export const getAll = async(req, res) => {
    try {
        const categories = await Categories.find({});
        if (categories.length === 0) {
            return res.status(StatusCodes.OK).json({ message: "Không có danh mục nào!" });
        }
        return res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
export const getCategoryById = async(req, res) => {
    // GET /categories/65fef32d75398a9a92b694da
    // { name: "Danh mục 1", products: []}
    try {
        const products = await Product.find({ category: req.params.id });
        const category = await Categories.findById(req.params.id);
        if (category.length === 0)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy sản phẩm nào!" });
        return res.status(StatusCodes.OK).json({
            category,
            products,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
export const deleteCategoryById = async(req, res) => {
    try {
        const category = await Categories.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json(category);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};
export const updateCategoryById = async(req, res) => {
    try {
        const category = await Categories.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json(category);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

// iphone 13 product max => /product/iphone-13-product-max
// GET /product/:slug