import React from 'react';
import AboutSection from '../../Components/AboutSection/AboutSection';
import CTASection from '../../Components/CallToActionSection/CTASection';
import FeaturesSection from '../../Components/FeaturesSection/FeaturesSection';
import FooterSection from '../../Components/FooterSection/FooterSection';
import Hero from '../../Components/Hero/Hero';
import NavBar from '../../Components/NavBar/NavBar';
import RatingsSection from '../../Components/RatingsSection/RatingsSection';
import Title from '../../Components/Title/Title';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      <NavBar/>
      <Hero/>
      <div className='container'>
        <Title subtitle='Take Action' title='Get Started'/>
        <CTASection/>
        <AboutSection/>
      </div>
      <Title subtitle='Exciting!' title='College has never been better'/>
      <FeaturesSection/>
      <RatingsSection/>
      <FooterSection/>
    </div>
  );
}

export default HomePage;

