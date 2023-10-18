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
    // 设置路由的index:true的作用是将该路由设为默认路由
    {
        path: "/",
        element: <AuthRoute> <Layout /></AuthRoute>,
        children: [
            { index:true, element: <Home /> },
            { path: "article", element: <Article /> },
            { path: "publish", element: <Publish /> }
        ]
    },
    { path: "/login", element: <Login /> },
]);

export default router;