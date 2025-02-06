import instance from "@/configs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormProps,
  Input,
  message,
  Button,
  InputNumber,
  FieldType,
} from "antd";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
type FiProduct = {
  id?: number;
  name: string;
  email: string;
  password: string;
};
const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (users: any) =>
      axios.post(`http://localhost:8080/api/user/register`, users),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      messageApi.success("Đăng ký thành công");

      // Giờ chúng ta không cần tạo giỏ hàng ở đây nữa
      form.resetFields();
      navigate("/login"); // Chuyển hướng sang trang đăng nhập
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    mutate(values);
    const phoneNumber = values.phone ? String(values.phone) : "";
    if (phoneNumber && isNaN(Number(phoneNumber))) {
      messageApi.error("Số điện thoại không hợp lệ");
      return; // Dừng quá trình nếu số điện thoại không hợp lệ
    }
    const userData = { ...values, role_id: 1, phone: phoneNumber };
     mutate(userData);
     console.log(userData);
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Thất bại", errorInfo);
  };
  return (
    <div>
      <Button danger>
        <Link to={`/admin/login`}>dang nhap</Link>
      </Button>
      <div>
        <Button danger>
          <Link to={`/admin/products`}>quay ve</Link>
        </Button>
        {contextHolder}
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                max: 225,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
