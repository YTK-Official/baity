import { Card, CardBody, Image } from '@/components/heroui';
import { getTranslations } from '@/lib/translates';
import { cn } from '@/lib/utils';
import { getChefById } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { notFound } from 'next/navigation';
import { MdPhone, MdShoppingBag, MdVerified } from 'react-icons/md';
import { NewArrivalCard } from '../../(home)/components/Cards/NewArrival';

export default async function ChefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations('chefs');
  const { id } = await params;
  const [error, data] = await tryCatch(getChefById(id));

  if (error || !data) {
    notFound();
  }

  const { chef, rating, totalOrders } = data;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Profile Section */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardBody className="p-0">
              <div className="relative h-48 bg-gradient-to-r from-customBlue to-customLightBlue">
                <div className="-bottom-16 -translate-x-1/2 absolute left-1/2">
                  <Image
                    src={chef.image ?? ''}
                    alt={chef.name}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                </div>
              </div>
              <div className="px-6 pt-20 pb-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <h1 className="font-bold text-2xl">{chef.name}</h1>
                  {chef.emailVerified && (
                    <MdVerified className="text-blue-500 text-xl" />
                  )}
                </div>
                <p
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 font-medium text-sm backdrop-blur-xl',
                    chef.online
                      ? 'bg-green-100/40 text-green-800'
                      : 'bg-red-100/40 text-red-800'
                  )}
                >
                  <span
                    className={cn(
                      'mr-1 h-2 w-2 rounded-full',
                      chef.online ? 'bg-green-400' : 'bg-red-400'
                    )}
                  />
                  {chef.online ? t('card.online') : t('card.offline')}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-semibold text-xl">
                {t('contact-information')}
              </h2>
              <div className="text-muted-foreground">
                <MdPhone className="text-xl" />
                <span>{chef.phone}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-semibold text-xl">{t('statistics')}</h2>
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="space-y-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900">
                  <MdShoppingBag className="mx-auto text-2xl text-blue-500" />
                  <p className="font-bold text-2xl">
                    {chef.products?.length ?? 0}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t('products')}
                  </p>
                </div>
                <div className="space-y-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900">
                  <span className="mx-auto text-3xl text-blue-500">★</span>
                  <p className="font-bold text-2xl">
                    {(rating ?? 0).toFixed(1) ?? 0}
                  </p>
                  <p className="text-muted-foreground text-sm">{t('rating')}</p>
                </div>
                <div className="space-y-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900">
                  <MdShoppingBag className="mx-auto text-2xl text-blue-500" />
                  <p className="font-bold text-2xl">{totalOrders ?? 0}</p>
                  <p className="text-muted-foreground text-sm">
                    {t('total-orders')}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          <h2 className="font-bold text-2xl">{t('products')}</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chef.products?.map(product => (
              <NewArrivalCard key={product.id} {...product} />
            ))}
            {chef.products?.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">
                {t('no-products')}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
