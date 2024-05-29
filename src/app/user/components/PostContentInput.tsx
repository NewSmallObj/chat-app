"use client";
import React, { useState } from 'react';
import { Button, Form, Input, message, Radio } from 'antd';
import useComment from '@/app/store/useComment';
import serviceRequest from '@/libs/serviceRequest';
import { URL,PUBSUBCOMMENTKEY } from "@/app/action/stants";
import PubSub from 'pubsub-js';
import { useSession } from 'next-auth/react';
const FormItem = Form.Item;

export default function PostContentInput() {
  const { visible,open,close,currentPost } = useComment();
  const [form] = Form.useForm();
  const session = useSession()

  const fetch = async (postId:string,content:string)=>{
    let {code,data} = await serviceRequest.post<{code:number,data:any}>(`${URL.COMMENT.CREATE_COMMENT}`
      ,
      {
        params:{
          postId,
          content,
          isRead: currentPost?.userId[0]?._id === session.data?.user?.userId ? true : false
        },
        cacheTime:10
      });
      PubSub.publish(PUBSUBCOMMENTKEY, 1);
      close();
      form.resetFields();
      if(code !== 200) return message.error('评论失败')
      return message.success('评论成功')
  }

  const onFinish = async(values: any) => {
    console.log('Success:', values,currentPost);
    if(!values.content) return message.warning("请输入评论内容");
    if(!currentPost?._id) return 
    await fetch(currentPost._id,values.content)
  };

  return (
    <div className='w-full bg-white pb-14 lg:pb-0'>
      {
        visible && (
          <Form
            layout={'inline'}
            form={form}
            className='w-full flex'
            onFinish={onFinish}
          >
            <FormItem name="content" style={{flex:1,marginLeft:'10px',marginBottom:'10px'}}>
              <Input placeholder="说点什么吧..." maxLength={100} />
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">发送</Button>
            </FormItem>
          </Form>
        )
      }
    </div>
  )
}