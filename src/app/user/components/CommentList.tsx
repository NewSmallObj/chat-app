import type { CommentType } from "@/app/db/models/comment";
import CommentItem from './CommentItem';

interface CommentListProps {
  comments?: CommentType[];
}

const CommentList: React.FC<CommentListProps> = ({ comments = [] }) => {
  return (
    <>
      {comments.map((comment,) => (
        <CommentItem key={comment._id} data={comment} />
      ))}
    </>
  );
};

export default CommentList;
