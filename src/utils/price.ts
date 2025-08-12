export const getCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// export const getCurrency = (amount: number) =>
//   amount.toLocaleString("de-DE", {
//     style: "currency",
//     currency: "EGP",
//     unitDisplay: "short",
//     minimumSignificantDigits: 1,
//   });
