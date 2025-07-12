import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser } from "@/types/User";

export const useAdmin = createApi({
  reducerPath: "useAdmin",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users", "ActivityLogs"],

  endpoints: (builder) => ({
    getAllUsers: builder.query<IUser[], void>({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    updateUserRole: builder.mutation<{ message: string }, { id: string; role: "user" | "admin" }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getActivityLogs: builder.query<any[], void>({
      query: () => "/admin/activity",
      providesTags: ["ActivityLogs"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetActivityLogsQuery,
} = useAdmin;
