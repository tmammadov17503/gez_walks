import { chatGPTSignInPath, getChatGPTUser } from '@/app/chatgpt-auth';
import { YoldaExperience } from '@/app/yolda-experience';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getChatGPTUser();

  return (
    <YoldaExperience
      signInPath={chatGPTSignInPath('/dashboard')}
      userName={user?.displayName ?? null}
    />
  );
}
