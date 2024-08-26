import { useState } from "react";
import { Clipboard, Check } from "lucide-react"; // Import Clipboard icon
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InfoModal({ input, setOpen, open, data }) {
  const [tickVisible, setTickVisible] = useState({
    did: false,
    privateKey: false,
  });

  const handleCopy = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setTickVisible((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setTickVisible((prev) => ({ ...prev, [type]: false }));
        }, 1000); // Hide the tick after 1 second
      })
      .catch((error) => {
        console.error("Copy failed", error);
        toast.error("Failed to copy to clipboard.");
      });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <div className="w-full flex justify-end"></div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Account Information</DialogTitle>
          <DialogDescription>
            By using the DID you can share your Achievements{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="items-center space-y-4">
          <div className="w-full">
            <div className="flex-1 gap-2 flex items-center w-full">
              <Input id="link" className="w-full" value={data?.did} readOnly />
              <Button
                type="button"
                size="sm"
                className="px-3 cursor-pointer relative"
                onClick={() => handleCopy(data?.did || "", "did")}
              >
                <span className="sr-only">Copy</span>

                {tickVisible.did ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="w-full">
            <div className="gap-2 flex items-center w-full">
              <Input
                id="link"
                className="w-full"
                value={data?.privateKey}
                readOnly
                type="password"
              />
              <Button
                type="button"
                size="sm"
                className="px-3 cursor-pointer relative"
                onClick={() => handleCopy(data?.privateKey || "", "privateKey")}
              >
                <span className="sr-only">Copy</span>

                {tickVisible.privateKey ? (
                  <Check className="top-0 h-4 w-4 text-white" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-red-600 mt-2">
              Please save your private key; you won't be able to see it again.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
