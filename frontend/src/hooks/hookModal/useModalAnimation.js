import { useState } from "react";

function useModalAnimation(closeModal, delay = 200) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, delay);
  };

  return { isClosing, handleClose };
}

export { useModalAnimation };