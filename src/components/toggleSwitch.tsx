import { useState } from 'react';
import styled from 'styled-components';
import { selectIsDelivery, setIsDelivery } from '../Redux/slices/homeDataSlice';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  width: 20rem;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1%;
`;

const SwitchesContainer = styled.div`
  width: 16rem;
  position: relative;
  display: flex;
  padding: 0;
  background: #edc72f;
  line-height: 3rem;
  border-radius: 3rem;
  margin-left: auto;
  margin-right: auto;
`;

const SwitchWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  padding: 0.15rem;
  z-index: 3;
  transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
`;

const Switch = styled.div`
  border-radius: 3rem;
  background: white;
  height: 100%;
`;

const SwitchLabel = styled.label`
  width: 50%;
  padding: 0;
  margin: 0;
  text-align: center;
  cursor: pointer;
  color: white;
`;

const SwitchInput = styled.input`
  visibility: hidden;
  position: absolute;
  top: 0;
`;

const SwitchText = styled.div`
  width: 100%;
  text-align: center;
  opacity: 0;
  display: block;
  color: #edc72f;
  transition: opacity 0.2s cubic-bezier(0.77, 0, 0.175, 1) 0.125s;
  will-change: opacity;
  position: absolute;
  top: 0;
  left: 0;
`;

const Switches = () => {
  const dispatch = useAppDispatch();
  const isDelivery = useAppSelector(selectIsDelivery);
  const { t } = useTranslation();

  const handleSwitchToggle = (event: { target: { value: string } }) => {
    dispatch(setIsDelivery(event.target.value === 'Livraison'));
  };

  return (
    <Container>
      <SwitchesContainer>
        <SwitchInput
          type='radio'
          id='switchLivraison'
          name='switchPlan'
          value='Livraison'
          checked={isDelivery}
          onChange={handleSwitchToggle}
        />
        <SwitchInput
          type='radio'
          id='switchEmporter'
          name='switchPlan'
          value='Emporter'
          checked={!isDelivery}
          onChange={handleSwitchToggle}
        />
        <SwitchLabel htmlFor='switchLivraison'>{t('livraison')}</SwitchLabel>
        <SwitchLabel htmlFor='switchEmporter'>{t('emporter')}</SwitchLabel>
        <SwitchWrapper
          style={{
            transform: isDelivery ? 'translateX(0%)' : 'translateX(100%)',
          }}>
          <Switch>
            <SwitchText style={{ opacity: isDelivery ? 1 : 0 }}>
              {t('livraison')}
            </SwitchText>
            <SwitchText style={{ opacity: isDelivery ? 0 : 1 }}>
              {t('emporter')}
            </SwitchText>
          </Switch>
        </SwitchWrapper>
      </SwitchesContainer>
    </Container>
  );
};

export default Switches;
