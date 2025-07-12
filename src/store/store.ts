import { configureStore } from "@reduxjs/toolkit";
import { useAuth } from "@/features/useAuth";
import { useTasks } from "@/features/useTasks";
import { useAdmin } from "@/features/useAdmin";

export const store = configureStore({
  reducer: {
    [useAuth.reducerPath]: useAuth.reducer,
    [useTasks.reducerPath]: useTasks.reducer,
    [useAdmin.reducerPath]: useAdmin.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      useAuth.middleware,
      useTasks.middleware,
      useAdmin.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
