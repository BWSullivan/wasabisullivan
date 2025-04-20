import Image from "next/image";
import Link from "next/link";

import Navbar from "./components/navbar";

const navigator = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
  { name: "Hidden", href: "/hidden"},
]
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <h1 className="text-4xl text-transparent bg-white cursor-default  font-display sm:text-2xl md:text-4xl whitespace-nowrap bg-clip-text ">
        Hello, I'm Brandon
      </h1>
      <section>
        
      </section>

      <div className="hidden w-screen " />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500 ">
          Software Developer, Engineer, IT, and Photography
        </h2>
      </div>
    </div>
  );
}
