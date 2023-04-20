'use client';

import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";
import { useState } from 'react';
// import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';


export function InputForm() {
  const [inputValue, setInputValue] = useState('');
  // const { data: session } = useSession();
  // const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/gist', {
        method: 'POST',
        body: JSON.stringify({
          filename: inputValue,
          content: 'Hello World',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to create gist');
      }
      const data = await response.json();
      console.log(data);

      // Reset input value after successful submission
      setInputValue('');
      window.location.replace("/gist/" + data.gist.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter filename here"
          className="border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="bg-black text-white rounded-r-lg py-2 px-4 hover:bg-gray-900"
          // disabled={!session}
        >
          Create
        </button>
      </form>
    </div>
  );
}


export default function CreateGist() {
  return (
    <div
      className={`relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md`}
    >
      <div className="flex h-60 items-center justify-center">
        <InputForm />
      </div>
      <div className="mx-auto max-w-md text-center">
        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
          <Balancer>Create Gist</Balancer>
        </h2>
        <div className="prose-sm -mt-2 leading-normal text-gray-500 md:prose">
          <Balancer>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                    className="font-medium text-gray-800 underline transition-colors"
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    // @ts-ignore (to fix "Received `true` for a non-boolean attribute `inline`." warning)
                    inline="true"
                    className="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800"
                  />
                ),
              }}
            >
              Enter filename and press a button to create a gist.
            </ReactMarkdown>
          </Balancer>
        </div>
      </div>
    </div>
  );
}
