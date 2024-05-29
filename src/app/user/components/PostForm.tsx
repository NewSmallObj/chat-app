"use client";
import { URL } from '@/app/action/stants';
import { useCurrentUser } from "@/app/action/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/Avatar';
import serviceRequest from '@/libs/serviceRequest';
import { PlusOutlined } from '@ant-design/icons';
import { message, UploadFile, UploadProps } from 'antd';
import { Button, Image, Input, Upload } from 'antd';
import { flattenDeep } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import {PUBSUBPOSTKEY,BASEURL} from "@/app/action/stants"
import { AVATARBASEURL,POSTBASEURL } from "@/app/action/stants"
import PubSub from 'pubsub-js';
const { TextArea } = Input;

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}


const uploadButton = (
  <button style={{ border: 0, background: 'none' }} type="button">
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>上传</div>
  </button>
);

const PostForm:React.FC<FormProps> = ({
  placeholder,
  isComment,
  postId
}) => {

  const {currentUser} = useCurrentUser();
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const images = useMemo(()=>{
    if(!fileList.length) return []
    return flattenDeep(fileList.map((v)=>v.response?.data?.map((s:any)=>`${s.filename}`)))
  },[fileList])

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);


  const fetchCreate = async (images:string[],body:string)=>{
    return await serviceRequest.post<{code:number,msg:string}>(URL.POST.CREATE_POST
      ,{params:{
        images,
        body
      },cacheTime:10})
  }

  const onSubmit = useCallback(()=>{
    console.log('onSubmit',images)
    if(!body) return message.warning('请输入内容')
    fetchCreate(images,body).then(({code,msg})=>{
      if(code === 200){
        setBody('');
        setFileList([]);
        PubSub.publish(PUBSUBPOSTKEY, 1);
      }
    })
    
  },[postId,body,isComment,images])

  return (
    <div className="border-b-[1px] border-neutral-200 px-5 py-2">
      <div className="flex flex-row gap-4">
        <div className='hidden md:block'>
          <Avatar className='md:h-12 md:w-12 rounded-md'>
            <AvatarImage className='md:h-12 md:w-12 rounded-md'
            src={ AVATARBASEURL + currentUser?.avatar || ''} 
            alt="@shadcn" />
            <AvatarFallback>{currentUser?.username?.substring(0, 1)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <TextArea
            showCount
            maxLength={100}
            onChange={(event) => setBody(event.target.value)}
            value={body}
            placeholder={placeholder}
            className="md:text-[16px] mb-4"
            disabled={isLoading}
            style={{ height: 120, resize: 'none' }}
          />
          <Upload
            action="/api/post/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={ POSTBASEURL + previewImage}
            />
          )}
          <div className="mt-4 flex flex-row justify-end">
            <Button disabled={isLoading || !body} onClick={onSubmit}>发送</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;