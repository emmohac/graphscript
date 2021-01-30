import mongoose from "mongoose";

export const mongoConnect = async () => {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        console.log(`Database connected at ${process.env.MONGO_CONNECTION_STRING}`);
    }).catch((error) => {
        console.log(`Failed to connect to database: ${error}`);
    });
}