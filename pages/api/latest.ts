import { getUser, handleLatestGists } from "./gist";

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../app/api/auth/[...nextauth]/route"
import prisma, { Prisma } from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    handleLatestGists(req, res);
}
