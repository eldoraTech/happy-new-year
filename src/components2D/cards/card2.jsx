import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import InteractiveNumber from "../HeroText/InteractiveNumber";

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.25,
      duration: 0.7,
      ease: "easeInOut",
    },
  }),
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function AnimatedWord({ letters, controls }) {
  const isMobile = window.innerWidth < 480;
  const isTablet = window.innerWidth < 768;

  const letterSize = isMobile
    ? Math.min(window.innerWidth / letters.length - 10, 46)
    : isTablet
    ? 64
    : 90;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? 6 : 12,
        marginTop: isMobile ? 20 : 40,
        flexWrap: "nowrap",
      }}
    >
      {letters.map((char, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={letterVariants}
          initial="hidden"
          animate={controls}
          style={{
            width: letterSize,
            height: letterSize,
            flexShrink: 0,
          }}
        >
          <InteractiveNumber
            value={char}
            size={letterSize}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function Card2() {
  const happy = useAnimation();
  const newWord = useAnimation();
  const year = useAnimation();
  const nums = useAnimation();

  useEffect(() => {
    (async () => {
      await happy.start((i) => letterVariants.show(4-i));
      await newWord.start((i) => letterVariants.show(3-i));
      await year.start((i) => letterVariants.show(3-i));
      await nums.start((i) => letterVariants.show(3-i));

      happy.start("float");
      newWord.start("float");
      year.start("float");
      nums.start("float");
    })();
  }, []);

  return (
    <>
      <AnimatedWord letters={["H", "A", "P", "P", "Y"]} controls={happy} />
      <AnimatedWord letters={["N", "E", "W"]} controls={newWord} />
      <AnimatedWord letters={["Y", "E", "A", "R"]} controls={year} />
      <AnimatedWord letters={["2", "0", "2", "6"]} controls={nums} />
    </>
  );
}

