import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A Good Death",
    short_name: "A Good Death",
    description:
      "How long do you survive medieval England? Build a peasant, watch them die, share the parish record.",
    start_url: "/",
    display: "standalone",
    background_color: "#cdb98f",
    theme_color: "#cdb98f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
