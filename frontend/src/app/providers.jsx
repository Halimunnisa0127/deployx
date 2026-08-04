import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "../store";
import router from "./router";
import ThemeProvider from "../providers/ThemeProvider";

export default function Providers() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}