import React, { Fragment } from 'react';
import { motion } from 'framer-motion';

const Repartir = ({ onDeal }) => {
  return (
    <Fragment>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDeal}
        className="btn btn-primary btn-lg px-4 py-2"
      >
        Repartir
      </motion.button>
    </Fragment>
  );
};

export default Repartir;
