import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #1e1e1e;
  color: white;

  &::placeholder {
    color: #888;
  }
`;



// Debounce function (if needed for future use)
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Add forwardRef to the component
const SearchInput = forwardRef(({ onSend }, ref) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef();

  // Expose methods to the parent via `useImperativeHandle`
  useImperativeHandle(ref, () => ({
    resetInput: () => setQuery(""), // Clear the input field
    focusInput: () => inputRef.current?.focus(), // Focus the input field
  }));

  const handleInputChange = (e) => {
    if (e.target.value.trim()) {
      setQuery(e.target.value);
      return onSend(e.target.value);
    }
    setQuery("");
    onSend("");
  };

  return (
    <InputContainer>
      <Input
        ref={inputRef} // Attach ref to the input field
        type="text"
        placeholder="Search chats..."
        value={query}
        onChange={handleInputChange}
      />
    </InputContainer>
  );
});

export default SearchInput;
