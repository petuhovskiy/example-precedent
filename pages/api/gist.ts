import { getServerSession } from "next-auth/next"
import { authOptions } from "../../app/api/auth/[...nextauth]/route"
import prisma, { Prisma } from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from 'next'

export async function getUser(req: NextApiRequest, res: NextApiResponse): Promise<any | null> {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user?.email ?? "",
        }
    });
    return user;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // console.log('here', req, res);
    const user = await getUser(req, res);

    if (req.method === "GET") {
        handleGetGist(req, res, user);
    } else if (req.method === "POST") {
        handlePostGist(req, res, user);
    } else if (req.method === "PUT") {
        handlePutGist(req, res, user);
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
}

export async function handleLatestGists(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUser(req, res);

    const gists = await prisma.gist.findMany({
        orderBy: {
            updatedAt: "desc",
        },
        take: 10,
    });

    res.send(gists.map((gist: any) => gistResponse(gist, user)));
}

async function handleGetGist(req: NextApiRequest, res: NextApiResponse, user: any) {
    const { id } = req.query;

    const gist = await prisma.gist.findUnique({
        where: {
            id: id+'',
        },
    });

    if (!gist) {
        res.status(404).send({ error: "Gist not found" });
        return;
    }

    res.send(gistResponse(gist, user));
}

function gistResponse(gist: any, user: any) {
    return {
        gist: gist,
        editable: user?.id === gist.authorId,
    };
}

async function handlePostGist(req: NextApiRequest, res: NextApiResponse, user: any) {
    if (!user) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const jsonReq = req.body;
    const { filename, content } = jsonReq;

    const gist = await prisma.gist.create({
        data: {
            filename: filename,
            content: content,
            authorId: user.id,
        },
    });
    
    res.send(gistResponse(gist, user));
}

async function handlePutGist(req: NextApiRequest, res: NextApiResponse, user: any) {
    if (!user) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const jsonReq = req.body;
    const { id, filename, content } = jsonReq;
    // const id = jsonReq["id"];
    // const filename = jsonReq["filename"];
    // const content = jsonReq["content"];
    console.log(jsonReq, id, filename, content);

    const gist = await prisma.gist.findUnique({
        where: {
            id: id+'',
        },
    });
    console.log(gist, id+'');

    if (gist?.authorId !== user.id) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const update: any = {};
    if (filename) {
        update["filename"] = filename+'';
    }
    if (content) {
        update["content"] = content+'';
    }

    const updatedGist = await prisma.gist.update({
        where: {
            id: id+'',
        },
        data: update,
    });

    res.send(gistResponse(updatedGist, user));
}
