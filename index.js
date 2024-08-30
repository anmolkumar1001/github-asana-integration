const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const ASANA_ACCESS_TOKEN =
  "2/1208169047661145/1208169449754970:fecd74018e5ebfda6217253c4b37856b";
const ASANA_WORKSPACE_ID = "1208169047661145";

// GitHub Webhook Secret
const GITHUB_SECRET = "ce69c908e01b25a8a59f4cf7ffd10ac9303d165f";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to verify the GitHub webhook signature
function verifySignature(req, res, buf, encoding) {
  const signature = req.headers["x-hub-signature-256"];
  const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
  hmac.update(buf, encoding);
  const expectedSignature = `sha256=${hmac.digest("hex")}`;

  if (signature !== expectedSignature) {
    throw new Error("Invalid signature.");
  }
}

// Middleware for signature validation
app.use(bodyParser.json({ verify: verifySignature }));

// Endpoint to receive GitHub webhook events
app.post("/webhook", async (req, res) => {
  console.log("Received request:", req.body);

  const { action, issue } = req.body;

  // Only handle "opened" issues
  if (action === "opened") {
    console.log("Processing issue:", issue);

    const taskName = issue.title;
    const taskDescription = issue.body || "No description provided";
    const taskId = issue.html_url;
    const assignee = issue.user.login;

    try {
      // Make a request to Asana API to create a task
      const response = await axios.post(
        "https://app.asana.com/api/1.0/tasks",
        {
          data: {
            name: taskName,
            notes: `Description: ${taskDescription}\nGitHub Issue: ${taskId}`,
            assignee: assignee,
            workspace: ASANA_WORKSPACE_ID,
            due_on: new Date().toISOString().split("T")[0], // Optional: Set a default due date
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ASANA_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Task created in Asana: ${response.data.data.name}`);
      res.status(200).send("Task created in Asana");
    } catch (error) {
      console.error("Error creating task in Asana:", error.message);
      res.status(500).send("Failed to create task in Asana");
    }
  } else {
    console.log("Event ignored due to action:", action);
    res.status(200).send("Event ignored");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
