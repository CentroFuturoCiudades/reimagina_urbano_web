import { useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";

export const Tooltip = ({ hoverInfo, children }) => {
  const tooltipRef = useRef(null);
  const [positionStyle, setPositionStyle] = useState({ opacity: 0 });
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  useLayoutEffect(() => {
    if (tooltipRef.current && hoverInfo) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      let positionY, positionX;

      if (isMobile) {
        // Si es móvil muestra el tooltip en la parte inferior derecha
        positionY = `calc(100% - ${tooltipHeight}px - 55px)`; // Ajusta la distancia desde la parte superior de la pantalla
        positionX = `calc(100% - ${tooltipWidth}px - 10px)`; // Ajusta la distancia desde el lado derecho de la pantalla
      } else {
        // Si no es móvil muestra el tooltip sobre del cursor
        positionY = `calc(${hoverInfo.y}px - ${tooltipHeight}px - 10px)`;
        positionX = `calc(${hoverInfo.x}px - ${tooltipWidth / 2}px)`;
      }

      setPositionStyle({
        left: positionX,
        top: positionY,
        opacity: 1,
        transition: "opacity 0.2s, transform 0.2s",
      });
    } else {
      setPositionStyle({ opacity: 0 });
    }
  }, [hoverInfo, isMobile]);

  return (
    <div
      ref={tooltipRef}
      className={`tooltip-container${isMobile ? "-mobile" : ""}`}
      style={{
        position: "absolute",
        zIndex: 1,
        pointerEvents: "none",
        transform: "translateY(-10px)",
        width: isMobile ? "50dvw" : "auto",
        ...positionStyle,
      }}
    >
      {children}
    </div>
  );
};

