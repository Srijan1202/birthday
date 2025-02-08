"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import confetti from "canvas-confetti"
import { PartyPopper, Cake, Music, Gift } from "lucide-react"
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider, db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })

const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    className="inline-block"
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
  >
    {children}
  </motion.div>
)

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="sparkle"
    style={{
      ...style,
      width: "4px",
      height: "4px",
      background: "white",
      borderRadius: "50%",
    }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
    }}
  />
)

const FloatingObject = ({ emoji, index }: { emoji: string; index: number }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const randomX = Math.random() * (dimensions.width || 1000);
  
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      initial={{ x: randomX, y: -20 }}
      animate={{
        y: (dimensions.height || 1000) + 20,
        rotate: [0, 360],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        delay: index * 0.5,
        ease: "linear"
      }}
    >
      {emoji}
    </motion.div>
  );
};

export default function BirthdayInvitation() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{ id: number; style: React.CSSProperties }>>([])
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const createSparkles = () => {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
      }))
      setSparkles(newSparkles)
    }

    createSparkles()
    const interval = setInterval(createSparkles, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const duration = 2 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [showConfetti])

  const handleRSVP = async () => {
    try {
      if (!user) {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        
        await addDoc(collection(db, 'rsvps'), {
          name: result.user.displayName,
          email: result.user.email,
          timestamp: new Date(),
        });
      }
      setShowConfetti(true);
    } catch (error) {
      console.error("Error during RSVP:", error);
    }
  };

  const floatingEmojis = ['✨', '🎵', '🎪', '🎭', '🎨', '🎪'];

  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} style={sparkle.style} />
      ))}

      {floatingEmojis.map((emoji, index) => (
        <FloatingObject key={index} emoji={emoji} index={index} />
      ))}

      <header className="pt-16 pb-8 text-center relative z-10">
        <motion.div
          className={`text-5xl md:text-7xl font-bold ${pacifico.className}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            You're Invited!
          </span>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        <section className="mb-16 text-center">
          <div className="flex justify-center gap-8">
            <FloatingIcon delay={0}>
              <PartyPopper className="w-12 h-12 text-pink-400" />
            </FloatingIcon>
            <FloatingIcon delay={0.2}>
              <Cake className="w-12 h-12 text-blue-400" />
            </FloatingIcon>
            <FloatingIcon delay={0.4}>
              <Music className="w-12 h-12 text-pink-400" />
            </FloatingIcon>
            <FloatingIcon delay={0.6}>
              <Gift className="w-12 h-12 text-blue-400" />
            </FloatingIcon>
          </div>
        </section>

        <motion.section 
          className="mb-16 text-center bg-black/30 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto border border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Join me for my Birthday Celebration!
          </motion.h2>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-xl md:text-2xl text-pink-200">Date: February 9th</p>
            <p className="text-xl md:text-2xl text-blue-200">Time: 7:00 PM</p>
          </motion.div>
        </motion.section>

        <motion.section 
          className="mb-16 bg-black/30 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto border border-white/10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-center text-white">
            Venue
          </h3>
          <p className="text-lg md:text-xl mb-4 text-center text-pink-200">
            <a 
              href="https://maps.app.goo.gl/rV2o3b9xn641naVK9"
              className="hover:text-pink-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pastel Poetry<br />
              Chittoor Rd, Gandhi Nagar<br />
              Vellore, Tamil Nadu 632006
            </a>
          </p>
        </motion.section>

        <section className="mb-16 text-center">
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl md:text-2xl shadow-lg transform transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRSVP}
          >
            {user ? 'Confirm RSVP' : 'RSVP with Google'}
          </motion.button>
        </section>
      </main>

      <footer className="text-center pb-8 relative z-10">
        <motion.p 
          className="text-sm text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Can't wait to celebrate with you!
        </motion.p>
      </footer>

      <style jsx global>{`
        .sparkle {
          position: absolute;
          pointer-events: none;
          background: white;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}