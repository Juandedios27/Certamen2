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
        className="btn btn-success btn-lg px-4 py-2"
      >
        ✅ Validar Juego
      </motion.button>
    </Fragment>
  );
};

export default Evaluar;
