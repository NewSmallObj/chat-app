import getSession from '@/app/action/getSession'
import PostComment from "@/app/user/components/PostComment"
import PostList from '@/app/user/components/PostList'
import PostSegmented from "@/app/user/components/PostSegmented"
import UserInfo from '@/app/user/components/UserInfo'
import { Session } from 'next-auth'
import UserCover from './components/UserCover'

interface HomeProps {
  session: Session | null
}


export default async function Home() {

  const session = await getSession();
  // const currentUser = await getCurrentUser()

  // console.log(session)

  // const data = await getData()  // 服务端直接请求


	return (
		<div className="w-full min-h-full bg-neutral-100">
      <UserCover />
      <UserInfo>
        <PostSegmented showSegmented={true} />
        <PostList />
        <PostComment />
      </UserInfo>
		</div>
	)
}
