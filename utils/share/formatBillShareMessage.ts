/**
 * Build a WhatsApp-friendly plain-text bill summary.
 * Labels come from i18n so EN/AR stay in the UI layer.
 */
import type { Bill, BillCalculationResult } from '@/types';
import { formatBillDate } from '@/utils/formatBillDate';
import { formatMoney } from '@/utils/formatMoney';

export type BillShareLabels = {
  appName: string;
  foodSubtotal: string;
  service: string;
  tax: string;
  delivery: string;
  grandTotal: string;
  perPerson: string;
  food: string;
  total: string;
  untitled: string;
};

/**
 * Format bill + calculation into a readable WhatsApp message (*bold* works in WA).
 */
export function formatBillShareMessage(
  bill: Bill,
  result: BillCalculationResult,
  labels: BillShareLabels,
  locale: string,
): string {
  const title = bill.name.trim() || labels.untitled;
  const lines: string[] = [
    `*${labels.appName}*`,
    `*${title}*`,
    formatBillDate(bill.createdAt, locale),
    '',
    `${labels.foodSubtotal}: ${formatMoney(result.subtotal, locale)}`,
    `${labels.service}: ${formatMoney(result.serviceCharge, locale)}`,
    `${labels.tax}: ${formatMoney(result.tax, locale)}`,
  ];

  if (result.delivery > 0) {
    lines.push(`${labels.delivery}: ${formatMoney(result.delivery, locale)}`);
  }

  lines.push(`${labels.grandTotal}: ${formatMoney(result.grandTotal, locale)}`);
  lines.push('');
  lines.push(`*${labels.perPerson}*`);

  for (const person of result.people) {
    lines.push('');
    lines.push(`*${person.personName}* — ${formatMoney(person.total, locale)}`);

    for (const item of person.itemLines) {
      lines.push(
        `• ${item.itemName} × ${item.assignedQuantity}: ${formatMoney(item.amount, locale)}`,
      );
    }

    lines.push(`  ${labels.food}: ${formatMoney(person.foodSubtotal, locale)}`);
    lines.push(`  ${labels.service}: ${formatMoney(person.serviceCharge, locale)}`);
    lines.push(`  ${labels.tax}: ${formatMoney(person.tax, locale)}`);
    if (person.deliveryCharge > 0) {
      lines.push(`  ${labels.delivery}: ${formatMoney(person.deliveryCharge, locale)}`);
    }
    lines.push(`  ${labels.total}: ${formatMoney(person.total, locale)}`);
  }

  return lines.join('\n');
}
