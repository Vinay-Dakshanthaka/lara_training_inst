import React from 'react';
import arrowImg from './arrow.png'

class ScrollToTopButton extends React.Component {
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  render() {
    return (
      <p onClick={this.scrollToTop} style={{ position: 'fixed', bottom: '20px', right: '30px', cursor: 'pointer' }}>
        <img src={arrowImg} alt="Go to Top" style={{ width: '2.5rem', height: '2.5rem' }} />
      </p>
    );
  }
}

export default ScrollToTopButton;
