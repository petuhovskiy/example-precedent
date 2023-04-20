'use client';

import Card from "@/components/home/card";
import Balancer from "react-wrap-balancer";
import { DEPLOY_URL } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { nFormatter } from "@/lib/utils";
import CreateGist from "@/components/home/create-gist";
import { useEffect, useState } from "react";
import Gist from "@/components/home/gist";

export default function Home() {
  // useEffect (fetch, )
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/latest')
      .then((response) => response.json())
      .then(it => {
        console.log(it);
        return it;
      })
      .then((data) => {
        if (mounted) {
          setPosts(data);
        }
      })
      .catch((error) => console.error(error));
    return () => { mounted = false; }
  }, []);

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>Latest Gists</Balancer>
        </h1>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {posts.map(it => (
          <Gist
            id={it.gist.id}
            hintData={it.gist}
          />
        ))}
        <CreateGist />
      </div>
    </>
  );
}
