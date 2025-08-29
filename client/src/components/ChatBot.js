import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('https://farm2table-production.up.railway.app/api/chat', { message });
      setReply(res.data.reply);
    } catch (eror) {
      setReply('⚠️ Sorry, something went wrong.');
      console.error(eror);
    }
    setLoading(false);
    setMessage('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            zIndex: 9999,
            overflowY: 'auto', 
            pointerEvents: 'auto',
            fontFamily: `'Poppins', sans-serif`,
            lineHeight: '1.6'
          }}
        >
          <h4 style={{ marginTop: 0 }}>Chat with FarmBot 🌱</h4>
          <div style={{ marginBottom: '10px', fontSize: '14px', minHeight: '40px' }}>
            {loading ? 'Thinking...' : reply}
          </div>
          <textarea
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
            style={{ width: '100%', padding: '6px', fontSize: '14px' }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '6px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              float: 'right',
            }}
          >
            Send
          </button>
        </div>
      )}
    </>
  );
};

export default Chatbot;