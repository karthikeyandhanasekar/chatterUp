import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
import { getRoomDetailsController } from "../../pages/controllers/chatPageController";

// Styled components
const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const SuggestionItem = styled.li`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SendButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

// Utility: Debounce Function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// SearchInput Component
const SearchInput = forwardRef(
  ({ placeholder, apiEndpoint, onSelect, onSend }, ref) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    const getRoomDetails = async () => {
      try {
        const response = await getRoomDetailsController();
      } catch (error) {}
    };

    useEffect(() => {
      getRoomDetails()
    }, []);

    // Debounced API fetch function
    const fetchSuggestions = useCallback(
      debounce(async (inputValue) => {
        if (!inputValue.trim()) {
          setSuggestions([]);
          return;
        }

        setIsLoading(true);

        try {
          const response = await fetch(
            `${apiEndpoint}?query=${encodeURIComponent(inputValue)}`
          );
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data); // Assuming API returns an array of suggestions
          } else {
            console.error("Failed to fetch suggestions");
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }

        setIsLoading(false);
      }, 300), // 300ms debounce delay
      [apiEndpoint]
    );

    // Handle input change
    const handleInputChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      fetchSuggestions(value); // Call the debounced fetch function
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
      setQuery(suggestion);
      setSuggestions([]);
      onSelect(suggestion);
    };

    // Handle Enter key press
    const handleKeyUp = (e) => {
      if (e.key === "Enter" && query.trim()) {
        onSend(query);
      }
    };

    // Handle send button click
    const handleSend = () => {
      if (query.trim()) {
        onSend(query);
        setQuery("");
      }
    };

    // UseImperativeHandle to expose methods to the parent
    useImperativeHandle(ref, () => ({
      clearInput: () => setQuery(""),
      focusInput: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      setInputValue: (value) => {
        setQuery(value);
        fetchSuggestions(value);
      },
    }));

    return (
      <InputContainer>
        <Input
          type="text"
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
        />
        {isLoading && <p>Loading...</p>}
        {suggestions.length > 0 && (
          <SuggestionsList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        )}
        <SendButton onClick={handleSend}>Send</SendButton>
      </InputContainer>
    );
  }
);

// Default props and validation
SearchInput.defaultProps = {
  placeholder: "Type to search...",
  onSelect: () => {},
  onSend: () => {},
  apiEndpoint: "/api/suggestions", // Replace with your actual API endpoint
};

export default SearchInput;
