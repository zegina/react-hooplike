// 路由配置
// import Layout from "../pages/layout";
// import Login from "../pages/login";
import Layout from "@/pages/layout";
import Login from "@/pages/login";
import Publish from "@/pages/Publish";

import { createBrowserRouter } from "react-router-dom";
import { AuthRoute } from '@/components/AuthRoute'
import Home from "@/pages/Home";
import Article from "@/pages/Article";

// 配置路由实例

const router = createBrowserRouter([
    // { path: "/", element: <Layout /> },
    {
        path: "/",
        element: <AuthRoute> <Layout /></AuthRoute>,
        children: [
            { path: "home", element: <Home /> },
            { path: "article", element: <Article /> },
            { path: "publish", element: <Publish /> }
        ]
    },
    { path: "/login", element: <Login /> },
]);

export default router;