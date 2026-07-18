// components/countdown-timer/CountdownTimer.tsx
"use client";

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  createdAt: string;
  durationDays: number;
  onExpired?: () => void;
  className?: string;
  variant?: 'card' | 'page';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  createdAt,
  durationDays,
  onExpired,
  className = '',
  variant = 'card',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalSeconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!createdAt || !isClient) return;

    const calculateTimeLeft = () => {
      const created = new Date(createdAt);
      const expiryDate = new Date(created.getTime() + durationDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          totalSeconds: 0,
        });
        if (onExpired) onExpired();
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        totalSeconds,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt, durationDays, isClient, onExpired]);

  if (!isClient) {
    return null;
  }

  if (timeLeft.isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          انتهى العرض
        </span>
      </div>
    );
  }

  const isPage = variant === 'page';
  
  return (
    <div className={`${className}`}>
      <div 
        className={`
          inline-flex items-center gap-1.5 md:gap-2 
          bg-gradient-to-r from-red-50 via-red-100 to-red-50 
          rounded-xl px-3 py-2 md:px-5 md:py-3 
          border-2 border-red-400 
          shadow-lg shadow-red-200/50
          heartbeat-animation
          ${isPage ? 'scale-110 md:scale-125' : ''}
        `}
      >
        
        
        <span className="text-xs md:text-sm text-red-700 font-bold ml-0.5">
          ⏳ متبقي:
        </span>
        
        <div className="flex items-center gap-1 md:gap-2">
          {/* ALWAYS SHOW DAYS if > 0 */}
          {timeLeft.days > 0 && (
            <>
              <TimeUnit value={timeLeft.days} label="ي" heartbeat />
              <span className="text-red-600 font-bold text-base md:text-xl">:</span>
            </>
          )}
          
          {/* ALWAYS SHOW HOURS */}
          <TimeUnit value={timeLeft.hours} label="س" heartbeat />
          <span className="text-red-600 font-bold text-base md:text-xl">:</span>
          
          {/* ALWAYS SHOW MINUTES */}
          <TimeUnit value={timeLeft.minutes} label="د" heartbeat />
          <span className="text-red-600 font-bold text-base md:text-xl">:</span>
          
          {/* ALWAYS SHOW SECONDS - with special styling when urgent */}
          <TimeUnit 
            value={timeLeft.seconds} 
            label="ث" 
            heartbeat 
            urgent={timeLeft.days === 0 && timeLeft.hours < 1}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.05);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .heartbeat-animation {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse-red {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .pulse-red {
          animation: pulse-red 1s ease-in-out infinite;
        }

        @keyframes flash-urgent {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.95);
          }
        }
        
        .flash-urgent {
          animation: flash-urgent 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Time Unit Component with Heartbeat
const TimeUnit: React.FC<{ 
  value: number; 
  label: string; 
  heartbeat?: boolean;
  urgent?: boolean;
}> = ({ value, label, heartbeat = false, urgent = false }) => {
  return (
    <div className="flex items-center gap-0.5">
      <span className={`
        font-mono font-bold 
        text-base md:text-2xl 
        min-w-[24px] md:min-w-[36px] text-center
        ${urgent ? 'text-red-700 flash-urgent' : 'text-red-600'}
        ${heartbeat ? 'heartbeat-number' : ''}
      `}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={`
        text-[10px] md:text-xs font-bold
        ${urgent ? 'text-red-600' : 'text-red-500'}
      `}>
        {label}
      </span>
    </div>
  );
};

export default CountdownTimer;