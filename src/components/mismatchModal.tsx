import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface MismatchModalProps {
  onClose: (choice: string) => void;
}

const MismatchModal: React.FC<MismatchModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const handleClose = (choice: string) => {
    onClose(choice);
  };

  return (
    <Dialog
      open={true}
      onClose={() => handleClose('')}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>
        {t('mismatchModal.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {t('mismatchModal.description')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose('continue')} color='primary'>
          {t('mismatchModal.continueBtn')}
        </Button>
        <Button onClick={() => handleClose('clear')} color='primary' autoFocus>
          {t('mismatchModal.clearBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MismatchModal;
