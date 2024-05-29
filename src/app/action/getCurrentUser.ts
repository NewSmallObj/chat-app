import getSession from "./getSession";
import dbConnect from "@/app/db/dbConnect";
import User from "@/app/db/models/user"
dbConnect();

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.userId) {
      return null;
    }

    const currentUser = await User.findById(session.user.userId);

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
