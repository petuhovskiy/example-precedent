import Card from "@/components/home/card";
import Balancer from "react-wrap-balancer";
import { DEPLOY_URL } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { nFormatter } from "@/lib/utils";
import CreateGist from "@/components/home/create-gist";
import Gist from "@/components/home/gist";

export default async function GistCard({
    params,
  }: {
    params: { id: string };
  }) {
  return (
    <>
      <div className="z-10 w-full grid grid-cols-6 gap-4">
        <div className="col-start-2 col-span-4">
            <Gist id={params.id} hintData={null}/>
        </div>
      </div>
    </>
  );
}
