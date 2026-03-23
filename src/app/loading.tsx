import { SpinnerIcon } from '@phosphor-icons/react/dist/ssr';

const Loading = () => {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <SpinnerIcon size={40} className='animate-spin text-muted-foreground' />
    </div>
  );
};

export default Loading;
