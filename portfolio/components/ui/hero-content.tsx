"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/lib/motion";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col xl:flex-row items-center justify-center
  px-6 md:px-10 xl:px-20
  pt-[100px] sm:pt-[145px] md:pt-[190px] xl:pt-[180px]
  w-full z-[20] gap-12"

    >
      {/* LEFT: portrait */}
      <motion.div
        variants={slideInFromLeft(0.8)}
        className="w-full xl:w-1/2 flex justify-center items-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[420px] lg:h-[420px]"
        >
          {/* ambient glow */}
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(124,58,237,0.4),transparent_60%)] blur-3xl"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_60%_70%,rgba(34,211,238,0.2),transparent_55%)] blur-2xl"
          />

          {/* rotating orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, rgba(168,85,247,0.4) 25%, transparent 50%, rgba(34,211,238,0.3) 75%, transparent 100%)",
              maskImage: "radial-gradient(circle, transparent 65%, black 66%, black 72%, transparent 73%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 65%, black 66%, black 72%, transparent 73%)",
            }}
          />

          {/* border ring */}
          <div className="absolute -inset-1 rounded-full border border-white/10 shadow-[0_0_40px_8px_rgba(168,85,247,0.2)]" />

          {/* dark backdrop */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(8,5,18,0.95),rgba(2,0,18,0.3)_70%)]" />

          {/* portrait */}
          <div className="absolute inset-0 rounded-full overflow-hidden [mask-image:linear-gradient(to_bottom,#000_80%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_80%,transparent_98%)]">
            <Image
              src="/images/branding/victor.png"
              alt="Victor portrait"
              fill
              priority
              draggable={false}
              className="select-none object-cover"
            />
          </div>
        </motion.div>
      </motion.div>


      {/* RIGHT: text */}
      <div className="w-full lg:w-1/2 h-full flex flex-col gap-5 justify-center text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[15px] border border-[#7042f88b] opacity-[0.9]"
        >
          <span className="mr-2 text-sm">🪐</span>
          <h1 className="Welcome-text text-[13px]">
            Backend / Platform Engineer (Aspiring)
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromRight(0.5)}
          className="flex flex-col gap-6 mt-6 text-5xl lg:text-6xl font-bold text-white max-w-[650px]"
        >
          <span>
            Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              beyond
            </span>{" "}
            the horizon.
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromRight(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          I&apos;m Linux Technical Specialist focused on automation, cloud infrastructure, and backend engineering.
          Currently building projects to transition into a Junior Software/Platform role.
        </motion.p>

        <motion.a
          variants={slideInFromRight(1)}
          href="mailto:victorsysadm@gmail.com"
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          Contact me
        </motion.a>
      </div>
    </motion.div>
  );
};
