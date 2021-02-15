import mongoose from "mongoose";

// optimize this somehow?
export const mongoConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_CONNECTION_STRING_ATLAS as string, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log(
        `Database connected at ${process.env.MONGO_CONNECTION_STRING_ATLAS}`
      );
    })
    .catch((error) => {
      console.log(`Failed to connect to database: ${error}`);
    });
};
