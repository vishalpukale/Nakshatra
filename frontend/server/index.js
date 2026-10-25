const express = require("express");
const path = require("path");
const app = express();
const chalk = require("chalk");

const DOCS_PATH = "dist";
const PORT = 8002;
const IP_ADRESS = "0.0.0.0";

const root = path.join(__dirname, DOCS_PATH);
app.use(express.static(root));

app.get("/*", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(PORT, IP_ADRESS, () =>
  console.log(`
      =====================================================
      -> Server (${chalk.bgYellow("CSR")}) 🏃 (running) on ${chalk.green(
    IP_ADRESS
  )}:${chalk.green(PORT)}
      =====================================================
    `)
);
