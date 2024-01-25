import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import './faq.css';

interface FAQProps {
  question: string;
  answer: string;
}

const FAQ: React.FC<FAQProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };
  return (
    <Accordion className="Accordion">
      <AccordionSummary
        expandIcon={<ExpandMore className="expand-icon" />}
        aria-controls="faq-content"
        id="faq-header"
        className="AccordionSummary"
      >
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          {t(question)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="AccordionDetails">
        <Typography style={{ fontSize: '1rem' }}>{t(answer)}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const FAQList = () => {
  const { t } = useTranslation();
  const faqs: FAQProps[] = t('faq.questions', { returnObjects: true });

  return (
    <Box className="FAQ">
      <Typography variant='h1'> {t('faq.header')}</Typography>
      {faqs.map((faq, index) => (
        <FAQ key={index} question={faq.question} answer={faq.answer} />
      ))}
    </Box>
  );
};

export default FAQList;
