import { useTranslation } from 'react-i18next';
import { selectIsDelivery, setIsDelivery } from '../../Redux/slices/homeDataSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import toggleStyle from './toggleSwitch.module.scss';

import { localStorageService } from '../../services/localStorageService';
const Switches = () => {
  const dispatch = useAppDispatch();
  const isDelivery = useAppSelector(selectIsDelivery);
  const { t } = useTranslation();

  const handleSwitchToggle = (event: { target: { value: string } }) => {
    dispatch(setIsDelivery(event.target.value === 'Livraison'));
    localStorageService.setDelivery(event.target.value === 'Livraison' ? 0 : 1)
  };


  return (
    <div className={toggleStyle.SwitchesContainer}>
      <input
        className={toggleStyle.SwitchInput}
        type='radio'
        id='switchLivraison'
        name='switchPlan'
        value='Livraison'
        checked={isDelivery}
        onChange={handleSwitchToggle}
      />
      <input
        className={toggleStyle.SwitchInput}
        type='radio'
        id='switchEmporter'
        name='switchPlan'
        value='Emporter'
        checked={!isDelivery}
        onChange={handleSwitchToggle}
      />

      <label className={toggleStyle.SwitchLabel + ' ' + toggleStyle.emporter} htmlFor='switchLivraison'>
        {/* <DeliveryDiningIcon className={toggleStyle.SwitchTextIcon} /> */}
        {t('livraison')}
      </label>
      <label className={toggleStyle.SwitchLabel} htmlFor='switchEmporter'>
        {/* <DeckIcon className={toggleStyle.SwitchTextIcon} /> */}
        {t('emporter')}
      </label>
      <div className={toggleStyle.SwitchWrapper}
        style={{
          transform: isDelivery ? 'translateX(0%)' : 'translateX(100%)',
        }}>
        <div className={toggleStyle.Switch}>
          <div className={toggleStyle.SwitchText + ' ' + toggleStyle.emporter} style={{ opacity: isDelivery ? 1 : 0 }}>
            {/* <DeliveryDiningIcon className={toggleStyle.SwitchTextIcon} /> */}
            {t('livraison')}
          </div>
          <div className={toggleStyle.SwitchText} style={{ opacity: isDelivery ? 0 : 1 }}>
            {/* <DeckIcon className={toggleStyle.SwitchTextIcon} /> */}
            {t('emporter')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Switches;
