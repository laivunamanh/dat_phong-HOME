import React, { useEffect, useState } from "react";
import {
  AlignLeftOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Menu, Layout, theme, Skeleton, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

// Fetch categories from the API
const fetchCategories = async () => {
  try {
    const response = await instance.get("http://localhost:8080/api/categories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to load categories. Please try again later!");
  }
};

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
  const [collapsed, setCollapsed] = useState(false); // State để ẩn/hiện menu

  useEffect(() => {
    if (categories && categories.length > 0) {
      const items2 = categories.map((category, index) => ({
        key: `sub${index + 1}`,
        icon: <AlignLeftOutlined />,
        label: category.name,
        children: category.subCategories?.map((subCategory, j) => ({
          key: `${index + 1}-${j + 1}`,
          label: (
            <Link to={`/categories/${subCategory._id}`}>
              {subCategory.name}
            </Link>
          ),
        })),
      }));
      setMenuItems(items2);
    }
  }, [categories]);

  if (isError) {
    return (
      <h2>
        Error loading categories:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </h2>
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
            { key: "1", label: <Link to={`/home/page`}>Sản Phẩm</Link>  },
            { key: "2", label: <Link to={`/home/product`}>Sản Phẩm</Link> },
            { key: "3", label: <Link to={`/home/register`}>Đăng ký</Link> },
            { key: "4", label: <Link to={`/home/login`}>Đăng Nhập</Link> },
            { key: "5", label: "Giỏ Hàng" },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          style={{ background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ margin: 10 }}
          />
          {isLoading ? (
            <Skeleton active />
          ) : (
            <Menu
              mode="inline"
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
