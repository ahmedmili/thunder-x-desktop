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
import { relative } from 'path';

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
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      style={{ margin: '1rem' }}>
      <AccordionSummary
        expandIcon={
          <ExpandMore
            style={{
              color: 'white',
              backgroundColor: '#EDC72F',
              borderRadius: '5rem',
            }}
          />
        }
        aria-controls='faq-content'
        id='faq-header'
        style={{
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd',
          padding: '1rem',
        }}>
        <Typography variant='h6' style={{ fontWeight: 'bold' }}>
          {t(question)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          backgroundColor: '#f9f9f9',
          borderBottom: '1px solid #ddd',
          padding: '1rem',
        }}>
        <Typography style={{ fontSize: '1rem' }}>{t(answer)}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const FAQList = () => {
  const { t } = useTranslation();
  const faqs: FAQProps[] = t('faq.questions', { returnObjects: true });

  return (
    <Box
      textAlign='center'
      bgcolor='#fefefe'
      p={3}
      boxShadow='1px 2px 4px 2px rgba(0,0,0,0.1)'
      mb={5}
      position='relative'>
      <Typography
        variant='h1'
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '3rem',
        }}>
        {t('faq.header')}
      </Typography>
      {faqs.map((faq, index) => (
        <FAQ key={index} question={faq.question} answer={faq.answer} />
      ))}
    </Box>
  );
};

export default FAQList;
