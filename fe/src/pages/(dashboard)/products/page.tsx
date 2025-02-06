import { IProduct } from "@/common/types/product";
import instance from "@/configs/axios";
import { PlusCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Radio, Skeleton, Table } from "antd";
import axios from "axios";
import { isError } from "joi";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {};

const ProductManagementPage = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Fetch product data
  // const {
  //   data: products,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: async () => {
  //     try {
  //       const response = await instance.get("http://localhost:8080/products");
  //       return response.data; // Ensure the response has the correct structure
  //     } catch (error) {
  //       throw new Error("Network failed");
  //     }
  //   },
  // });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8080/products`);
      console.log(data); // Kiểm tra lại cấu trúc dữ liệu
      return data.data.map((products: any) => ({
        key: products.products_id,
        ...products,
      }));
    },
  });
  //Handle errors
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

  // Mutation to delete product
  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      // Changed `number` to `string` based on _id type
      try {
        await instance.delete(`/products/${id}`);
      } catch (error) {
        throw new Error("Xóa sản phẩm thất bại. Vui lòng thử lại sau!");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      messageApi.open({
        type: "success",
        content: "Xóa sản phẩm thành công!",
      });
    },
    onError: (error: any) => {
      messageApi.open({
        type: "error",
        content: error.message || "Đã có lỗi xảy ra.",
      });
    },
  });

  // Create filters based on product names
  const createFilters = (products: IProduct[]) => {
    if (!Array.isArray(products)) {
      return []; // Nếu products không phải là mảng, trả về mảng rỗng
    }

    return products
      .map((products: IProduct) => products.name)
      .filter((value, index, self) => self.indexOf(value) === index) // Lọc các tên sản phẩm duy nhất
      .map((name) => ({ text: name, value: name })); // Tạo đối tượng filter cho từng tên sản phẩm
  };

  // Map data for table rendering
  // const dataSource = Array.isArray(products) // Kiểm tra xem products có phải là mảng không
  //   ? products.map((products: IProduct) => ({
  //       key: products._id,
  //       ...products,
  //     }))
  //   : []; // Nếu không phải mảng, trả về mảng rỗng
  // console.log(products); // Kiểm tra cấu trúc dữ liệu

 const columns = [
   {
     key: "name",
     title: "Tên đăng nhập",
     dataIndex: "name",
     render: (text: string) => <a>{text}</a>,
   },

   {
     key: "createdAt",
     title: "createdAt",
     dataIndex: "createdAt",
   },
   {
     key: "price",
     title: "price",
     dataIndex: "price",
   },
   {
     key: "action",
     render: (_: any, products: IProduct) => (
       <div className="flex space-x-2">
         <Popconfirm
           title="Xóa sản phẩm"
           description="Bạn chắc chắn muốn xóa không?"
           onConfirm={() => mutate(products._id)} // Đảm bảo _id được truyền dưới dạng string
           okText="Có"
           cancelText="Không"
         >
           {isDeleting ? (
             <Button danger>
               <Loader2Icon className="animate-spin" />
             </Button>
           ) : (
             <Button danger>Xóa</Button>
           )}
         </Popconfirm>
         <Button>
           <Link to={`/admin/products/${products._id}/edit`}>Cập nhật</Link>
         </Button>
       </div>
     ),
   },
 ];
const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
  "checkbox"
);
  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1>
        <Button type="primary">
          <Link to="/admin/products/add">
            <PlusCircleFilled /> Thêm sản phẩm
          </Link>
        </Button>
      </div>
      <Radio.Group
        onChange={(e) => setSelectionType(e.target.value)}
        value={selectionType}
      >
        <Radio value="checkbox">Checkbox</Radio>
        <Radio value="radio">radio</Radio>
      </Radio.Group>
      <Skeleton loading={isLoading} active>
        <Table dataSource={data} columns={columns} />
      </Skeleton>
    </div>
  );
};

export default ProductManagementPage;
