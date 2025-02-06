import { PlusCircleFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Skeleton, Typography, message } from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Trangchu = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8080/products`);
      return data.data; // Assuming API returns data.data as an array of products
    },
  });

  if (isError) {
    return (
      <div>
        <h2>
          Lỗi khi tải dữ liệu:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </h2>
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <Skeleton loading={isLoading} active>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          {data?.map((product: any) => (
            <Card
              key={product.products_id}
              hoverable
              style={{ width: 300, height: 400 }}
              cover={<img alt={product.name} src={product.image} />}
            >
              <Typography.Title level={4}>{product.name}</Typography.Title>
              <Typography.Text strong>Giá: {product.price} VNĐ</Typography.Text>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button type="primary">Mua ngay</Button>
                {/* Safeguard: Only render Link if product.products_id is available */}
                {product.products_id ? (
                  <Link to={`/home/product/${product.products_id}`}>
                    <Button type="default">Xem chi tiết</Button>
                  </Link>
                ) : (
                  <Button type="default" disabled>
                    Xem chi tiết
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Skeleton>
    </div>
  );
};

export default Trangchu;
