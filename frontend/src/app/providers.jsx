import { Provider, useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "../store";
import router from "./router";
import ThemeProvider from "../providers/ThemeProvider";
import { useEffect } from "react";
import { getCurrentUser } from "../features/auth/slice/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return children;
}

export default function Providers() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}