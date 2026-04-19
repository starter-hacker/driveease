// FILE: frontend/src/pages/customer/LandingPage.tsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Shield,
  Clock,
  Award,
  ChevronRight,
  Star,
  ArrowRight,
} from 'lucide-react';
import { NavBar } from '@/components/shared/NavBar';
import { CarCard } from '@/components/shared/CarCard';
import { Button } from '@/components/ui/Button';
import { useCars } from '@/hooks/useCars';

const AnimatedCounter = ({
  target,
  label,
}: {
  target: number;
  label: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const step = target / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-gradient">
        {count.toLocaleString()}+
      </p>
      <p className="text-white/50 text-sm mt-1">{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { data: featuredData } = useCars({ status: 'AVAILABLE', limit: 6 });
  const featuredCars = featuredData?.data || [];

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-emerald/8 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-brand-blue text-sm font-medium">
                Nigeria's Premium Car Rental
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Drive the car
              <br />
              <span className="text-gradient">you deserve</span>
            </h1>

            <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
              From economy to luxury, choose from 500+ vehicles across Lagos,
              Abuja, and Port Harcourt. Fair prices, zero surprises.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="xl"
                onClick={() => navigate('/cars')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Browse Cars
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter target={500} label="Cars Available" />
            <AnimatedCounter target={10000} label="Happy Customers" />
            <AnimatedCounter target={50000} label="Trips Completed" />
            <AnimatedCounter target={3} label="Cities Covered" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Get behind the wheel in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Browse & Select',
                desc: 'Search our fleet by category, price, or location. Filter to find exactly what you need.',
              },
              {
                step: '02',
                icon: Shield,
                title: 'Book & Pay',
                desc: 'Choose your dates, add extras like insurance or GPS, and pay securely online.',
              },
              {
                step: '03',
                icon: Clock,
                title: 'Pick Up & Drive',
                desc: "Collect your car at the agreed location. Return it when done — it's that simple.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 text-6xl font-black text-white/3 group-hover:text-white/5 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white">Popular Cars</h2>
              <p className="text-white/50 mt-2">
                Our most-booked vehicles this month
              </p>
            </motion.div>
            <Link to="/cars">
              <Button
                variant="secondary"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                See All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.slice(0, 6).map((car, i) => (
              <CarCard key={car.id} car={car} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              What our customers say
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Adaeze N.',
                tier: 'Gold Member',
                text: 'Booked a BMW 5 Series for a business trip to Abuja. Seamless experience — the car was immaculate and the process took under 5 minutes.',
                rating: 5,
              },
              {
                name: 'Femi B.',
                tier: 'Platinum Member',
                text: 'DriveEase has become my go-to for airport pickups. Reliable, affordable, and the customer service is excellent. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Chisom A.',
                tier: 'Silver Member',
                text: 'Used the Toyota Hiace for a family event. Perfect condition, great price, and the insurance add-on gave us real peace of mind.',
                rating: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-brand-amber fill-brand-amber"
                    />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/40">{t.tier}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-blue/5 pointer-events-none" />
            <Award className="w-14 h-14 text-brand-blue mx-auto mb-5" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to drive?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Join over 10,000 satisfied customers. Create your free account and
              get your first booking done in minutes.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/register">
                <Button
                  size="xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/cars">
                <Button variant="secondary" size="xl">
                  Browse Fleet
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold text-white">DriveEase</span>
          </div>
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} DriveEase Nigeria. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((l) => (
              <a
                key={l}
                href="#"
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
