export const TAX_RATE = 0.15;

export const calculateTax = (amount: number, taxRate = TAX_RATE): number => {
  // Ensure positive values
  const validAmount = Math.abs(amount);
  const validTaxRate = Math.abs(taxRate);

  // Calculate tax amount
  const taxAmount = validAmount * validTaxRate;

  // Return rounded to 2 decimal places
  return Number(taxAmount.toFixed(2));
};

export const calculatePriceWithTax = (price: number, taxRate = TAX_RATE): number => {
  const tax = calculateTax(price, taxRate);
  const total = price + tax;

  // Return rounded to 2 decimal places
  return Number(total.toFixed(2));
};

export const calcPriceWithoutTax = (price: number, taxRate = TAX_RATE): number => {
  const tax = calculateTax(price, taxRate);
  const total = price - tax;

  return Number(total.toFixed(2));
};
