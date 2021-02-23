import mongoose from "mongoose";

let conn: mongoose.Connection;

export const getConnection = async (): Promise<mongoose.Connection> => {
  if (conn == null) {
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
  }
  return conn;
};
