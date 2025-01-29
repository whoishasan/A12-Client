import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Router";
import { AuthContextProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

const queryClient = new QueryClient();

if (import.meta.env.VITE_PRODUCTION !== "false") {
  console.log =
    console.warn =
    console.error =
    console.info =
    console.debug =
      () => {};
}
const Root = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: "!shadow-none !py-1 !border",
              success: {
                style: {
                  border: "1px solid #6ed654",
                },
              },
              error: {
                style: {
                  border: "1px solid #ff4c4c",
                },
              },
            }}
            limit={2}
          />
        </HelmetProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
