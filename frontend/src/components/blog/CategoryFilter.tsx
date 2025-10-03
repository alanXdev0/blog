import { memo } from "react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const spring = { type: "spring", stiffness: 320 };

const CategoryFilter = ({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) => (
  <div className="flex flex-wrap justify-center gap-3">
    {categories.map((category) => (
      <motion.button
        key={category}
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={spring}
        onClick={() => onSelect(category)}
        className={
          selected === category
            ? "px-5 py-2.5 rounded-full text-sm font-medium bg-accent text-white shadow-lg shadow-accent-soft"
            : "px-5 py-2.5 rounded-full text-sm font-medium bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
        }
      >
        {category}
      </motion.button>
    ))}
  </div>
);

export default memo(CategoryFilter);
