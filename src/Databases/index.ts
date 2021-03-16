import mongoose from "mongoose";

let conn: mongoose.Connection;

export const getConnection = async (): Promise<mongoose.Connection> => {
  if (conn == null) {
    console.log("Conn is null. Creating new conn...");
    conn = await mongoose.createConnection(
      process.env.MONGO_CONNECTION_STRING_ATLAS as string,
      {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        bufferMaxEntries: 0
      }
    );
  } else {
    console.log("Using cached conn");
  }
  return conn;
};
