"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTwitchAuthorization, getUserId, getClips, Clips } from "./twitch";
import { useSearchParams } from "next/navigation";

export default function Rewind({ params }: { params: { slug: string } }) {
  const [index, setIndex] = useState(0);
  const [clips, setClips] = useState<Clips>({
    data: [],
    pagination: { cursor: "" },
  });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  function handleNextClick() {
    if (index < clips.data.length - 1) {
      setIndex(index + 1);
    }
  }

  function handleBackClick() {
    if (index !== 0) {
      setIndex(index - 1);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const auth = await getTwitchAuthorization();
      if (!auth) {
        setLoading(false);
        setError("Twitch authorization failed");
        return;
      }

      const userId = await getUserId(params.slug, auth);
      if (!userId) {
        setLoading(false);
        setError("Invalid user");
        return;
      }

      const numberOfClips = searchParams.get("numberOfClips");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      // @ts-ignore
      const fetchedClips: Clips = await getClips(userId, auth, numberOfClips, startDate, endDate);

      setClips(fetchedClips);
      setLoading(false);
    }

    fetchData();
  }, [params.slug, searchParams]);

  if (isLoading) {
    return (
      <b className="h-screen m-auto flex justify-center items-center flex-col text-4xl">
        Loading...
      </b>
    );
  } else if (error) {
    return (
      <div className="h-screen m-auto flex justify-center items-center flex-col text-4xl">
        <h1 className="mb-2">Error: {error}</h1>
        <button className="mr-4 ml-4 pr-2 pl-2 rounded border-solid border-4 border-green-500 bg-green-500">
          <Link href="/">Home</Link>
        </button>
      </div>
    );
  } else {
    let clip = clips.data[index];
    const formattedDate = new Date(clip.created_at).toLocaleString();
    return (
      <div>
        <div className="h-screen m-auto flex justify-center items-center flex-col">
          {/* Number of clips and clip embed */}
          <div className="aspect-w-16 aspect-h-9">
            <b>
              {index + 1}/{clips.data.length}
            </b>
            <iframe
              src={clip.embed_url + "&parent=localhost"}
              width="960"
              height="540"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {/* Clip stats */}
          <h1 className="text-2xl">{clip.title}</h1>
          <div className="flex flex-col justify-start items-start text-1xl">
            <p>
              <b>Clipped by: </b>
              {clip.creator_name}
            </p>
            <p>
              <b>Views: </b>
              {clip.view_count}
            </p>
            <p>{formattedDate}</p>
          </div>
          {/* Navigation buttons */}
          <div className="flex-col">
            <button
              onClick={handleBackClick}
              className="mr-4 pr-2 pl-2 rounded border-solid border-4 border-green-500 bg-green-500"
            >
              Back
            </button>
            <button className="mr-4 ml-4 pr-2 pl-2 rounded border-solid border-4 border-green-500 bg-green-500">
              <Link href="/">Home</Link>
            </button>
            <button
              onClick={handleNextClick}
              className="ml-4 pr-2 pl-2 rounded border-solid border-4 border-green-500 bg-green-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}
