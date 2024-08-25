const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const { create } = require("ipfs-http-client");
const crypto = require("crypto");

const app = express();
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

// Initialize IPFS client
const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });

// Middleware
app.use(bodyParser.json());

// Mock contract setup (replace with actual contract ABI and address)
const contractABI = [
  /* ABI of DIDRegistry contract */
];
const contractAddress = "0x..."; // Address of DIDRegistry contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Route to create a DID
app.post("/api/did", async (req, res) => {
  try {
    // Generate a unique DID (can be more sophisticated)
    const did = `did:example:${crypto.randomBytes(16).toString("hex")}`;
    const userAddress = req.body.address;

    // Create a DID Document (example structure)
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

    const { path: cid } = await ipfs.add(JSON.stringify(didDocument));

    await contract.methods.addDID(did, cid).send({ from: userAddress });
    res.json({ message: "DID created successfully", did, cid });
  } catch (error) {
    console.error("Error creating DID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/did/:id", async (req, res) => {
  const did = req.params.id;

  try {
    // Call smart contract to get CID
    const cid = await contract.methods.resolveDID(did).call();

    if (!cid) {
      return res.status(404).json({ error: "DID not found" });
    }

    // Retrieve DID Document from IPFS
    const stream = ipfs.cat(cid);
    let data = "";

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    const didDocument = JSON.parse(data);

    // Respond with DID Document
    res.json({ did, document: didDocument });
  } catch (error) {
    console.error("Error retrieving DID document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server setup
app.listen(3000, () => console.log("Server running on port 3000"));
