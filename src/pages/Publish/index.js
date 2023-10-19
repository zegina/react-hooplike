import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useState, useEffect } from 'react'
import { getChannelAPI, createArticleAPI } from '@/apis/article'

const { Option } = Select

const Publish = () => {
    // 获取频道列表
    const [channeList, setChanneList] = useState([])
    useEffect(() => {
        // 1.封装函数，在函数体内调用接口
        const getChannelList = async () => {
            const res = await getChannelAPI()
            setChanneList(res.data.channels)
        }
        // 2.调用函数
        getChannelList()
    }, [])
    // const onFinish = (formValue) => {
    //     console.log(formValue)
    //     // 1. 按照接口文档的格式处理收集到的表单数据
    //     // 2. 调用接口提交
    //     const reqData = {
    //         title:'',
    //         content:'',
    //         cover: {
    //             type: 0,
    //             image: []
    //         },
    //         channel_id: '',
    //     }
    // }
    // 点击发布文章
    const onFinish = (formValue) => {
        // 优化，在提交之前判断选择的类型是否与上传的图片数量一致
        if (imageList.length !== imageType) return message.warning('封面类型和图片数量不匹配')

        const { title, content, channel_id } = formValue
        // 1. 按照接口文档的格式处理收集到的表单数据
        // 2. 调用接口提交
        const reqData = {
            title,
            content,
            cover: {
                type: imageType, 
                images: imageList.map(item => {
                    if (item.response) {
                        return item.response.data.url
                    } else {
                        return item.url
                    }
                }) // 图片列表
            },
            channel_id
        }
        createArticleAPI(reqData) // 调用接口
    }
    // 图片-点击上传按钮的回调
    const [imageList,setIamgeList] = useState([])
    const onChange = (value) => {
        console.log('onChange', value)
        setIamgeList(value.fileList)
    }
    // 点击每个单选框,切换图片封面类型
    const [imageType, setImageType] = useState(1)
    const onTypeChange = (e) => {
        console.log('切换封面了', e.target.value)
        setImageType(e.target.value)
    }
    
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '发布文章' },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                            {/* <Option value={0}>推荐</Option> */}
                            {channeList.map(item => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={onTypeChange}>
                                <Radio value={0}>无图</Radio>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* 
              listType: 决定选择文件框的外观样式
              showUploadList: 控制显示上传列表
            */}
                        {imageType > 0 && <Upload
                            listType="picture-card"
                            showUploadList
                            action={'http://geek.itheima.net/v1_0/upload'}
                            name='image'
                            onChange={onChange}
                            maxCount={imageType}
                            fileList={imageList}
                        >
                            <div style={{ marginTop: 8 }}>
                                <PlusOutlined />
                            </div>
                        </Upload>}
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <ReactQuill
                            className="publish-quill"
                            theme="snow"
                            placeholder="请输入文章内容"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Publish