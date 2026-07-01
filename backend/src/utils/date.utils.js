const today = new Date();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const dateUtils = {
  startOfDay: new Date(today.getFullYear(), today.getMonth(), today.getDate()),

  endOfDay: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  ),
};

const year = today.getFullYear();

export { dateUtils, today, tomorrow, year };
