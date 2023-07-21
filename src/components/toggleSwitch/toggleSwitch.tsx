import { selectIsDelivery, setIsDelivery } from '../../Redux/slices/homeDataSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { useTranslation } from 'react-i18next';
import './toggleSwitch.css';

import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DeckIcon from '@mui/icons-material/Deck';
const Switches = () => {
  const dispatch = useAppDispatch();
  const isDelivery = useAppSelector(selectIsDelivery);
  const { t } = useTranslation();

  const handleSwitchToggle = (event: { target: { value: string } }) => {
    dispatch(setIsDelivery(event.target.value === 'Livraison'));
  };

  return (
    <div className='Container'>
      <div className='SwitchesContainer'>
        <input
          className="SwitchInput"
          type='radio'
          id='switchLivraison'
          name='switchPlan'
          value='Livraison'
          checked={isDelivery}
          onChange={handleSwitchToggle}
        />
        <input
          className="SwitchInput"
          type='radio'
          id='switchEmporter'
          name='switchPlan'
          value='Emporter'
          checked={!isDelivery}
          onChange={handleSwitchToggle}
        />

        <label className="SwitchLabel" htmlFor='switchLivraison'>
          <DeliveryDiningIcon className='SwitchText-icon' />
          {t('livraison')}
        </label>
        <label className="SwitchLabel" htmlFor='switchEmporter'>
          <DeckIcon className='SwitchText-icon' />
          {t('emporter')}</label>
        <div className='SwitchWrapper'
          style={{
            transform: isDelivery ? 'translateX(0%)' : 'translateX(100%)',
          }}>
          <div className='Switch'>
            <div className='SwitchText' style={{ opacity: isDelivery ? 1 : 0 }}>
              <DeliveryDiningIcon className='SwitchText-icon' />
              {t('livraison')}
            </div>
            <div className='SwitchText' style={{ opacity: isDelivery ? 0 : 1 }}>

              <DeckIcon className='SwitchText-icon' />
              {t('emporter')}
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Switches;
