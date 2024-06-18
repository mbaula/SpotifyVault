import React, { useState, ReactNode  } from 'react';
import './CustomTooltip.css';

interface CustomTooltipProps {
    content: ReactNode;
    children: ReactNode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className="tooltip-content">{content}</div>}
    </div>
  );
};

export default CustomTooltip;
