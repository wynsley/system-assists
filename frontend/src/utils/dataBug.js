// Bus de eventos minimalista para notificar cambios entre pantallas
// que no comparten estado (ej: ListStudents y ClassroomRoster).
const bus = new EventTarget();

const emitDataChange = (topic) => {
  bus.dispatchEvent(new CustomEvent(topic));
};

const onDataChange = (topic, callback) => {
  bus.addEventListener(topic, callback);
  return () => bus.removeEventListener(topic, callback);
};

export { emitDataChange, onDataChange };