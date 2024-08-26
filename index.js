import express from "express";
import bodyParser from "body-parser";
import Web3 from "web3";
import crypto from "crypto";
import { createHelia } from "helia";
import { json } from "@helia/json";
import cors from "cors";
import { ethers } from "ethers";
import fs from "fs-extra";
import dotenv from "dotenv";
import { ContractAbi } from "./lib";

dotenv.config();

const helia = await createHelia({
  repo: "./ipfs-repo",
  libp2p: {
    transportManager: {
      listen: ["/ip4/127.0.0.1/tcp/5001"],
    },
  },
});

const j = json(helia);

const web3 = new Web3(env.process.WEB3_URL);

const abi = ContractAbi;

const app = express();
app.use(bodyParser.json());

app.use(cors("*"));

// Route to create a DID
app.post("/api/did", async (req, res) => {
  try {
    const link = req.body.link;
    console.log(req.body);
    if (!link) {
      return res.status(400).json({ error: "Link is required" });
    }

    const did = `did:ethr:${crypto.randomBytes(16).toString("hex")}`;
    console.log("DID:", did);
    const privateKey = crypto.randomBytes(32).toString("hex");
    console.log("private key :", privateKey);

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
      link: link,
    };

    // Add the DID Document to IPFS using Helia's JSON module
    const cid = await j.add(didDocument);
  

    const retrievedDidDocument = await j.get(cid);
  

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contractWithSigner = contract.connect(wallet);

    const res = await contractWithSigner.addUser(did, link, privateKey);

    const value = await contractWithSigner.on("UserAdded", (did, key) => {
      res.status(200, json.toString({ did, key }));
    });

    res.json({ message: "DID created successfully", did, privateKey });
  } catch (error) {
    console.error("Error creating DID:", error);
  }
});

// Route to resolve a DID
app.get("/api/did/:id", async (req, res) => {
  try {
    const cid = await contract.methods.resolveDID(did).call();

    if (!cid) {
      return res.status(404).json({ error: "DID not found" });
    }

    // Retrieve the DID Document from IPFS using Helia's JSON module
    const didDocument = await j.get(cid);

    if (!didDocument || !didDocument.publicKey) {
      return res
        .status(404)
        .json({ error: "DID Document or public key not found" });
    }

    // Generate a nonce 
    const nonce = crypto.randomBytes(16).toString("hex");

    const publicKey = didDocument.publicKey[0].publicKeyBase58;

    res.json({ nonce });
  } catch (error) {
    console.error("Error retrieving DID document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/sign", (req, res) => {
  try {
    const { privateKey, nonce } = req.body;

    if (!privateKey || !nonce) {
      return res
        .status(400)
        .json({ error: "Private key and nonce are required" });
    }

    // Sign the nonce with the private key using Web3
    const { signature } = web3.eth.accounts.sign(nonce, privateKey);

    res.json({ signature });
  } catch (error) {
    console.error("Error signing nonce:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/verify", async (req, res) => {
  const { signedMessage, publicKey, nonce } = req.body;

  try {
    // Validate the inputs
    if (!signedMessage || !publicKey || !nonce) {
      return res
        .status(400)
        .json({ error: "Signed message, public key, and nonce are required" });
    }
    const { message, signature } = signedMessage;
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    const publicKeyAddress =
      web3.eth.accounts.privateKeyToAccount(publicKey).address;

    // Compare recovered address with the provided public key address
    if (recoveredAddress.toLowerCase() === publicKeyAddress.toLowerCase()) {
      res.json({ verified: true });
    } else {
      res.status(401).json({ error: "Signature verification failed" });
    }
  } catch (error) {
    console.error("Error verifying signed nonce:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server setup
app.listen(3001, () => console.log("Server running on port 3000"));
