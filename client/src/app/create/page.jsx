"use client";
import { InfoModal } from "@/components/InfoModal";
import Steppers from "@/components/Steppers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { comma } from "postcss/lib/list";
import React, { useState } from "react";

export default function page() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);

  async function handlSubmit() {
    const data = {
      link: input,
    };
    console.log(data);
    const res = await axios.post("http://localhost:3001/api/did", data);
    console.log(res);
    if (res.status === 200) {
      setOpen(true);
      setData(res?.data);
    }
  }
  return (
    <section className="p-4 h-screen overflow-hidden w-screen">
      <div className="flex w-full h-full">
        <div className="shrink-0  w-2/5 rounded-lg flex justify-center items-center bg-primary/50">
          <Image
            src={"/main.png"}
            height={100}
            width={100}
            alt="img"
            className="w-full"
          />
        </div>
        <div className="w-3/5 shrink-0 h-full px-8 flex flex-col justify-between">
          <div>
            <h1 className="font-bold text-4xl text-center py-6">
              <p className="text-sm text-primary text-center my-4">
                WEB3 IDENTIITY
              </p>
              Secure and Verifiable Digital Credentials for Everyone
            </h1>
            <p className="text-gray-500 w-10/12 font-normal text-center mx-auto">
              Harness Blockchain Technology for Immutable Digital Identities,
              Streamlined Credential Verification, and Enhanced Data Privacy
            </p>
          </div>

          <Steppers />
          <div>
            <div className="whitespace-nowrap items-center flex gap-8">
              <p>Give Your Link</p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className=" bg-gray-100/30"
                placeholder="Enter your Drive Here"
              />
            </div>

            <Button
              className="px-10 rounded-full mt-8 ml-60 inline-block"
              onClick={handlSubmit}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
      <InfoModal setOpen={setOpen} open={open} data={data} />
    </section>
  );
}
