/**
 * Tax & service screen logic: draft % inputs, commit to store, continue.
 * Keeps `app/bill/charges.tsx` presentational only.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';
import { parseMoneyAmount } from '@/utils/charges/parseMoney';
import { parsePercentage } from '@/utils/charges/parsePercentage';

export type ChargesFormValues = {
  servicePercentage: string;
  taxPercentage: string;
  hasDelivery: boolean;
  deliveryCost: string;
};

export function useChargesEditor() {
  const router = useRouter();
  const servicePercentage = useBillStore((state) => state.bill?.servicePercentage ?? 0);
  const taxPercentage = useBillStore((state) => state.bill?.taxPercentage ?? 0);
  const hasDelivery = useBillStore((state) => state.bill?.hasDelivery ?? false);
  const deliveryCost = useBillStore((state) => state.bill?.deliveryCost ?? 0);
  const setServicePercentage = useBillStore((state) => state.setServicePercentage);
  const setTaxPercentage = useBillStore((state) => state.setTaxPercentage);
  const setDelivery = useBillStore((state) => state.setDelivery);

  // Seed drafts from store so revisiting the screen shows saved values.
  const [values, setValues] = useState<ChargesFormValues>({
    servicePercentage: servicePercentage ? String(servicePercentage) : '',
    taxPercentage: taxPercentage ? String(taxPercentage) : '',
    hasDelivery,
    deliveryCost: deliveryCost ? String(deliveryCost) : '',
  });
  /** i18n error key — translate in UI with `t(error)`. */
  const [error, setError] = useState<string | null>(null);

  const onChange = (patch: Partial<ChargesFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    if (error) {
      setError(null);
    }
  };

  /**
   * Validate both fields, write to store, then open summary.
   * Why commit on continue: avoids half-typed values polluting the draft mid-edit.
   */
  const continueToSummary = () => {
    const service = parsePercentage(values.servicePercentage, 'service');
    if (!service.ok) {
      setError(service.errorKey);
      return;
    }

    const tax = parsePercentage(values.taxPercentage, 'tax');
    if (!tax.ok) {
      setError(tax.errorKey);
      return;
    }

    if (values.hasDelivery) {
      const delivery = parseMoneyAmount(values.deliveryCost, 'errors.deliveryCostInvalid');
      if (!delivery.ok) {
        setError(delivery.errorKey);
        return;
      }

      if (delivery.value <= 0) {
        setError('errors.deliveryCostRequired');
        return;
      }

      setDelivery(true, delivery.value);
    } else {
      setDelivery(false, 0);
    }

    setServicePercentage(service.value);
    setTaxPercentage(tax.value);
    router.push('/bill/summary');
  };

  return {
    values,
    error,
    onChange,
    continueToSummary,
  };
}
