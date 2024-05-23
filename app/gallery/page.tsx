import React from 'react'
import Link from "next/link";

const navigator = [
  { name: "Japan", href: "/gallery/japan" },
]

const Gallery = () => {
  return (
    <div>
            <nav className="my-16">
        <ul className="flex items-center justify-center gap-6">
          {navigator.map((item) => (
            <Link
            key={item.href}
            href={item.href}
            className="text-sm duration-500 text-white hover:text-zinc-300">
            {item.name}
            </Link>
          ))}
        </ul>
        </nav>
    </div>
  )
}

export default Gallery

