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
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useState, useEffect } from 'react'
import { createArticleAPI, getArticleById, updateArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {
    // 获取频道列表
    // const [channeList, setChanneList] = useState([])
    // useEffect(() => {
    //     // 1.封装函数，在函数体内调用接口
    //     const getChannelList = async () => {
    //         const res = await getChannelAPI()
    //         setChanneList(res.data.channels)
    //     }
    //     // 2.调用函数
    //     getChannelList()
    // }, [])这段代码已经封装到了hooks文件里
    const { channelList } = useChannel()

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
    // 点击发布文章，提交表单
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
                    if (item.response) { // item.response判断是因为新增和修改时，数据结构不一样，
                        return item.response.data.url
                    } else {
                        return item.url
                    }
                }) // 图片列表,
                // images: imageList.map(item => { return item.url })
            },
            channel_id
        }
        // createArticleAPI(reqData) // 调用接口改为下面这种方式，// 处理调用不同的接口 新增 - 新增接口  编辑状态 - 更新接口  id
        if (articleId) {
            // 更新接口
            updateArticleAPI({ ...reqData, id: articleId })
        } else {
            createArticleAPI(reqData)
        }
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

    // 回显数据,useSearchParams方法获得一个数组，数组里面是一个对象，对象里面是一个方法，这个方法可以获取到url上的参数
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    // 获取实例
    const [form] = Form.useForm()
    useEffect(() => {
        async function getArticleDetail() { 
            const res = await getArticleById(articleId)
            console.log(res.data)
            // form.setFieldsValue(res.data )// 这样写无法回显出类型和图片，只能回显出标题，频道，内容，因为数据解构的问题，看后端返回的数据在哪里，改为以下方式
            // form.setFieldsValue({
            //     ...res.data,
            //     type: res.data.cover.type
            // })
            // 回填图片列表,调用上面setImageType
            // setImageType(res.data.cover.type)
            // 显示图片({url:url})
            // setIamgeList(res.data.cover.images.map(url => {
            //     return { url }
            // }))
            // 简单优化
            const data = res.data
            const { cover } = data
            form.setFieldsValue({
                ...data,
                type: cover.type
            })
            setImageType(cover.type)
            setIamgeList(cover.images.map(url => {
                return { url } //cover.images得到的是数组，使用map映射返回一个对象，对象里面是url，因为之前用到的就是对象，回显需要绑定fileList={imageList}
            }))
        }
        // 只有有id的时候才能调用此函数回填
        if (articleId) {
            getArticleDetail()
        }
    },[articleId,form])

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        // { title: '发布文章' },
                        { title: `${articleId ? '编辑' : '发布'}文章` },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
                    form={form}
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
                            {/* value属性用户选中之后会自动收集起来作为接口的提交字段 */}
                            {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
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