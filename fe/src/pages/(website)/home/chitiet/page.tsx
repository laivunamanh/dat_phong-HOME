import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Skeleton,
  Typography,
  message,
  Form,
  Input,
  List,
  Rate,
  Space,
  Divider,
} from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";

const { TextArea } = Input;

// Fetch product details based on the productId
const fetchProductDetails = async (productId: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/products/${productId}`
    );
    return data.data; // Assuming the product data is under `data.data`
  } catch (error) {
    throw new Error("Failed to load product details.");
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>(); // Get the productId from the URL params
  const [messageApi, contextHolder] = message.useMessage();

  // Lưu danh sách bình luận
  const [comments, setComments] = useState<{ name: string; comment: string }[]>(
    []
  );

  const { data, isLoading, isError, error } = useQuery(
    ["productDetails", productId],
    () => fetchProductDetails(productId!),
    { enabled: !!productId } // Only run the query when productId is available
  );

  // Handle comment submission
  const handleCommentSubmit = (values: { name: string; comment: string }) => {
    setComments([...comments, values]);
    messageApi.success("Bình luận đã được thêm!");
  };

  // Displaying error message if product details cannot be fetched
  if (isError) {
    message.error(error instanceof Error ? error.message : "Unknown error");
    return <div>Error loading product details. Please try again later.</div>;
  }

  // Skeleton loader while fetching data
  if (isLoading) {
    return <Skeleton active />;
  }

  // If data is empty or not found
  if (!data) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card
        hoverable
        style={{ maxWidth: 800, margin: "0 auto" }}
        cover={<img alt={data.name} src={data.image} />}
      >
        <Typography.Title level={2}>{data.name}</Typography.Title>
        <Typography.Text strong style={{ display: "block" }}>
          Giá: {data.price} VNĐ
        </Typography.Text>
        <Rate
          value={data.rating}
          disabled
          style={{ fontSize: "1.2rem", color: "#f39c12" }}
        />
        <Divider />
        <Typography.Paragraph>{data.description}</Typography.Paragraph>

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={() =>
              messageApi.success("Sản phẩm đã được thêm vào giỏ hàng")
            }
            block
            style={{
              backgroundColor: "#27ae60",
              borderColor: "#27ae60",
              fontWeight: "bold",
            }}
          >
            Thêm vào giỏ hàng
          </Button>

          <Button
            type="primary"
            icon={<HeartOutlined />}
            size="large"
            onClick={() =>
              messageApi.success(`${data.name} đã được thêm vào yêu thích`)
            }
            block
            style={{
              backgroundColor: "#e74c3c",
              borderColor: "#e74c3c",
              fontWeight: "bold",
            }}
          >
            Thêm vào yêu thích
          </Button>
        </Space>

        <Button
          type="primary"
          style={{
            backgroundColor: "#2980b9",
            borderColor: "#2980b9",
            width: "100%",
            marginTop: 20,
            fontWeight: "bold",
          }}
          size="large"
          onClick={() => messageApi.success(`Mua ngay sản phẩm ${data.name}`)}
        >
          Mua ngay
        </Button>
      </Card>

      {/* Bình luận */}
      <Card
        title="Bình luận"
        style={{
          marginTop: 24,
          borderRadius: "8px",
          maxWidth: 800,
          margin: "auto",
        }}
      >
        <Form onFinish={handleCommentSubmit} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>

          <Form.Item
            label="Bình luận"
            name="comment"
            rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
          >
            <TextArea rows={3} placeholder="Nhập bình luận của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi bình luận
            </Button>
          </Form.Item>
        </Form>

        {/* Danh sách bình luận */}
        <List
          dataSource={comments}
          renderItem={(item) => (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <Typography.Text strong>{item.name}</Typography.Text>
                <p>{item.comment}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ProductDetail;
