import "./database/db.js";

import { app } from "./app.js";

// Start server
app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});
