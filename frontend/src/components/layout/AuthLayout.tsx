// FILE: frontend/src/components/layout/AuthLayout.tsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageSrc?: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  imageSrc = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
}: AuthLayoutProps) => (
  <div className="min-h-screen bg-ink-2 flex">
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      className="flex-1 flex flex-col justify-center px-12 py-16 max-w-lg"
    >
      <Link to="/" className="flex items-center gap-3 mb-14">
        <div className="w-7 h-7 border border-gold flex items-center justify-center shrink-0">
          <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
            <path
              d="M1 9L4 4L6 7L8 4L11 9"
              stroke="#C9A96E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-xs font-medium tracking-[0.16em] uppercase text-stone">
          DriveEase
        </span>
      </Link>

      <div className="mb-8">
        <div className="eyebrow mb-4">Secure access</div>
        <h1 className="text-3xl font-light text-stone mb-3">{title}</h1>
        <p className="text-sm text-muted leading-relaxed">{subtitle}</p>
      </div>

      {children}
    </motion.div>

    <div className="hidden lg:block flex-1 relative overflow-hidden">
      <img
        src={imageSrc}
        alt=""
        className="w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-2 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-2/80 via-transparent to-transparent" />
      <div className="absolute bottom-12 left-10 right-10">
        <p className="font-display text-2xl font-light text-stone/80 italic leading-snug mb-3">
          "Premium vehicles for extraordinary journeys."
        </p>
        <div className="gold-line" />
      </div>
    </div>
  </div>
);
