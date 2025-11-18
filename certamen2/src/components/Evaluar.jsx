import React, { Fragment } from 'react';
import { motion } from 'framer-motion';

const Evaluar = ({ onEvaluate, disabled }) => {
  return (
    <Fragment>
      <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onEvaluate}
        disabled={disabled}
        className="btn btn-lg px-4 py-2"
        style={{ backgroundColor: disabled ? '#e9ecef' : '#5cb85c', color: disabled ? '#adb5bd' : 'white', border: 'none', fontWeight: '400' }}
      >
        <i className="bi bi-check-circle me-2"></i>
        Validar Juego
      </motion.button>
    </Fragment>
  );
};

export default Evaluar;
