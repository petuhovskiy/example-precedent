'use client';

import { Gist } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";

export default function Gist({
    id,
    hintData
}: {
    id: string;
    hintData: Gist | undefined | null;
}) {
    const [data, setData] = useState({gist: hintData ?? {filename: "", content: ""}, editable: false, loading: true});

    const fetchData = async () => {
        const response = await fetch(`/api/gist?id=${id}`);
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to fetch gist');
        }
        const newData = await response.json();
        // newData.gist.content = 'hello world!\n\nseveral lines';
        console.log(newData);

        // update the data only if it's different
        if (newData.gist.content !== data.gist.content || newData.editable !== data.editable || newData.loading !== data.loading || newData.gist.filename !== data.gist.filename) {
            setData(newData);
        }
    };

    useEffect(() => {
        fetchData(); // Call fetchData immediately when component mounts
        const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId);
    }, [data]);

    // const filename = "eduard.js";
    // const content = "Hello world!\n\nconst a = 1;\nconsole.log(a);"

    const [editing, setEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(data.gist.content);

    const handleEditClick = () => {
        setUpdatedContent(data.gist.content);
        setEditing(true);
    };

    const handleCancelClick = () => {
        setEditing(false);
        // setUpdatedContent(content);
    };

    const handleSaveClick = async () => {
        console.log('handle save click');

        // Do something with updatedContent (e.g., save it to a database)
        const response = await fetch(`/api/gist`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                // filename: data.gist.filename,
                content: updatedContent,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to update gist');
        }
        const newData = await response.json();
        console.log('newData', newData);
        setData(newData);
        setEditing(false);
    };

    const handleContentChange = (event: any) => {
        setUpdatedContent(event.target.value);
    };

    return (
        <div className="border border-gray-300 rounded-lg p-4 relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className="font-medium">{data.gist.filename}</div>
                {data.editable ? (!editing ? (
                    <button
                        onClick={handleEditClick}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex">
                        <button
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                )) : null}
            </div>
            {!editing ? (
                <div className="relative">
                <div className="absolute inset-y-0 left-0 w-8 bg-gray-100 text-center">
                  {data.gist.content.split('\n').map((line, index) => (
                    <div key={index} className="text-gray-400 text-sm leading-5 h-5">
                      {index + 1}
                    </div>
                  ))}
                </div>
                <pre className="pl-10 pr-5 whitespace-pre-wrap overflow-x-auto">
                  <code className="language-javascript">{data.gist.content}</code>
                </pre>
              </div>
              
            ) : (
                <textarea
                    value={updatedContent}
                    onChange={handleContentChange}
                    className="w-full h-64 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                />
            )}
        </div>
    );
}
