import { chatGPTSignOutPath, requireChatGPTUser } from '@/app/chatgpt-auth';
import { DashboardClient } from '@/app/dashboard/dashboard-client';
import { listBookings, listDogs } from '@/db/repository';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireChatGPTUser('/dashboard');
  const [dogs, bookings] = await Promise.all([
    listDogs(user.userId),
    listBookings(user.userId),
  ]);

  return (
    <DashboardClient
      userName={(user.fullName ?? user.email.split('@')[0]).split(' ')[0]}
      signOutPath={chatGPTSignOutPath('/')}
      dogs={dogs.map((dog) => ({
        ...dog,
        createdAt: dog.createdAt.toISOString(),
      }))}
      bookings={bookings.map((booking) => ({
        ...booking,
        scheduledFor: booking.scheduledFor.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      }))}
    />
  );
}
