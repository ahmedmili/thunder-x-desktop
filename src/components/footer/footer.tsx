import React from 'react';
import logo from '../../assets/icon.png';
import { Facebook, Instagram } from '@mui/icons-material';
// import Container from '@mui/material/Container';
import './footer.css'
interface FooterProps { }

const Footer: React.FC<FooterProps> = () => {

  return (
    <footer
      className='footerStyle'
    >
      <div >
        <img src={logo} alt='Logo' />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida
          ante vitae sapien fringilla, et interdum sapien bibendum. Curabitur
          euismod ultricies nulla vitae euismod.
        </p>
      </div>
      <div >
        <h3>Contact Us</h3>
        <ul>
          <li>Phone: 555-555-5555</li>
          <li>Email: info@fooddelivery.com</li>
          <li>Address: 123 Main St, Anytown USA</li>
        </ul>
      </div>
      <div >
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
