import mongoose from "mongoose";
const dbName = "mini-amazon";
const dbUserName = "luintelutsav5";
const dbPassword = encodeURIComponent("ctkfmvEKd68ZoD17");
const dbHost = "cluster0.pwyby.mongodb.net";
const dbOptions = "retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    const URL = `mongodb+srv://${dbUserName}:${dbPassword}@${dbHost}/${dbName}?${dbOptions}`;
    await mongoose.connect(URL);
    console.log("Connected to Database....");
  } catch (error) {
    console.log("connection failed ......");
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
