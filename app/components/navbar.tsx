import Link from 'next/link'

const navigator = [
  { name: 'About',   href: '/about'   },
  { name: 'Projects',href: '/projects'},
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
  { name: 'Hidden',  href: '/hidden'  },
]

export default function Navbar() {
  return (
    <nav className="my-8">
      <ul className="flex items-center justify-center gap-8">
        {navigator.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-white duration-200 hover:text-zinc-300"
          >
            {item.name}
          </Link>
        ))}
      </ul>
    </nav>
  )
}
