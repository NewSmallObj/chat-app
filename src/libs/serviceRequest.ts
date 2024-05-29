// import getSession from '@/app/action/getSession';
import qs from 'qs';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Params {
  cacheTime?: number; //缓存时间，单位为s。默认强缓存，0为不缓存
  params?: Record<string, any>;
}

interface Props extends Params {
  url: string;
  method: Method;
  token?:string;
}

type Config = { next: { revalidate: number } } | { cache: 'no-store' } | { cache: 'force-cache' };

class Request {
  /**
   * 请求拦截器
   */
  interceptorsRequest({ url, method, params, cacheTime,token }: Props) {
    let queryParams = ''; //url参数
    let requestPayload = ''; //请求体数据

    //请求头
    const headers = {
      authorization: `Bearer ${token}`,
    };

    const config: Config =
      cacheTime || cacheTime === 0
        ? cacheTime > 0
          ? { next: { revalidate: cacheTime } }
          : { cache: 'no-store' }
        : { cache: 'force-cache' };

    if (method === 'GET' || method === 'DELETE') {
      //fetch对GET请求等，不支持将参数传在body上，只能拼接url
      if (params) {
        queryParams = qs.stringify(params);
        url = `${url}?${queryParams}`;
      }
    } else {
      //非form-data传输JSON数据格式
      if (!['[object FormData]', '[object URLSearchParams]'].includes(Object.prototype.toString.call(params))) {
        Object.assign(headers, { 'Content-Type': 'application/json' });
        requestPayload = JSON.stringify(params);
      }
    }
    return {
      url,
      options: {
        method,
        headers,
        body: method !== 'GET' && method !== 'DELETE' ? requestPayload : undefined,
        ...config,
      },
    };
  }

  /**
   * 响应拦截器
   */
  interceptorsResponse<T>(res: Response): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestUrl = res.url;
      if (res.ok) {
        return resolve(res.json() as Promise<T>);
      } else {
        res
          .clone()
          .text()
          .then((text) => {
            try {
              const errorData = JSON.parse(text);
              return reject({ message: errorData || '接口错误', url: requestUrl });
            } catch {
              return reject({ message: text, url: requestUrl });
            }
          });
      }
    });
  }

  async httpFactory<T>({ url = '', params = {}, method }: Props): Promise<T> {
    // const seeion = await getSession()
    const req = this.interceptorsRequest({
      url: `${process.env.BASEURL || ''}${url}`,
      method,
      params: params.params,
      cacheTime: params.cacheTime,
      // token:seeion?.user?.access_token!
    });
    const res = await fetch(req.url, req.options);
    return this.interceptorsResponse<T>(res);
  }

  async request<T>(method: Method, url: string, params?: Params): Promise<T> {
    return this.httpFactory<T>({ url, params, method });
  }

  get<T>(url: string, params?: Params): Promise<T> {
    return this.request('GET', url, params);
  }

  post<T>(url: string, params?: Params): Promise<T> {
    return this.request('POST', url, params);
  }

  put<T>(url: string, params?: Params): Promise<T> {
    return this.request('PUT', url, params);
  }

  delete<T>(url: string, params?: Params): Promise<T> {
    return this.request('DELETE', url, params);
  }

  patch<T>(url: string, params?: Params): Promise<T> {
    return this.request('PATCH', url, params);
  }
}

const request = new Request();

export default request;



// return fetch(
  //     CATEGORYURL.LIST,
  //     {
  //       // cache:'no-store', // 不缓存数据
  //       next:{
  //         revalidate:36000 // 缓存数据36000秒
  //       },
  //       method:'post',
  //       body:JSON.stringify(
  //       {
  //         pageNum:1,
  //         pageSize:10,
  //         level:'',
  //         reporter:1,
  //         total:24
  //       }),
  //       headers:{
  //         Authorization: `Bearer ${session?.user?.access_token}`,
  //         'Content-Type': 'application/json'
  //       },
  //     }, 
  //   )
  //   .then(res=>res.json())
    // .then(data=>console.log(data))