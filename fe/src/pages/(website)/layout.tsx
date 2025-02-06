import React, { useEffect, useState } from "react";
import {
  AlignLeftOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Menu, Layout, theme, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, Outlet } from "react-router-dom";

// Fetch categories from the API
const fetchCategories = async () => {
  try {
    const response = await instance.get("http://localhost:8080/api/categories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to load categories. Please try again later!");
  }
};

const { Header, Content, Footer, Sider } = Layout;

interface Category {
  _id: string;
  name: string;
  subCategories: { name: string; _id: string }[];
}

const LayOutHome: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      // Mapping categories to menu items
      const items2 = categories.map((category, index) => {
        return {
          key: `sub${index + 1}`,
          icon: React.createElement(AlignLeftOutlined), // You can customize icons here if needed
          label: category.name, // Using category name from the API
          children: category.subCategories?.map((subCategory, j) => {
            const subKey = `${index + 1}-${j + 1}`;
            return {
              key: subKey,
              label: subCategory.name, // Using subcategory name
              // Optionally add links for subcategories if needed
              // You can also adjust the route as required for your application
              children: [
                {
                  key: `${subKey}-link`,
                  label: <Link to={`/categories/${subCategory._id}`}>View</Link>,
                },
              ],
            };
          }),
        };
      });
      setMenuItems(items2); // Set the dynamic menu items
    }
  }, [categories]);

  // Show error message if there is an issue fetching the categories
  if (isError) {
    return (
      <div>
        <h2>
          Error loading categories:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </h2>
      </div>
    );
  }

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[
            { key: "1", label: "Trang Chủ" },
            { key: "2", label: "Sản Phhẩm" },
            { key: "3", label: "Đăng Ký" },
            { key: "4", label: "Đăng nhập" },
            { key: "5", label: "Giỏ Hàng" },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          {isLoading ? (
            <Skeleton active />
          ) : (
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
              items={menuItems}
            />
          )}
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
            {/* Outlet or Content goes here */}
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LayOutHome;
