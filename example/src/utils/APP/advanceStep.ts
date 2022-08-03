const advanceStep = (step: string) => {
  switch (step) {
    case 'configureApp': {
      return 'registerUser';
    }

    case 'registerUser': {
      return 'activateUser';
    }
    case 'activateUser': {
      return 'registerNotification';
    }
    case 'registerNotification': {
      return 'activateNotification';
    }
    case 'activateNotification': {
      return 'completed';
    }
    case 'completed':
      return null;

    default:
      return null;
  }
};

export default advanceStep;
