import { useState, useEffect } from "react";
import styles from './styles.module.scss'

export function Slide({ show, children }){
  const [ shouldRender, setRender ] = useState(show);

  useEffect(() => {
    if (show){ setRender(true) };
  }, [show]);

  const onAnimationEnd = () => {
    if (!show){ setRender(false) };
  };

  return (
    shouldRender && (
      <div
        className={`${styles.slide} `}
        style={{animation: `${show ? styles.slideIn : styles.slideOut} 0.5s`}}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  );
};