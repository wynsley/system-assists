import { useState } from "react";

function useModalAnimation(closeModal, delay = 300) {
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