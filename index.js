import express from "express";
import bodyParser from "body-parser";
import Web3 from "web3";
import crypto from "crypto";
import { createHelia } from "helia";
import { json } from "@helia/json";

const helia = await createHelia();
const j = json(helia);

const app = express();
const web3 = new Web3(
  "https://mainnet.infura.io/v3/5ff45606ee714bf6adcc5811a31b3699"
);

// Middleware
app.use(bodyParser.json());

// Mock contract setup (replace with actual contract ABI and address)
// const contractABI = [
//   /* ABI of DIDRegistry contract */
// ];
// const contractAddress = "0x..."; // Address of DIDRegistry contract
// const contract = new web3.eth.Contract(contractABI, contractAddress);

// Route to create a DID
app.post("/api/did", async (req, res) => {
  try {
    const did = `did:example:${crypto.randomBytes(16).toString("hex")}`;
    const userAddress = "0xA0C8fED4B2D559cFFA2Bd193b8b5A964F3A35349"; // Replace with actual user address

    const didDocument = {
      "@context": "https://www.w3.org/ns/did/v1",
      id: did,
      publicKey: [
        {
          id: `${did}#keys-1`,
          type: "Ed25519VerificationKey2018",
          controller: did,
          publicKeyBase58: "base58-public-key-here", // Replace with actual public key
        },
      ],
      authentication: [
        {
          type: "Ed25519SignatureAuthentication2018",
          publicKey: `${did}#keys-1`,
        },
      ],
    };

    // Add the DID Document to IPFS using Helia's JSON module
    const cid = await j.add(didDocument);
    console.log("Stored CID:", cid.toString());

    // Retrieve the DID Document from IPFS using Helia's JSON module
    const retrievedDidDocument = await j.get(cid);
    console.log("Retrieved DID Document:", retrievedDidDocument);

    await contract.methods
      .addDID(did, cid.toString())
      .send({ from: userAddress });

    res.json({ message: "DID created successfully", did, cid: cid.toString() });
  } catch (error) {
    console.error("Error creating DID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/did/:id", async (req, res) => {
  const did = req.params.id;

  try {
    const cid = await contract.methods.resolveDID(did).call();

    if (!cid) {
      return res.status(404).json({ error: "DID not found" });
    }

    // Retrieve the DID Document from IPFS using Helia's JSON module
    const didDocument = await j.get(cid);

    res.json({ did, document: didDocument });
  } catch (error) {
    console.error("Error retrieving DID document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server setup
app.listen(3000, () => console.log("Server running on port 3000"));
