const formatter = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  });
  
  export const formatCurrency = (amount: number | bigint) => {
    return formatter.format(amount);
  };
  