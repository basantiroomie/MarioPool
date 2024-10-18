import React, { useState } from 'react'; 

// Styles for the bot
const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '250px',
    backgroundColor: '#1C0221',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: 'transparent', // Make background transparent
    border: '2px solid #93BA30', // Add border with color #93BA30
    color: '#93BA30',
    padding: '8px',
    borderRadius: '10px 10px 0 0',
    textAlign: 'center',
  },
  dropdown: {
    margin: '8px 0',
  },
  input: {
    margin: '8px 0',
    width: '100%',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  message: {
    color: '#fff', // Default message text color (white)
    margin: '8px 0',
  },
  successMessage: {
    color: '#93BA30', // Color for success messages
    margin: '8px 0',
  },
  errorMessage: {
    color: '#ff0000', // Optional: Color for error messages (red)
    margin: '8px 0',
  },
  button: {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#1C0221',
    color: '#fff',
    cursor: 'pointer',
  },
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Hey there, Mario at your service!");
  const [selectedOption, setSelectedOption] = useState("");
  const [userInput, setUserInput] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setUserInput(""); // Reset user input
    setMessage(""); // Clear message for new interaction
  };

  const handleRating = (rating) => {
    setMessage('Thank you for your feedback: ${rating}');
    setSelectedOption(""); // Reset selection
  };

  const handleSubmit = () => {
    if (selectedOption === "1") {
      const numOfRides = parseInt(userInput);
      if (isNaN(numOfRides)) {
        setMessage("Please enter a valid number.");
      } else if (numOfRides < 5) {
        setMessage("That's cool, keep Mariopooling!");
      } else if (numOfRides >= 6 && numOfRides <= 15) {
        setMessage("Congrats you have unlocked coupon code.");
      } else {
        setMessage("Congrats! Your discount coupon will be emailed to you.");
      }
    } else if (selectedOption === "2") {
      setMessage("Our team will reach out to you shortly.");
    } else if (selectedOption === "3") {
      // Rating system for previous ride experience
      return;
    } else if (selectedOption === "4") {
      setMessage("Thank you, your suggestion is of immense value to us.");
    }
    setSelectedOption(""); // Reset selection
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        MarioBot
      </div>
      {isOpen && (
        <>
          <div style={
            message.includes("Congrats!") || 
            message.includes("Go to lenskart") ? styles.successMessage : styles.message
          }>
            {message}
          </div>
          {selectedOption === "" ? (
            <select style={styles.dropdown} onChange={handleOptionChange}>
              <option value="">Select an option</option>
              <option value="1">Incentives</option>
              <option value="2">Customer Support</option>
              <option value="3">Previous Ride Experience</option>
              <option value="4">Suggestions</option>
            </select>
          ) : (
            <>
              {selectedOption === "1" && (
                <>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Enter number of rides"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <button style={styles.button} onClick={handleSubmit}>Submit</button>
                </>
              )}
              {selectedOption === "2" && (
                <>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Your query"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <button style={styles.button} onClick={handleSubmit}>Submit</button>
                </>
              )}
              {selectedOption === "3" && (
                <>
                  <div style={styles.dropdown}>
                    <button onClick={() => handleRating("Very Good ⭐⭐⭐⭐⭐")}>Very Good ⭐⭐⭐⭐⭐</button>
                    <button onClick={() => handleRating("Good ⭐⭐⭐⭐")}>Good ⭐⭐⭐⭐</button>
                    <button onClick={() => handleRating("Okay ⭐⭐⭐")}>Okay ⭐⭐⭐</button>
                    <button onClick={() => handleRating("Bad ⭐⭐")}>Bad ⭐⭐</button>
                    <button onClick={() => handleRating("Very Bad ⭐")}>Very Bad ⭐</button>
                  </div>
                </>
              )}
              {selectedOption === "4" && (
                <>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Your suggestion"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <button style={styles.button} onClick={handleSubmit}>Submit</button>
                </>
              )}
            </>
          )}
        </>
      )}
      <button 
       style={styles.button} 
       onClick={() => {
       setIsOpen(!isOpen);
       if (!isOpen) {
        // Reset state when opening the chat
        setMessage("Hey there, Mario at your service!");
        setSelectedOption("");
        setUserInput("");
      }
    }}
  >
    {isOpen ? "Close Chat" : "Open Chat"}
  </button>
</div>
);
};

export default ChatBot;