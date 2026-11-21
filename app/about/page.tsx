import Image from 'next/image'
import Link from 'next/link'
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
    role: 'Software Engineer',
    company: 'Hiller Measurements',
    location: 'Austin, TX',
    period: 'Sept 2025 – Present',
    highlights: [
      'Developed automated test applications in Python, LabVIEW, C++, and C to streamline testing processes for high-end custom RF Automated Test Equipment (ATE) and server racks.',
      'Designed and implemented a structured SQL database to store and organize detailed test information and specifications for RF chassis, enhancing data retrieval and traceability.',
      'Created and maintained an RF simulation application to model RF component behavior prior to physical build, built on REACT, Django, and SQL lite.',
      'Built a suite of debugging tools, including Time Domain Reflectometry (TDR) analysis and advanced RF plotting, to aid technicians in pinpointing issues with inch-level precision.',
      'Established version control practices in GitLab across all software projects.',
      'Assist customers on site with debugging, issues, and deployment of test equipment.',
      'Created programs and algorithms to accelerate manufacturing processes using data collected by test programs.',
    ],
  },
  {
    role: 'Test Automation Engineer',
    company: 'Hiller Measurements',
    period: 'Started Feb 2024',
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
      <Navbar current="/about" />
      {/* Header Section */}
      <section className="enter mx-auto mt-16 w-[calc(100%-2rem)] max-w-3xl rounded-[var(--radius-panel)] border border-[color:var(--site-border)] bg-[color:var(--site-surface)] p-5 shadow-lg sm:p-8">
        <h1 className="mb-8 text-center font-[family-name:var(--display-font)] text-5xl tracking-tight">
          About Me
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src="/profile.jpeg"
              alt="Brandon Sullivan"
              width={160}
              height={160}
              className="rounded-full border-4 border-[color:var(--site-accent)]"
            />
          <p className="text-lg text-gray-200 leading-relaxed">
            Hi, I&apos;m <span className="font-semibold">Brandon Sullivan</span>, a <span className="font-semibold">Software Engineer</span> based in <span className="font-semibold">Austin, TX</span>. I love building web applications with <span className="font-semibold">Next.js</span>, crafting robust test suites, and sharing knowledge through blog posts. When I&apos;m not coding, I&apos;m exploring new countries, photographing landscapes, or tinkering with home automation projects.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mx-auto w-[calc(100%-2rem)] max-w-3xl rounded-[var(--radius-panel)] border border-[color:var(--site-border)] bg-[color:var(--site-surface)] p-5 shadow-lg sm:p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Skills & Technologies</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-200">
          {skills.map((skill) => (
            <li key={skill} className="break-words rounded-[var(--radius-card)] bg-[color:var(--site-raised)] px-3 py-2 text-center">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Experience Section */}
      <section className="mx-auto w-[calc(100%-2rem)] max-w-3xl rounded-[var(--radius-panel)] border border-[color:var(--site-border)] bg-[color:var(--site-surface)] p-5 shadow-lg sm:p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Professional Experience</h2>
        <div className="space-y-6">
          {experiences.map((exp) => (
            <article key={exp.role} className="rounded-[var(--radius-card)] bg-[color:var(--site-raised)] p-4 sm:p-6">
              <h3 className="text-2xl font-semibold text-white">{exp.role}</h3>
              <p className="mb-2 text-sm text-[color:var(--site-muted)]">
                {exp.company}{exp.location && <> &middot; {exp.location}</>} &middot; {exp.period}
              </p>
              {exp.highlights ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-gray-200 marker:text-[color:var(--site-accent)]">
                  {exp.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              ) : (
                <p className="text-gray-200">{exp.details}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="mx-auto w-[calc(100%-2rem)] max-w-3xl rounded-[var(--radius-panel)] border border-[color:var(--site-border)] bg-[color:var(--site-surface)] p-5 shadow-lg sm:p-8">
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
        <Link href="mailto:brandon71399@gmail.com" className="inline-block rounded-full bg-[color:var(--site-accent)] px-6 py-3 font-semibold text-[color:var(--site-on-accent)] hover:bg-[color:var(--site-accent-hover)]">
          Get in Touch
        </Link>
      </section>
    </div>
  )
}

export default About
