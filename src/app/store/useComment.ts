import { create } from 'zustand';
import { PostType } from '../db/models/post';
interface CommentStore {
  visible:boolean,
  currentPost:PostType | null,
  open:() => void,
  close:() => void,
  setCurrentPost:(post: PostType) => void,
}

const useComment = create<CommentStore>((set) => ({
  visible:false,
  open:() => set({ visible:true }),
  close:() => set({ visible:false,currentPost:null }),
  currentPost:null,
  setCurrentPost: (post: PostType) => set({ currentPost: post }),
}));

export default useComment;