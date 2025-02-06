import instance from "@/configs/axios";
import {
  BackwardFilled,
  Loading3QuartersOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { Link } from "react-router-dom";

type CategoryType = {
  name: string;
  description?: string;
};

const CategoryAddPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: async (category: CategoryType) => {
      try {
        return await instance.post(`/api/categories`, category); // Assuming the API endpoint for adding a category is POST /categories
      } catch (error) {
        throw new Error("Call API thất bại. Vui lòng thử lại sau!");
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Tạo danh mục thành công!",
      });
      form.resetFields();
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });

  const onFinish = (values: CategoryType) => {
    mutate(values);
  };

  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Thêm danh mục</h1>
        <Button type="primary">
          <Link to="/admin/categories">
            <BackwardFilled /> Quay lại
          </Link>
        </Button>
      </div>
      <div className="max-w-2xl mx-auto">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Tên danh mục bắt buộc phải nhập!" },
            ]}
          >
            <Input disabled={isPending} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {isPending ? (
                <>
                  <Loading3QuartersOutlined className="animate-spin" /> Submit
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CategoryAddPage;
