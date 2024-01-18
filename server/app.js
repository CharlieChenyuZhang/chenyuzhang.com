const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors()); // This will enable CORS for all routes
const matter = require("gray-matter");
const port = 3001;

app.get("/api/blog/all", (req, res) => {
  const mdDirectory = path.join(__dirname, "blogs"); // Adjust the path as necessary

  fs.readdir(mdDirectory, (err, files) => {
    if (err) {
      console.error("Error reading directory: ", err);
      return res.status(500).send({ error: "Error reading directory" });
    }

    let results = {};
    let filesProcessed = 0;

    files.forEach((file) => {
      const filePath = path.join(mdDirectory, file);
      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          console.error("Error reading file: ", err);
          return res.status(500).send({ error: `Error reading file: ${file}` });
        }

        const parsed = matter(content);

        if (parsed?.data?.published) {
          results[file] = parsed;
        }

        filesProcessed++;
        if (filesProcessed === files.length) {
          res.send(results);
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
