'use client';
import { useState } from 'react';
import useSendMessage from "@/app/action/useSendMessage";
import { Input,Upload,message as Message,Button } from 'antd';
import type { FormProps, GetProp, UploadProps } from 'antd';
import { useParams } from 'next/navigation';
import {
  HiPaperAirplane,
  HiPhoto
} from "react-icons/hi2";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const Form = () => {
  const { loading, sendMessage } = useSendMessage();
  const [message,setMessage] = useState('')
  const params = useParams();

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      Message.error('只可以上传JPG/PNG文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Message.error('图片应小于2M');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      sendMessage({ 
        message:'图片',
        image:info.file.response?.data[0]?.filename,
        conversationId:params.conversationId[0],
        receiverId:params.conversationId[1],
      });
    }
  };

  const onSubmit = () => {
    if(!message) return
    sendMessage({ 
      message:message,
      conversationId:params.conversationId[0],
      receiverId:params.conversationId[1],
    });
    setMessage('')
  }
  
  return (
    <div className="
      py-4
      px-4
      bg-white
      border-t
      flex
      items-center
      gap-2
      lg:gap-4
      w-full
    ">
      <Upload
          name="file"
          listType="text"
          showUploadList={false}
          action="/api/post/upload"
          beforeUpload={beforeUpload}
          maxCount={1}
          onChange={handleChange}
        >
          <HiPhoto size={30} className="text-sky-500" />
      </Upload>
      <Input placeholder="说点什么吧.." onChange={(e)=>setMessage(e.target.value)} onPressEnter={onSubmit}/>
      <button disabled={loading}
        onClick={onSubmit}
        className="
          rounded-full 
          p-2 
          bg-sky-500 
          cursor-pointer 
          hover:bg-sky-600 
          transition
        ">
        <HiPaperAirplane
          size={18}
          className="text-white"
        />
      </button>
    </div>
  );
};

export default Form;