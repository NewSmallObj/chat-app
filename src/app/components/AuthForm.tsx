"use client"

import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoLockOpenOutline } from "react-icons/io5";
import { RiUser5Line } from "react-icons/ri";
const FormItem = Form.Item;

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
};

const BUTTONMAP = {
  login:'登录',
  register:'注册'
}

const REVERSAL_BUTTONMAP = {
  login:'注册',
  register:'登录'
}


export function AuthForm () {
  const router = useRouter();
  const [loading,setLoading] = useState(false);

  const [ type,setType ] = useState<'login'|'register'>('login')

  const changeType = (e:React.MouseEvent)=>{
    e.stopPropagation();
    setType(type==='login'?'register':'login')
  }

  const onSubmit: FormProps<FieldType>['onFinish'] =  async (values)=> {
    if(type === 'register'){
      fetch("/api/register",{
        method:'POST',
        body:JSON.stringify(values)
      })
    }else{
      setLoading(true)
      try{
        const res = await signIn('credentials',{
          username:values.username,
          password:values.password,
          redirect: false
        })
        if (res?.ok) {
          router.push('/user')
        }
      }catch(e){
        console.log(e)
        setLoading(false)
      }finally{
        // 
      }
    }
  }

  return (
    <div className="mt-8 px-4 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 pb-2 shadow sm:rounded-lg sm:px-10">
      <Form
          name="normal_login"
          onFinish={onSubmit}
          disabled={loading}
        >

          <FormItem
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<RiUser5Line />} placeholder="用户名" />
          </FormItem>

          <FormItem
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              prefix={<IoLockOpenOutline />}
              type="password"
              placeholder="密码"
            />
          </FormItem>

          {
            type === 'register' && (
              <FormItem
                name="confirmPassword"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input
                  prefix={<IoLockOpenOutline />}
                  type="confirmPassword"
                  placeholder="确认密码"
                />
              </FormItem>
            )
          }

          <FormItem>
            <Button type="primary" loading={loading} block htmlType="submit" className="login-form-button">
               {BUTTONMAP[type]}
            </Button>
            <Button type="link" onClick={changeType}>{REVERSAL_BUTTONMAP[type]}</Button>
          </FormItem>
        </Form>

      </div>
    </div>
  )
};
