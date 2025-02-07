import CategoryAddPage from "@/pages/(dashboard)/categories/Addcategories";
import ListCategories from "@/pages/(dashboard)/categories/Listcategories";
import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import ProductAddPage from "@/pages/(dashboard)/products/add/page";
import ListUser from "@/pages/(dashboard)/products/athu/listUser";
import Login from "@/pages/(dashboard)/products/athu/Login";
import Register from "@/pages/(dashboard)/products/athu/register";

import ProductEditPage from "@/pages/(dashboard)/products/edit/page";
import ProductsManagementPage from "@/pages/(dashboard)/products/page";
import NotFoundPage from "@/pages/(website)/404/page";
import ProductDetail from "@/pages/(website)/home/chitiet/page";
import HomePgae from "@/pages/(website)/home/HomePage";
import HomePage from "@/pages/(website)/home/page";
import Trangchu from "@/pages/(website)/home/trang_chu.tsx/pagehom";

import LayOutHome from "@/pages/(website)/layout";
import LayoutWebsite from "@/pages/(website)/layout";
import { Route, Routes } from "react-router-dom";

const Router = () => {
  return (
    <Routes>
      {/* Website Routes */}
      <Route path="/" element={<LayoutWebsite />}>
        {/* <Route index element={<HomePage />} /> */}
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<LayoutAdmin />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsManagementPage />} />
        <Route path="products/add" element={<ProductAddPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="listuser" element={<ListUser />} />
        <Route path="danhmuc" element={<CategoryAddPage />} />
        <Route path="listdanhmuc" element={<ListCategories />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Home Routes */}
      <Route path="/home" element={<LayOutHome />}>
        <Route path="page" element={<HomePage />} />
        <Route path="product" element={<Trangchu />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 404 Not Found */}
    </Routes>
  );
};

export default Router;
