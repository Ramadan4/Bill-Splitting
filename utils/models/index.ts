/**
 * Model factories for SplitEat entities.
 * Screens/hooks should use these instead of hand-building objects.
 */
export { createAssignment, type NewAssignmentInput } from '@/utils/models/createAssignment';
export { createBillItem, type NewBillItemInput } from '@/utils/models/createBillItem';
export { createEmptyBill } from '@/utils/models/createEmptyBill';
export { createPerson } from '@/utils/models/createPerson';
export {
  createPersonGroup,
  uniqueTrimmedNames,
} from '@/utils/models/createPersonGroup';
