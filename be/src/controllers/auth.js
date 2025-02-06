import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Đảm bảo có `.js` nếu dùng ES6

// ✅ Schema validation với Joi
const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "any.required": "Trường Name là bắt buộc",
        "string.empty": "Trường Name không được để trống",
        "string.min": "Trường Name phải có ít nhất {#limit} ký tự",
        "string.max": "Trường Name không được vượt quá {#limit} ký tự",
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Trường Email là bắt buộc",
        "string.empty": "Trường Email không được để trống",
        "string.email": "Trường Email phải là email hợp lệ",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "any.required": "Trường Password là bắt buộc",
        "string.empty": "Trường Password không được để trống",
        "string.min": "Trường Password phải có ít nhất {#limit} ký tự",
        "string.max": "Trường Password không được vượt quá {#limit} ký tự",
    }),
});

// ✅ Lấy danh sách user
export const getAllUser = async(req, res) => {
    try {
        const users = await User.find().select("-password"); // Không trả về mật khẩu
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách user thành công",
            data: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server!" });
    }
};
//xoa
export const getUserDetail = async(req, res) => {
    try {
        // Chuyển đổi user_id sang kiểu số
        const usersId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ" });
        }

        // Tìm người dùng theo user_id
        const users = await Users.findOne({ users_id: usersId }, '-password');
        if (!users) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }
        return res.status(200).json({
            message: "Get Users Detail Done",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Đăng ký user (Register)
export const Register = async(req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        const { error } = signupSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map((item) => item.message);
            return res.status(StatusCodes.BAD_REQUEST).json({ messages });
        }

        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại hay chưa
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ messages: ["Email đã tồn tại"] });
        }

        // Mã hóa mật khẩu (dùng bcrypt với saltRounds = 10)
        const hashedPassword = await bcryptjs.hash(password, 10);
        const role = (await User.countDocuments({})) === 0 ? "admin" : "user"; // Người đầu tiên là admin

        // Tạo user mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        return res.status(StatusCodes.CREATED).json({
            message: "Đăng ký thành công!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server! Vui lòng thử lại." });
    }
};

// ✅ Đăng nhập user (Login)
export const Login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra user có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ messages: ["Email không tồn tại"] });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ messages: ["Mật khẩu không chính xác"] });
        }

        // Tạo JWT token (đổi secret key trong production)
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "123456", {
            expiresIn: "7d",
        });

        return res.status(StatusCodes.OK).json({
            message: "Đăng nhập thành công!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server! Vui lòng thử lại." });
    }
};

// ✅ Đăng xuất user (Logout)
export const logout = async(req, res) => {
    try {
        // Trả về phản hồi (đối với JWT, logout là xóa token phía client)
        return res.status(StatusCodes.OK).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi server! Vui lòng thử lại." });
    }
};