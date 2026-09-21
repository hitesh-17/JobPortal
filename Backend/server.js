import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const startServer = () => {
  try {
    const port = process.env.PORT;
    connectDB();

    app.get("/", (req, res) => res.send("Hello World!"));
    app.listen(port, () =>
      console.log(`server is running on port ${port}!`),
    );
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();