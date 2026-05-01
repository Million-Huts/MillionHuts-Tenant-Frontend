import { motion } from "framer-motion";
import MateCard from "./MateCard";
import type { PGMate } from "@/types/pgmates";

interface MatesGridProps {
    mates: PGMate[];
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function MatesGrid({ mates }: MatesGridProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
            {mates.map((mate) => (
                <motion.div key={mate.id} variants={itemVariants}>
                    <MateCard mate={mate} />
                </motion.div>
            ))}
        </motion.div>
    );
}
