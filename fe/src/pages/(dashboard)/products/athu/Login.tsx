import instance from "@/configs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormProps,
  Input,
  message,
  FieldType,
  Button,
  InputNumber,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
type FiProduct = {
  id?: number;
  //   name: string;
  email: string;
  password: string;
};
const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate } = useMutation({
    mutationFn: async (users: FiProduct) => {
      try {
        return await instance.post(`http://localhost:8080/api/user/login`, users);
      } catch (error) {
        throw new Error("that bai");
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "thanh cong",
      });
      form.resetFields();
    },
    onError: (error) => {
      messageApi.open({
        type: "success",
        content: error.message,
      });
    },
  });
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    mutate(values);
  };

  return (
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
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* <Form.Item<FieldType>
          label="name"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item<FieldType>
          label="email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
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
  );
};

export default Login;
