/**
 * Public calculation API for SplitEat.
 * Import from `@/utils/calculations` — keep callers free of internal file paths.
 */

export { calculateBill } from '@/utils/calculations/calculateBill';
export {
  distributeChargeByFoodShare,
  distributeEqually,
  getDeliveryCharge,
  getServiceCharge,
  getTaxCharge,
} from '@/utils/calculations/charges';
export {
  buildPersonFoodBreakdowns,
  getAssignedQuantityForItem,
  getBillSubtotal,
  getItemTotal,
} from '@/utils/calculations/items';
export { reconcileRoundedAmounts, roundMoney } from '@/utils/calculations/money';
export { validateBill, type BillValidationIssue } from '@/utils/calculations/validate';
