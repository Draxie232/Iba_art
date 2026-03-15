import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import card1 from './assets/card_1.png';
import card2 from './assets/card_2.png';
import card3 from './assets/card_3.png';
import card4 from './assets/card_4.png';
import handImg from './assets/Hand.png';

const deck = [
  { id: 1, src: card1, angle: -14, x: -55, y: 20 },
  { id: 2, src: card2, angle: -4, x: -18, y: 5 },
  { id: 3, src: card3, angle: 4, x: 18, y: 5 },
  { id: 4, src: card4, angle: 14, x: 55, y: 20 },
];

const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
popSound.volume = 0.4;

const CardParticles = () => {
  const particles = Array.from({ length: 16 }); 
  
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const distance = 30 + Math.random() * 20; 
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: 0, x, y, scale: Math.random() * 1 + 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-[3px] h-[3px] rounded-full bg-[#fbcfe8] shadow-[0_0_8px_#ec4899]"
          />
        );
      })}
    </div>
  );
};

export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (index) => {
    if (selectedCard === null) {
      setSelectedCard(index);
      popSound.currentTime = 0;
      popSound.play().catch(e => console.log("Audio play blocked by browser"));
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col items-center justify-end font-serif select-none touch-manipulation">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(90,40,140,0.6)_0%,_#000000_65%)] pointer-events-none" />

      <AnimatePresence>
        {selectedCard !== null && (
          <motion.button
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onClick={() => setSelectedCard(null)}
            // Positioned at top-8% to stay completely clear of the centered artwork
            className="absolute top-[6%] px-8 py-3 rounded-full border border-[#ec4899]/50 bg-[#2a1040]/90 text-[#fbcfe8] text-sm tracking-widest uppercase backdrop-blur-md shadow-[0_0_20px_rgba(236,72,153,0.3)] z-[60] cursor-pointer transition-colors hover:bg-[#ec4899]/20 active:scale-95"
          >
            Draw Back
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-sm h-[500px] flex justify-center items-end pb-8">
        
        <img 
          src={handImg} 
          alt="Hand holding cards" 
          className="absolute bottom-0 w-[280px] object-contain pointer-events-none z-10 opacity-95"
        />

        {deck.map((card, index) => {
          const isSelected = selectedCard === index;
          const isOtherSelected = selectedCard !== null && !isSelected;

          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(index)}
              initial={false}
              animate={{
                rotate: isSelected ? 0 : card.angle,
                x: isSelected ? 0 : card.x,
                // Adjusted y-offset to perfectly center the card without hitting the button
                y: isSelected ? -240 : (isOtherSelected ? card.y + 40 : card.y),
                // Smooth 2.5x scale fits most phone screens perfectly
                scale: isSelected ? 2.5 : 1,
                zIndex: isSelected ? 40 : 20,
                boxShadow: isSelected
                  ? '0 0 30px 5px rgba(236, 72, 153, 0.2)'
                  : '0 8px 20px rgba(0, 0, 0, 0.7)',
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 25,
                mass: 0.8
              }}
              style={{ originY: 1 }}
              // Removed the dark background and border from the wrapper so your image blends cleanly!
              className="absolute bottom-[90px] w-[110px] cursor-pointer flex justify-center items-center rounded-xl"
            >
              {/* Added rounded corners to the image itself */}
              <img src={card.src} className="w-full rounded-xl pointer-events-none block" alt="Card" />
              
              {isSelected && <CardParticles />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}