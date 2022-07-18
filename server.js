const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 8080;

connectDatabase();

app.listen(PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
