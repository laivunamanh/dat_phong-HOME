import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Skeleton, Table } from 'antd';
import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

const listUser = () => {
     const [messageApi, contextHolder] = message.useMessage();

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
      mutationFn: (users_id: number) =>
        axios.delete(`http://localhost:8080/api/user/${users_id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
        messageApi.success("Xóa thành công");
      },
    });
    const { data, isLoading, error } = useQuery({
      queryKey: ["user"],
      queryFn: async () => {
        const { data } = await axios.get(`http://localhost:8080/api/user`);
        console.log(data); // Kiểm tra lại cấu trúc dữ liệu
        return data.data.map((users: any) => ({
          key: users.users_id,
          ...users,
        }));
      },
    });
    const columns = [
      { key: "name", title: "Tên đăng nhập", dataIndex: "name" },
      { key: "email", title: "Email", dataIndex: "email" },
      {
        key: "action",
        title: "Action",
        render: (_: any, users: any) => {
          return (
            <>
              <Popconfirm
                title="Delete the task"
                description="Bạn có chắc muốn xóa không?"
                onConfirm={() => {
                  console.log("Deleting user with ID:", users.users_id); // kiểm tra game_id
                  mutate(users.users_id);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
              <Link to={`/admin/users/${users.users_id}/edit`}>
                <Button>Cập nhật</Button>
              </Link>
            </>
          );
        },
      },
    ];
  return (
    <div>
        
      {contextHolder}
      
      <Skeleton loading={isLoading} active>
        <Table dataSource={data} columns={columns} />
      </Skeleton>
    </div>
  );
}

export default listUser;
