import React from 'react'
import Banner from './_components/Banner'
import "./Homepage.scss"
type Props = {}
import { Button, Card, Carousel, message, Skeleton, Typography } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
const HomePage = (props: Props) => {
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
    <Carousel autoplay>
      <div>
        <img src="https://cdn.divineshop.vn/image/catalog/Anh/14.03.2022/ExitLag-92081.png?hash=1650276321" />
      </div>
      <div>
        <img src="https://cdn.divineshop.vn/image/catalog/Anh/14.03.2022/ExitLag-92081.png?hash=1650276321" />
      </div>
      <div>
        <img src="https://cdn.divineshop.vn/image/catalog/Anh/14.03.2022/ExitLag-92081.png?hash=1650276321" />
      </div>
      <div>
        <img src="https://cdn.divineshop.vn/image/catalog/Anh/14.03.2022/ExitLag-92081.png?hash=1650276321" />
      </div>
    </Carousel>
    <div>
      {contextHolder}
      <Skeleton loading={isLoading} active>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <Typography.Title level={3}>Sản Phẩm Nổi Bật</Typography.Title>
        </div>
        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "center",
            borderTop: "40px",
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
  </div>
);
}
export default HomePage