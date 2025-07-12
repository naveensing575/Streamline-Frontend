import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task } from "@/types/Task";

export const useTasks = createApi({
  reducerPath: "useTasks",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    editTask: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    breakdownTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}/breakdown`,
        method: "POST",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useBreakdownTaskMutation,
} = useTasks;
