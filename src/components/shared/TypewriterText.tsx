import { motion } from "framer-motion";

export const TypewriterText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  
  return (
    <motion.p className="body-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
};