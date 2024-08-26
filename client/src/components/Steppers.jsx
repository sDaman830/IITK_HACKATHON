import { CirclePlus } from "lucide-react";
import React from "react";

function Steppers() {
  return (
    <ol class="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse justify-between">
      <li class="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
        <span class="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          1
        </span>
        <span>
          <h3 class="font-medium leading-tight">Add Your Links</h3>
          <p class="text-sm">Enter the links you want to store.</p>
        </span>
      </li>
      <li class="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
        <span class="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
          2
        </span>
        <span>
          <h3 class="font-medium leading-tight">Retrieve Your Credentials</h3>
          <p class="text-sm">Copy your private key and DID for future use.</p>
        </span>
      </li>
      <li class="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
        <span class="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
          3
        </span>
        <span>
          <h3 class="font-medium leading-tight">Utilize Your DID</h3>
          <p class="text-sm">
            Use your DID to access and manage your centralized data.
          </p>
        </span>
      </li>
    </ol>
  );
}

export default Steppers;
