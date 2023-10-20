// 路由配置
// import Layout from "../pages/layout";
// import Login from "../pages/login";
import Layout from "@/pages/layout";
import Login from "@/pages/login";
// import Publish from "@/pages/Publish";

import { createBrowserRouter } from "react-router-dom";
import { AuthRoute } from '@/components/AuthRoute'
// import Home from "@/pages/Home";
// import Article from "@/pages/Article";
import { lazy, Suspense } from 'react' // 优化-路由懒加载
const Publish = lazy(() => import('@/pages/Publish'))
const Article = lazy(() => import('@/pages/Article'))
const Home = lazy(() => import('@/pages/Home')) 

// 配置路由实例

const router = createBrowserRouter([
    // { path: "/", element: <Layout /> },
    // 设置路由的index:true的作用是将该路由设为默认路由
    {
        path: "/",
        element: <AuthRoute> <Layout /></AuthRoute>,
        // children: [
        //     { index:true, element: <Home /> },
        //     { path: "article", element: <Article /> },
        //     { path: "publish", element: <Publish /> }
        // ]
        children: [
            { index: true, element: (<Suspense fallback={'加载中'}><Home /></Suspense>) },
            { path: "article", element: (<Suspense fallback={'加载中'}><Article /></Suspense>) },
            { path: "publish", element: (<Suspense fallback={'加载中'}><Publish /></Suspense>) }
           
        ]
    },
    { path: "/login", element: <Login /> },
]);

export default router;