
import React, { useState, useEffect } from 'react';

const TypingQuote = ({ quotes, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentQuote = quotes[quoteIndex];
      
      if (isDeleting) {
        
        setDisplayedText(currentQuote.substring(0, displayedText.length - 1));
      } else {
       
        setDisplayedText(currentQuote.substring(0, displayedText.length + 1));
      }

      
      if (!isDeleting && displayedText === currentQuote) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } 
      
      else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, quoteIndex, quotes, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <div className="text-center mt-6 h-14 md:h-16"> 
      <span className="text-lg text-gray-400 font-mono border-r-2 border-indigo-400 animate-blink">
        {`"${displayedText}"`}
      </span>
    </div>
  );
};

export default TypingQuote;