import { useState } from "react";

function useConfirm() {
  const [config, setConfig] = useState(null); // { title, description, onConfirm, variant }

  const confirm = (options) => {
    setConfig(options);
  };

  const closeConfirm = () => setConfig(null);

  return { config, confirm, closeConfirm };
}

export { useConfirm };