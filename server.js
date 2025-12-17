// server.js
import express from "express";
import fetch from "node-fetch";
import msal from "@azure/msal-node"; // msal-node

const app = express();
app.use(express.json());

const {
  CLIENT_ID,
  CLIENT_SECRET,
  TENANT_ID,
  PORT = 3001
} = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID) {
  console.error("Set CLIENT_ID, CLIENT_SECRET, TENANT_ID in env");
  process.exit(1);
}

const cca = new msal.ConfidentialClientApplication({
  auth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`
  }
});

// scope for Power BI REST API (client credentials)
const TOKEN_SCOPES = ["https://analysis.windows.net/powerbi/api/.default"];

async function getAccessToken() {
  const resp = await cca.acquireTokenByClientCredential({ scopes: TOKEN_SCOPES });
  return resp.accessToken;
}

// GET /api/powerbi/datasets  -> returns list of datasets in user's organization
app.get("/api/powerbi/datasets", async (req, res) => {
  try {
    const token = await getAccessToken();
    const r = await fetch("https://api.powerbi.com/v1.0/myorg/datasets", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
    const data = await r.json();
    // data.value is list of datasets
    res.json(data.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err.toString() });
  }
});

app.listen(PORT, () => console.log("Server listening on port", PORT));
