import { useSnackbar } from 'notistack';

interface IPopMessageContext {
  message: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
}

const usePopMessage = (): IPopMessageContext => {
  const snackbarContext = useSnackbar();

  return {
    message: snackbarContext.enqueueSnackbar,
    info: (message: string) =>
      snackbarContext.enqueueSnackbar(message, {
        variant: 'info',
      }),
    warning: (message: string) =>
      snackbarContext.enqueueSnackbar(message, {
        variant: 'warning',
      }),
    error: (message: string) =>
      snackbarContext.enqueueSnackbar(message, {
        variant: 'error',
        persist: true,
      }),
    success: (message: string) =>
      snackbarContext.enqueueSnackbar(message, {
        variant: 'success',
      }),
  };
};

export default usePopMessage;
