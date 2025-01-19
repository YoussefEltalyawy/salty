'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {cn} from '../lib/utils';

export const FlipWords = ({
  words,
  duration = 800,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      setTimeout(() => {
        startAnimation();
      }, duration);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 80,
          damping: 15,
          duration: 1.5, // Slower word change
        }}
        exit={{
          opacity: 0,
          y: -50, // Move up on exit
          rotateX: 30, // Slight rotation for the exit effect
          position: 'absolute',
        }}
        className={cn(
          'z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 ',
          className,
        )}
        key={currentWord}
      >
        {currentWord.split('').map((word, wordIndex) => (
          <motion.span
            key={word + wordIndex}
            initial={{opacity: 0, y: 10, filter: 'blur(8px)'}}
            animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
            transition={{
              delay: wordIndex * 0.05, // Faster typing animation
              duration: 0.3, // Smoother typing effect
            }}
            className="inline-block whitespace-nowrap text-white"
            style={{
              letterSpacing: '-0.02em', // Reduced letter spacing
            }}
          >
            {word.split('').map((letter, letterIndex) => (
              <motion.span
                key={word + letterIndex}
                initial={{opacity: 0, y: 10, filter: 'blur(8px)'}}
                animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
                transition={{
                  delay: wordIndex * 0.05 + letterIndex * 0.05, // Faster letter animation
                  duration: 0.2,
                }}
                className="inline-block text-white"
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
