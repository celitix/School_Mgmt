import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import "dotenv/config";
// import authRoutes from "./routes/auth.router";
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/api/auth", authRoutes);
app.use((res, req, next) => {
    const error = new Error("Route not found.");
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    return res
        .status(err.status || 500)
        .json({ message: err.message || "Internal Server Error", status: false });
});
app.use("/", (req, res) => {
    return res.status(200).json({ message: "Welcome" });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
