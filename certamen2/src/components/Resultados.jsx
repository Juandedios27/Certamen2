import React, { Fragment } from 'react';
import { motion } from 'framer-motion';

const Resultados = ({ result }) => {
  const isValid = result.includes('VÁLIDO');
  const isError = result.includes('NO FORMA') || result.includes('REPETIDO') || result.includes('NO HAY');

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -50 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotate: [0, -5, 5, -5, 0]
        }}
        transition={{ 
          duration: 0.6,
          scale: { type: "spring", stiffness: 200, damping: 15 },
          rotate: { duration: 0.5, delay: 0.2 }
        }}
        className="text-center mt-4 p-4"
      >
        <motion.h1 
          className={`display-3 fw-bold`}
          style={{ 
            color: isValid ? '#5cb85c' : isError ? '#e74c3c' : '#f39c12',
            fontWeight: '300'
          }}
          animate={isValid ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {result}
        </motion.h1>
      </motion.div>
    </Fragment>
  );
};

export default Resultados;
