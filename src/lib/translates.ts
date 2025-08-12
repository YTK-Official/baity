import {
  type NamespaceKeys,
  type NestedKeyOf,
  type createTranslator,
  useTranslations as useTranslationsIntl,
} from 'next-intl';
import { getTranslations as getTranslationsIntl } from 'next-intl/server';

import type messages from '../../messages/en.json';

export const useTranslations = <
  NestedKey extends NamespaceKeys<typeof messages, NestedKeyOf<typeof messages>>,
>(
  namespace?: NestedKey,
) => {
  const t = useTranslationsIntl(namespace);

  return t as ReturnType<typeof createTranslator<typeof messages, NestedKey>>;
};

export const getTranslations = async <
  NestedKey extends NamespaceKeys<typeof messages, NestedKeyOf<typeof messages>>,
>(
  namespace?: NestedKey,
) => {
  const t = await getTranslationsIntl(namespace);

  return t as ReturnType<typeof createTranslator<typeof messages, NestedKey>>;
};
