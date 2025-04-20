import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '../components/navbar'

const skills = [
  'Python/Django',
  'React',
  'Next.js',
  'Node.js',
  'C++/C',
  'Swift',
  'Typescript',
  'Git',
  'SQL',
  'Ruby',
  'HTML/CSS',
  'JavaScript',
]

const experiences = [
  {
    role: 'Test Automation Engineer',
    company: 'Hiller Measurements',
    period: 'Feb 2024 - Present',
    details: 'Developed automated test applications in Python, LabVIEW, C++, and C to streamline testing processes for high-end custom RF Automated Test Equipment (ATE) and server racks. Maintained an RF simulation application to model RF component behavior prior to physical build, built on REACT, Django, and SQL lite.',
  },
  {
    role: 'Japanese Language Internship',
    company: 'Kyorin University',
    period: 'Summer 2023',
    details: 'Created methods and programs to effectively teach English to first-year Japanese university students.',
  },
  {
    role: 'Student Worker',
    company: 'Texas Transportation Institute',
    period: 'Jan 2023 - May 2023',
    details: 'Worked on a Road mapping project using Google Maps and Earth, with analysis completed in Excel.',
  },
  {
    role: 'Inventory Management',
    company: 'Firefly Aerospace',
    period: 'Dec 2019 - Jun 2020',
    details: 'Created automated software in Python to speed up processes and connect the ERP to automate inventory entries.',
  },
  {
    role: 'Assistant Software Engineer',
    company: 'Astral Images',
    period: 'Jun 2019 - Dec 2019',
    details: 'Assisted lead developers who created and managed image and film restoration applications and algorithms. Helped convert a native 32-bit application plugin to 64-bit during OSX transition.',
  },
  {
    role: 'Social Media Assistant Manager',
    company: '1st Detect',
    period: 'Jan 2018 - Jun 2019',
    details: 'Released press releases to the general public through websites and major social media platforms. Part-time full stack developer for company websites through WordPress.',
  },
]

const About = () => {
  return (
    <div className="space-y-16">
      <Navbar />
      {/* Header Section */}
      <section className="max-w-3xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg mt-16">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-600 text-center mb-8">
          About Me
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src="/profile.jpeg"
              alt="Brandon Sullivan"
              width={160}
              height={160}
              className="rounded-full border-4 border-blue-500"
            />
          <p className="text-lg text-gray-200 leading-relaxed">
            Hi, I&apos;m <span className="font-semibold">Brandon Sullivan</span>, a <span className="font-semibold">Test Automation Engineer</span> based in <span className="font-semibold">Austin, TX</span>. I love building web applications with <span className="font-semibold">Next.js</span>, crafting robust test suites, and sharing knowledge through blog posts. When I&apos;m not coding, I&apos;m exploring new countries, photographing landscapes, or tinkering with home automation projects.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Skills & Technologies</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-200">
          {skills.map((skill) => (
            <li key={skill} className="px-4 py-2 bg-gray-700 rounded-lg text-center">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Experience Section */}
      <section className="max-w-3xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Professional Experience</h2>
        <div className="space-y-6">
          {experiences.map((exp) => (
            
            <div key={exp.role} className="bg-gray-800 p-6 rounded-2xl">
              <h3 className="text-2xl font-semibold text-white">{exp.role}</h3>
              <p className="text-sm text-gray-400 mb-2">{exp.company} &middot; {exp.period}</p>
              <p className="text-gray-200">{exp.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Fun Facts</h2>
        <ul className="list-disc list-inside text-gray-200 space-y-2">
          <li>I&apos;ve visited almost 10 different countries!</li>
          <li>I have a shrimp tank with over 30 nano shrimp!</li>
          <li>I&apos;m a car enthusiast that visits cars and coffee around Austin!</li>
        </ul>
      </section>

      {/* Contact CTA */}
      <section className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s work together</h2>
        <p className="text-gray-300 mb-6">
          I&apos;m open to new opportunities and collaborations. Feel free to reach out!
        </p>
        <Link href="mailto:brandon71399@gmail.com" className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-full transition">
          Get in Touch
        </Link>
      </section>
    </div>
  )
}

export default About