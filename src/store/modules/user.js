// 和用户相关的状态管理

import { request } from '@/utils'
import { setToken as _setToken, getToken, removeToken } from '@/utils'

import { createSlice } from '@reduxjs/toolkit'

const userStore = createSlice({
    name: "user",
    // 数据状态
    initialState: {
        // token: localStorage.getItem('token-key') || '',
        token: getToken() || '',
        userInfo: {}
    },
    // 同步修改方法
    reducers: {
        setToken(state, action) {
            state.token = action.payload
            // 将token保存到本地存储中
            // localStorage.setItem('token-key', action.payload)改为下面这种方式
            _setToken(action.payload)
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload
        },
    }
})

// 解构出actionCreater

const { setToken, setUserInfo } = userStore.actions

// 获取reducer函数

const userReducer = userStore.reducer

// 异步方法，完成登录获取token
const fetchLogin = (loginForm) => { 
    return async (dispatch) => {
        // 1.发送异步请求，获取token
        const res = await request.post('/authorizations', loginForm)
        // 2.提交同步acction，将token保存到redux中
        dispatch(setToken(res.data.token))
    }
}

// 获取个人用户信息异步方法
const fetchUserInfo = () => {
    return async (dispatch) => {
        const res = await request.get('/user/profile')
        dispatch(setUserInfo(res.data))
    }
}

export { fetchLogin, setToken, fetchUserInfo }

export default userReducer