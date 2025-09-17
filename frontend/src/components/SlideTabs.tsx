'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Analytics from "../assets/images/Analytics.png"
import Calender from "../assets/images/Calender.png"
import Settings from "../assets/images/Settings.png"
import Generate from "../assets/images/Generate.png"
import './SlideTabs.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const tabs = [
  {
    title: "Dashboard",
    value: "Dashboard",
    content: (
      <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-800 to-purple-900">
        <div className="p-6 md:p-8 flex flex-col rounded-2xl h-full">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Dashboard</h2>
          <div className="flex-1 flex items-center justify-center rounded-md">
            <Image
              src={Analytics}
              alt="Dashboard analytics"
              width={1200}
              height={1200}
              className="object-contain w-full max-h-[65vh] md:max-h-[80vh] rounded-md"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Generate Post",
    value: "Post",
    content: (
      <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-700 to-indigo-900">
        <div className="p-6 md:p-8 flex flex-col h-full">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Generate</h2>
          <div className="flex-1 flex items-center justify-center rounded-md">
            <Image
              src={Generate}
              alt="Generate post"
              width={1200}
              height={1200}
              className="object-contain w-full max-h-[65vh] md:max-h-[80vh] rounded-md"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Schedule",
    value: "calender",
    content: (
      <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-800 to-violet-900">
        <div className="p-6 md:p-8 flex flex-col h-full">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Schedule</h2>
          <div className="flex-1 flex items-center justify-center rounded-md">
            <Image
              src={Calender}
              alt="Schedule calendar"
              width={1200}
              height={1200}
              className="object-contain w-full max-h-[65vh] md:max-h-[80vh] rounded-md"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Settings",
    value: "settings",
    content: (
      <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-violet-700 to-purple-900">
        <div className="p-6 md:p-8 flex flex-col h-full">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Settings</h2>
          <div className="flex-1 flex items-center justify-center rounded-md">
            <Image
              src={Settings}
              alt="Settings screen"
              width={1200}
              height={1200}
              className="object-contain w-full max-h-[65vh] md:max-h-[80vh] rounded-md"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
]

const SlideTabs = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panels = gsap.utils.toArray(".panel")

    // Pin all panels with consistent behavior
    panels.forEach((panel: any, index) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: () => index === panels.length - 1 ? "bottom bottom" : "bottom top",
        pin: true,
        pinSpacing: false,
        markers: false,
        invalidateOnRefresh: true,
      })
    })

    // Refresh ScrollTrigger to ensure proper layout
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="rounded-md w-full min-h-screen bg-purple-700" ref={containerRef}>
      {tabs.map((tab, idx) => (
        <section
          key={idx}
          className={`rounded-md panel h-screen min-h-screen w-full relative ${
            idx === 0
              ? 'bg-purple-600'
              : idx === 2
              ? 'bg-purple-800'
              : 'bg-gradient-to-br from-purple-700 to-indigo-800'
          } ${idx === tabs.length - 1 ? 'rounded-xl overflow-hidden' : ''}`}
          style={{ minHeight: '100vh', height: '100vh' }}
        >
          <div className="h-full min-h-screen w-full flex flex-col items-center justify-center text-white p-4 md:p-8 relative z-[20]">
            <div className="text-center w-full max-w-6xl relative z-[20]">
              <div className="w-full max-w-6xl relative z-[20]">{tab.content}</div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default SlideTabs
