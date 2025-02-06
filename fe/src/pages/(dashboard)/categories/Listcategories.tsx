import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Button, Table, message, Skeleton, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

// Fetch danh mục từ API
const fetchCategories = async () => {
  try {
    const response = await instance.get("http://localhost:8080/api/categories"); // Thay đổi cổng nếu cần
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi tải danh mục. Vui lòng thử lại sau!");
  }
};

const ListCategories = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    data: categories = [], // Mặc định categories là mảng rỗng
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Hiển thị thông báo lỗi nếu có
  if (isError) {
    return (
      <div>
        <h2>
          Lỗi khi tải danh mục:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </h2>
      </div>
    );
  }

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Link to={`/admin/`}>
          <Button type="link">Cập nhật</Button>
        </Link>
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (_: any, record: any) => {
        return (
          <>
            <Popconfirm
              title="Xóa danh mục"
              description="Bạn có chắc muốn xóa không?"
              onConfirm={() => {
                console.log("Deleting category with ID:", record.categories_id); // Kiểm tra categories_id
                mutate(record.categories_id); // Sử dụng đúng `categories_id`
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (categories_id: number) =>
      axios.delete(`http://localhost:8080/api/categories/${categories_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"], // Sửa lại queryKey thành "categories" thay vì "users"
      });
      messageApi.success("Xóa thành công");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Danh sách danh mục</h1>
        <Button type="primary">
          <Link to="/admin/danhmuc">
            <PlusOutlined /> Thêm danh mục
          </Link>
        </Button>
      </div>

      <Skeleton loading={isLoading} active>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="categories_id" // Sử dụng `categories_id` làm khóa dòng
        />
      </Skeleton>
    </div>
  );
};

export default ListCategories;
