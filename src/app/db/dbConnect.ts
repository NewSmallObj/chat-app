import mongoose from "mongoose";

const dbConnect = () => {
  if(mongoose.connection?.readyState >= 1) return;
      mongoose.connect(process.env.DB_URI!, {}).then(con => {
      console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
  })
}

export default dbConnect;