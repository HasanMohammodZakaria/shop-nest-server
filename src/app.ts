import express, { Application, Request, Response } from "express";
import cors from "cors";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import routes from "./routes";



const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "ShopNest Backend API is running",
    data: null,
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;