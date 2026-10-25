import { motion } from 'framer-motion';

const StateCard = ({ state }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gray-600 rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">
          {state.name.charAt(0)}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{state.name}</h3>
      {state.code && (
        <p className="text-sm text-gray-400 mb-2">{state.code}</p>
      )}
      {state.description && (
        <p className="text-sm text-gray-200">{state.description}</p>
      )}
    </motion.div>
  );
};

export default StateCard;

