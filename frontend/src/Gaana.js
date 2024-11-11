import React, { useState, useEffect } from 'react';
import './login-signup.css';
import img1 from './loginformimg1.jpeg.jpg';
import img2 from './loginformimg2.jpeg.jpg';
import img3 from './loginformimg3.jpeg.jpg';

const Gaana = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [img1, img2, img3];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    const setSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel">
            <div className="carousel-inner">
                <img src={images[currentIndex]} alt="carousel" />
            </div>
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Gaana;

