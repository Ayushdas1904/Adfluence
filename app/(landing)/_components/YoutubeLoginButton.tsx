import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function YoutubeLoginButton() {
  const youtubeLoginUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI}&response_type=code&scope=${encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly")}&access_type=offline&prompt=consent`;

  return (
    <Link href={youtubeLoginUrl}>
      <Button className="bg-red-600 text-white p-7 font-bold text-lg hover:bg-red-500 hover:text-black">
        Sign in with YouTube
      </Button>
    </Link>
  );
}
