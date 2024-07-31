import { app } from "./app";
import { router } from "./route";

const PORT = 3333;
app.use("/chainsaw", router);
app.listen(PORT, () =>
  console.log(`Server already is running on port ${PORT}!`)
);
