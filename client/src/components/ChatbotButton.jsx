import React from 'react';
import styles from './ChatbotButton.module.css';

const ChatbotButton = ({ onClick }) => {
  return (
    <button className={styles.floatingButton} onClick={onClick} title="Chat with our AI Assistant">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
};

export default ChatbotButton;
