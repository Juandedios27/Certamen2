import React, { Fragment } from 'react';
import { motion } from 'framer-motion';

const Carta = ({ card, onRemove, index, isDealingNew, isShuffling }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -150
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: index * 0.05,
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    shuffling: {
      opacity: 1,
      x: [0, -30, 30, -20, 20, 0],
      y: [0, -40, 40, -30, 30, 0],
      rotate: [0, -15, 15, -10, 10, 0],
      scale: [1, 0.95, 1.05, 0.98, 1.02, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut"
      }
    },
    exitDeal: {
      opacity: 0,
      y: -100,
      rotateY: 180,
      scale: 0.3,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exitRemove: {
      opacity: 0,
      y: 100,
      scale: 0.8,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const handleRemove = () => {
    onRemove(card.id);
  };

  return (
    <Fragment>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={isShuffling ? "shuffling" : "visible"}
        exit={isDealingNew ? "exitDeal" : "exitRemove"}
        className="position-relative"
        style={{ 
          width: '120px', 
          height: '170px',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="card bg-white text-dark h-100 position-relative"
          style={{ 
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <button
            onClick={handleRemove}
            className="btn-close btn-close-black position-absolute"
            aria-label="Eliminar carta"
            style={{
              top: '5px',
              right: '5px',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              padding: '0',
              opacity: 1,
              borderRadius: '50%',
              zIndex: 10
            }}
          />

          <div className="card-body d-flex flex-column justify-content-between p-2">
            <div 
              className="text-start fw-bold"
              style={{ 
                fontSize: '18px', 
                color: isRed ? '#dc3545' : '#000',
                lineHeight: 1
              }}
            >
              <div>{card.value}</div>
              <div style={{ fontSize: '20px' }}>{card.suit}</div>
            </div>

            <div 
              className="text-center"
              style={{ 
                fontSize: '45px', 
                color: isRed ? '#dc3545' : '#000'
              }}
            >
              {card.suit}
            </div>

            <div 
              className="text-end fw-bold"
              style={{ 
                fontSize: '18px', 
                color: isRed ? '#dc3545' : '#000',
                lineHeight: 1,
                transform: 'rotate(180deg)'
              }}
            >
              <div>{card.value}</div>
              <div style={{ fontSize: '20px' }}>{card.suit}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default Carta;
