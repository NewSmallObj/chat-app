"use client"

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps, GetProp, UploadProps } from 'antd';
import { Button, Form, Input, Upload,message } from 'antd';
import { useEffect, useState } from "react";
import {URL,BASEURL,UPDATEUSER} from "@/app/action/stants"
import serviceRequest from '@/libs/serviceRequest';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/app/action/useCurrentUser';
import PubSub from 'pubsub-js';
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"

const { TextArea } = Input;
const FormItem = Form.Item;
const useForm = Form.useForm;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type FieldType = {
  name?: string;
  image?: string;
  avatar?: string;
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export function UserEdit () {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [bgUrl, setBgUrl] = useState<string>();
  const [bgLoading, setBgLoading] = useState(false);
  const session = useSession();
  const {runAsync} = useCurrentUser();

  const [form] = useForm();

  useEffect(()=>{
    setFormData()
  },[])

  const setFormData = ()=>{
    runAsync().then((res)=>{
      form.setFieldsValue({
        name:res.name,
        avatar:res.avatar,
        image:res.image,
        remark:res.remark
      })
      if(res.avatar){
        setAvatarUrl(res.avatar);
      }
      if(res.image){
        setBgUrl(res.image);
      }
    })
  }

  const fetch = async (values:any)=>{
    return await serviceRequest.post<{code:number,msg:string}>(URL.USER.Edit
      ,{
        params:{
          ...values,
          avatar:`${values.avatar}`,
          image:`${values.image}`,
          userId:session.data?.user?.userId!
        },cacheTime:10})
  }

  const onSubmit: FormProps<FieldType>['onFinish'] =  async (values)=> {
    setLoading(true)
      try{
        const {code,msg} = await fetch(values);
        message.success(msg);
        PubSub.publish(UPDATEUSER, 1);
        if(code === 200){
        }
      }catch(e){
        console.log(e)
        message.error('保存失败');
      }finally{
        setLoading(false)
      }
  }


  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只可以上传JPG/PNG文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片应小于2M');
    }
    return isJpgOrPng && isLt2M;
  };


  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // getBase64(info.file.originFileObj as FileType, (url) => {
      //   setAvatarUrl(url);
      // });
      setAvatarUrl(info.file.response?.data[0]?.filename)
      setAvatarLoading(false);
      form.setFieldsValue({ avatar: info.file.response?.data[0]?.filename });
    }
  };

  const handleChange2: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setBgLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // getBase64(info.file.originFileObj as FileType, (url) => {
      //   setBgUrl(url);
      // });
      setBgUrl(info.file.response?.data[0]?.filename);
      setBgLoading(false);
      form.setFieldsValue({ image: info.file.response?.data[0]?.filename });
    }
  };

  const uploadButton = (loading:boolean)=>{
    return(
      <button style={{ border: 0, background: 'none' }} type="button">
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
      </button>
    )
  };

  return (
    <div className="pt-8 px-4 sm:mx-auto sm:w-full sm:max-w-xl lg:mx-0">
      <div className="bg-white px-2 py-8 pb-2 shadow sm:rounded-lg sm:px-10">
      <Form
          name="normal_useredit"
          onFinish={onSubmit}
          disabled={loading}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          labelAlign="left"
          form={form}
        >

          <FormItem
            name="name"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="昵称" />
          </FormItem>

          
          <FormItem
            label="头像"
            name="avatar"
            valuePropName="avatar" 
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              listType="picture-card"
              showUploadList={false}
              action="/api/post/upload/avatar"
              beforeUpload={beforeUpload}
              maxCount={1}
              onChange={handleChange}
            >
              {
                avatarUrl ? 
                <img src={ AVATARBASEURL + avatarUrl} alt="avatar" style={{ width: '100%' }} /> : 
                uploadButton(avatarLoading)
              }
            </Upload>
          </FormItem>
          <FormItem
            label="背景图片"
            name="image"
            valuePropName="image" 
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              listType="picture-card"
              showUploadList={false}
              action="/api/post/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange2}
              maxCount={1}
            >
              {
                bgUrl ? 
                <img src={ POSTBASEURL + bgUrl} alt="bg" style={{ width: '100%' }} /> : 
                uploadButton(bgLoading)
              }
            </Upload>
          </FormItem>

          <FormItem
            name="remark"
            label="个人签名">
            <TextArea placeholder="个人签名" maxLength={100} />
          </FormItem>

          <Button className="mb-4" type="primary" loading={loading} block htmlType="submit">
            保存
          </Button>
        </Form>

      </div>
    </div>
  )
};
