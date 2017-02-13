import express from "express";
import { Application } from "express";
import { MainRouter } from "./routes";
import { loadErrorHandlers } from "./utilities/error-handling";
import helmet from "helmet";
import compression from "compression";

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", MainRouter);

loadErrorHandlers(app);

export default app;
