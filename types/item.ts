export type BillItem = {
  id: string;
  name: string;
  /** Unit price in EGP */
  price: number;
  quantity: number;
};

/**
 * How much of an item a person is responsible for.
 * Shared items = multiple people with quantities that sum to item.quantity
 * (fractional quantities allowed for equal splits of qty 1).
 */
export type ItemAssignment = {
  itemId: string;
  personId: string;
  quantity: number;
};
