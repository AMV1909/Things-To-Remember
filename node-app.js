import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import indexRoutes from "./routes/index.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(indexRoutes);

// Starting the server
app.listen(app.get("port"), () =>
    console.log("Server on port", app.get("port"))
);
