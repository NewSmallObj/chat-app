import PostList from '@/app/user/components/PostList';
import PostForm from '../components/PostForm';

const Posts = async () => {

  return (
    <div>
      <PostForm placeholder="说点新鲜事吧..." />
      <PostList />
    </div>
  );
};

export default Posts;