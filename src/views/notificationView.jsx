import { useEffect } from "react";
import "/src/styling/notification.css";

export function NotificationView({ message, isVisible, onClose, type = "success", action, actionLabel }) {
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(onClose, 5000); // hide after 5 seconds
        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose]);
  
    if (!isVisible) {
      return null;
    }
  
    return (
      <div className={`Notice ${type}`}>
        <div className="message">{message}</div>
        {action && (
          <button
            onClick={() => {
              action();    
              onClose();   
            }}
            className="undo-button"
          >
            {actionLabel}
          </button>
        )}
        <button onClick={onClose} className="close-button" aria-label="Close Notification">
          &times;
        </button>
      </div>
    );
  }