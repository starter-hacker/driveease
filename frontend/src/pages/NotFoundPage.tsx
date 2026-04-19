// FILE: frontend/src/pages/NotFoundPage.tsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NotFoundPage = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="w-20 h-20 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
        <Car className="w-10 h-10 text-brand-blue" />
      </div>
      <h1 className="text-6xl font-black text-white mb-2">404</h1>
      <p className="text-xl font-semibold text-white/70 mb-2">Page Not Found</p>
      <p className="text-white/40 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg" leftIcon={<Home className="w-5 h-5" />}>
          Go Home
        </Button>
      </Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
