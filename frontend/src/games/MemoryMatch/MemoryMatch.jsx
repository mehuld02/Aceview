import React, { useEffect, useState } from 'react';

const cardsArray = ['💻', '💡', '📱', '📘', '⚙️', '🔒'];
const generateCards = () => [...cardsArray, ...cardsArray].sort(() => Math.random() - 0.5);

const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    setCards(generateCards());
  }, []);

  const handleFlip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 max-w-xl mx-auto">
      {cards.map((card, idx) => (
        <div key={idx}
          onClick={() => handleFlip(idx)}
          className={`h-20 flex items-center justify-center text-2xl cursor-pointer border 
          ${flipped.includes(idx) || matched.includes(idx) ? 'bg-purple-300' : 'bg-gray-300'}`}>
          {(flipped.includes(idx) || matched.includes(idx)) ? card : '❓'}
        </div>
      ))}
    </div>
  );
};

export default MemoryMatch;
