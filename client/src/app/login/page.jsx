"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const [did, setDid] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (response) {
      setOpen(false);
    }
  }, [response]);

  async function handleDIDClick() {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/did/${did}`);
      setResponse(res.data.nonce);
    } catch (error) {
      console.error("Error fetching DID:", error);
      setResponse("Error fetching DID");
    } finally {
      setLoading(false);
    }
  }

  async function handlePrivateKeyClick() {
    try {
      setLoading(true);

      const res = await axios.post(`http://localhost:3001/api/sign`, {
        privateKey,
      });
      const verifyRes = await axios.post(`http://localhost:3001/api/verify`, {
        signedMessage,
        publicKey,
        nonce,
      });
      setResponse(verifyRes.data.message);
      router.push("/succuss");
    } catch (error) {
      console.error("Error handling private key:", error);
      setResponse("Error handling private key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-20">
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h2 className="text-lg font-medium">DID Information</h2>
          </DialogHeader>
          <div className="grid gap-4 full">
            {!response && (
              <div className="items-center gap-4 w-full">
                <div>
                  <Label>Enter Your DID :</Label>
                  <Input
                    placeholder="Enter DID"
                    className="w-full mt-2"
                    value={did}
                    onChange={(e) => setDid(e.target.value)}
                  />
                  <Button
                    className="mt-4 w-full ml-auto rounded-md"
                    onClick={handleDIDClick}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Fetch DID"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {response && (
            <div className="mt-4">
              <p className="font-medium">Nonce :</p>
              <pre className="bg-gray-100 p-4 rounded-md">{response}</pre>
              <div className="mt-4">
                <Label>Enter Your Private Key :</Label>
                <Input
                  placeholder="Enter private key"
                  className="w-full mt-2"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <Button
                  className="mt-4 w-full ml-auto rounded-md"
                  onClick={handlePrivateKeyClick}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Authenticate"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
