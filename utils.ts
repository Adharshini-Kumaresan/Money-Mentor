
export const formatCurrency = (amount: number) => {
  return `₹${amount}`;
};

export const getISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDisplayDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const dStr = getISODate(date);
  if (dStr === getISODate(today)) return 'Today';
  if (dStr === getISODate(yesterday)) return 'Yesterday';
  if (dStr === getISODate(tomorrow)) return 'Tomorrow';

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
};

export const getDisplayDayName = (date: Date) => {
  return date.toLocaleDateString('en-IN', { weekday: 'long' });
};
