const YouTubeEmbed = ({ videoUrl }: { videoUrl: string }) => {
  // Extract Video ID (e.g., "WDIpL0pjun0" from "https://www.youtube.com/watch?v=WDIpL0pjun0")
  const videoId = videoUrl.split("v=")[1]?.split("&")[0];

  if (!videoId) return <p>Invalid YouTube URL</p>;

  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default YouTubeEmbed;