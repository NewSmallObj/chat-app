export const URL = {
  CONVERSATION : {
    LIST:`/api/conversation`,
    CREATE_CONVERSATION:'/api/conversation',
  },
  USER : {
    LIST:'/api/user',
    CONVERSATION:'/api/user/conversation',
    Edit:'/api/user/edit',
    Follow:'/api/user/following',
    UNREADCOMMENT:'/api/user/unread'
  },
  POST : {
    LIST:'/api/posts',
    CREATE_POST:'/api/posts',
    TOGGLE_LIKE:'/api/posts/like'
  },
  COMMENT : {
    LIST:'/api/comment',
    CREATE_COMMENT:'/api/comment',
  },
}


export const PUBSUBPOSTKEY = "post";
export const PUBSUBCOMMENTKEY = "comment";
export const PUBSUBCOMMENTUNREADKEY = "comment-unread";


export const USERKEY = 'user'
export const CURRENTUSER = 'currentuser'
export const UPDATEUSER = 'updateuser'
export const POSTKEYS = 'posts'
export const POSTKEY = 'post'
export const UNREADCOMMENTKEY = 'unread-comment'




export const BASEURL = "http://192.168.4.155:3000" // http://192.168.3.13:3000
export const AVATARBASEURL = `${BASEURL}/user/avatar/`;
export const POSTBASEURL = `${BASEURL}/user/posts/`