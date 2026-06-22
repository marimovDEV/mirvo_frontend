import React from 'react';
import { MarketHeader } from '@/src/components/Navigation';
import { useTranslation } from 'react-i18next';

export default function DeliveryPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      <main className="pt-24 md:pt-32 pb-40 px-6 max-w-2xl mx-auto">
        <section className="space-y-8 pt-6">
          <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tighter leading-none text-black">
            {t('pages.delivery_title', 'Delivery')}
          </h1>
          <p className="text-zinc-500 font-medium text-lg leading-relaxed whitespace-pre-line">
            {t('pages.delivery_content', 'Delivery info')}
          </p>
        </section>
      </main>
    </div>
  );
}
