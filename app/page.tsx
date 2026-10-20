"use client"

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import VectorWordmark from '@/components/VectorWordmark';
import TypeSlabField from '@/components/TypeSlabField';
import MagazineFlip from '@/components/MagazineFlip';
import './globals.css';

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPos, setClickPos] = useState({ x: '50%', y: '50%' });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalDirection, setModalDirection] = useState<'left' | 'right'>('right');
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSections = 3;

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const scrollPos = container.scrollTop;
      const height = window.innerHeight;
      const current = Math.round(scrollPos / height);
      
      if (current !== activeSection && current >= 0 && current < totalSections) {
        setActiveSection(current);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeSection]);

  const scrollToSection = (index: number, isClickTransition = false, x?: number, y?: number) => {
    if (index < 0 || index >= totalSections) return;

    if (isClickTransition) {
      setClickPos({ x: `${x}px`, y: `${y}px` });
      setIsTransitioning(true);

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth',
          });
        }
      }, 1000);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 2800);
    } else {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: index * window.innerHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleGlobalClick = (e: React.MouseEvent) => {
    if (isTransitioning) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('.product-section')) {
      return;
    }

    const nextIndex = (activeSection + 1) % totalSections;
    scrollToSection(nextIndex, true, e.clientX, e.clientY);
  };

  const handleProductClick = (product: any, x: number, y: number) => {
    const direction = x < window.innerWidth / 2 ? 'left' : 'right';
    setModalDirection(direction);
    setSelectedProduct(product);
  };

  return (
    <>
      <main 
        className="snap-container" 
        ref={containerRef} 
        onClick={handleGlobalClick}
      >
        <div className="ripple-overlay">
          <div 
            className={`ripple-circle ${isTransitioning ? 'active' : ''}`} 
            style={{ 
              left: clickPos.x, 
              top: clickPos.y 
            } as React.CSSProperties} 
          />
        </div>

        <div className="pagination-dots">
          {[...Array(totalSections)].map((_, i) => (
            <div 
              key={i} 
              className={`dot ${i === activeSection ? 'active' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(i);
              }}
            />
          ))}
        </div>

        <section className="section intro-section">
          <div style={{ width: '100%', height: '100%' }} className="fade-in">
            <VectorWordmark 
              text="ANAMNESIS" 
              accent="#6EB9FF" 
              textColor="#FFFFFF" 
            />
          </div>
          <div className="scroll-hint">
            <span>Click anywhere to explore</span>
            <div className="scroll-arrow" />
          </div>
        </section>

        <section className="section philosophy-section">
          <div style={{ width: '100%', height: '100%' }} className="fade-in">
            <TypeSlabField 
              text="PAST PRESENT FUTURE " 
              baseColor="#FFFFFF" 
              accentColor="#6EB9FF"
            />
          </div>
        </section>

        <section className="section product-section">
          <div style={{ width: '100%', height: '100%' }} className="fade-in">
            <div 
              style={{ width: '100%', height: '100%' }} 
              onClick={(e) => e.stopPropagation()}
            >
              <MagazineFlip 
                onImageClick={(image: any, x: number, y: number) => handleProductClick(image, x, y)} 
              />
            </div>
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div 
          className="product-modal-overlay active" 
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className={`product-modal active ${modalDirection === 'left' ? 'slide-left' : 'slide-right'}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className={`modal-container ${modalDirection === 'left' ? 'mirrored' : ''}`}>
              <div className="modal-image-side">
                <img 
                  src={selectedProduct.image?.src || selectedProduct.src || ''} 
                  alt={selectedProduct.image?.alt || 'Product'} 
                />
              </div>
              <div className="modal-info-side">
                <h2 style={{ fontSize: '2.8rem', fontWeight: 200, marginBottom: '1rem' }}>
                  {selectedProduct.image?.alt || 'ANAMNESIS OBJECT'}
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#888', marginBottom: '2rem' }}>
                  시간의 흐름을 담아낸 아남네시아의 시그니처 오브제입니다. 
                  사유의 시간을 통해 완성된 이 제품은 단순한 굿즈를 넘어 
                  사용자의 영감을 자극하는 예술적 도구가 됩니다.
                </p>
                <div className="modal-price" style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 300 }}>
                  ₩ 45,000
                </div>
                <a href="#" className="buy-button" style={{ 
                  display: 'inline-block', 
                  padding: '1rem 2rem', 
                  border: '1px solid #fff', 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontSize: '1rem', 
                  transition: 'all 0.3s ease' 
                }}>구매하기</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
