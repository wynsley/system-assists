import { useEffect, useRef } from "react";

export function useClickOutside(callback) {
  const ref = useRef(null);
  const callbackRef = useRef(callback);

  // Actualiza la referencia sin re-ejecutar el effect
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callbackRef.current(); // 👈 usa la ref, no el callback directo
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // 👈 array vacío: el listener se registra solo una vez

  return ref;
}