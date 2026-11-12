import React, { useEffect, useState, useMemo } from 'react';

// Memoize the initial cards array to prevent re-computation on every render
const CARDS_ARRAY = ['💻', '💡', '📱', '📘', '⚙️', '🔒', '🚀', '🧠'];

const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Stores indices of the 2 currently flipped cards
  const [matched, setMatched] = useState([]); // Stores symbols of matched cards
  const [animating, setAnimating] = useState(false); // Prevents clicks during animation
  const [wins, setWins] = useState(0); // Bonus: Track wins

  // Memoize the generated cards for a new game
  const generateCards = useMemo(() => {
    return [...CARDS_ARRAY, ...CARDS_ARRAY].sort(() => Math.random() - 0.5);
  }, [wins]); // Re-generate cards only when a new game starts (wins increment)

  useEffect(() => {
    setCards(generateCards);
  }, [generateCards]); // Effect runs when `generateCards` changes

  const handleReset = () => {
    setMatched([]);
    setFlipped([]);
    setAnimating(true); // Briefly disable clicks
    setTimeout(() => {
      setWins(wins + 1); // This triggers the useMemo to create a new board
      setAnimating(false);
    }, 500); // Wait for cards to flip back before resetting
  };

  const handleFlip = (idx) => {
    // Prevent flipping if animating, card is already flipped, or already matched
    if (animating || flipped.includes(idx) || matched.includes(cards[idx])) {
      return;
    }

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    // If two cards are flipped, check for a match
    if (newFlipped.length === 2) {
      setAnimating(true); // Disable clicks while checking
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx] === cards[secondIdx]) {
        // It's a match!
        setMatched([...matched, cards[firstIdx]]);
        setFlipped([]); // Clear flipped cards
        setAnimating(false);
      } else {
        // It's not a match, flip them back after a delay
        setTimeout(() => {
          setFlipped([]);
          setAnimating(false);
        }, 1200);
      }
    }
  };

  // Check for win condition
  useEffect(() => {
    if (matched.length === CARDS_ARRAY.length) {
      alert("🎉 You won! Congratulations! 🎉");
    }
  }, [matched]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Memory Match</h1>
      <div className="grid grid-cols-4 gap-4 max-w-xl">
        {cards.map((cardSymbol, idx) => {
          const isFlipped = flipped.includes(idx);
          const isMatched = matched.includes(cardSymbol);
          const isMismatch = flipped.length === 2 && isFlipped && !isMatched;

          return (
            <div
              key={idx}
              className="w-24 h-24 cursor-pointer [perspective:1000px]"
              onClick={() => handleFlip(idx)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  (isFlipped || isMatched) ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* Card Back */}
                <div className="absolute w-full h-full bg-gray-400 hover:bg-gray-500 rounded-lg flex items-center justify-center text-4xl [backface-visibility:hidden]">
                  ❓
                </div>
                {/* Card Front */}
                <div
                  className={`absolute w-full h-full rounded-lg flex items-center justify-center text-5xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isMatched ? 'bg-green-400' : isMismatch ? 'bg-red-400' : 'bg-blue-400'
                  }`}
                >
                  {cardSymbol}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button 
        onClick={handleReset}
        className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
      >
        Reset Game
      </button>
    </div>
  );
};

export default MemoryMatch;