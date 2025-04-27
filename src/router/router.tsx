import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import FirstPage from "../pages/FirstPage";
import MainPage from "../pages/MainPage";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <FirstPage />
                ),
            },
            {
                path: "main",
                element: (
                    <MainPage />
                ),
            },
            {
                path: "settings",
                element: (
                    <Settings />
                ),
            },
        ]
    }
])