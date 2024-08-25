const express = require("express");
const app = express();
const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

app.get("/api/did/:id", async (req, res) => {
  const did = req.params.id;
  // Call smart contract to get DID document
  // Example: const didDocument = await contract.methods.resolveDID(did).call();
  res.json({ did, document: "DID Document here" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
