import { useTranslation } from 'react-i18next';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FlagIcon } from 'react-flag-kit';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select value={i18n.language} onChange={handleChange}>
      <MenuItem value='en'>
        <FlagIcon
          code='US'
          width={20}
          height={15}
          style={{ marginRight: '1rem' }}
        />
        {t('English')}
      </MenuItem>
      <MenuItem value='fr'>
        <FlagIcon
          code='FR'
          width={20}
          height={15}
          style={{ marginRight: '1rem' }}
        />
        {t('French')}
      </MenuItem>
      <MenuItem value='ar'>
        <FlagIcon
          code='TN'
          width={20}
          height={15}
          style={{ marginRight: '1rem' }}
        />
        {t('Arabic')}
      </MenuItem>
    </Select>
  );
}
