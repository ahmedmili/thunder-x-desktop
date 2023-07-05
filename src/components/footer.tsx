import React from 'react';
import logo from '../assets/icon.png';
import { Facebook, Instagram } from '@mui/icons-material';
import Container from '@mui/material/Container';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const footerStyle = {
    backgroundColor: '#343333',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
  };
  const logoStyle = {
    height: '3rem',
  };
  const columnStyle: React.CSSProperties = {
    flexBasis: '33.33%',
    textAlign: 'left',
    margin: '3rem',
  };
  return (
    <footer style={footerStyle}>
      <div style={columnStyle}>
        <img src={logo} alt='Logo' style={logoStyle} />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida
          ante vitae sapien fringilla, et interdum sapien bibendum. Curabitur
          euismod ultricies nulla vitae euismod.
        </p>
      </div>
      <div style={columnStyle}>
        <h3>Contact Us</h3>
        <ul>
          <li>Phone: 555-555-5555</li>
          <li>Email: info@fooddelivery.com</li>
          <li>Address: 123 Main St, Anytown USA</li>
        </ul>
      </div>
      <div style={columnStyle}>
        <h3>Follow Us</h3>
        <ul>
          <li>
            <Facebook />
          </li>
          <li>
            <Instagram />
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
