import { useState } from 'react';
import { InitialHookStatus } from '@react-buddy/ide-toolbox';

export const useInitial: () => InitialHookStatus = () => {
  const [status] = useState<InitialHookStatus>({
    loading: false,
    error: false,
  });
  return status;
};
