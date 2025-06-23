
import React, { useState, useRef } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface OrderSearchFormProps {
  onSearch: (orderNumber: string) => void;
  initialOrderNumber?: string;
}

export const OrderSearchForm: React.FC<OrderSearchFormProps> = ({ onSearch, initialOrderNumber }) => {
  const initialParts = initialOrderNumber ? initialOrderNumber.split('-') : ['','','',''];
  const [part1, setPart1] = useState(initialParts[0]);
  const [part2, setPart2] = useState(initialParts[1]);
  const [part3, setPart3] = useState(initialParts[2]);
  const [part4, setPart4] = useState(initialParts[3]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleInputChange = (index: number, value: string, maxLength: number) => {
    const setters = [setPart1, setPart2, setPart3, setPart4];
    setters[index](value.toUpperCase());

    if (value.length === maxLength && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = `${part1}-${part2}-${part3}-${part4}`;
    if (part1 && part2 && part3 && part4) { // Basic validation
      onSearch(orderNumber);
    } else {
      alert("Please fill all parts of the order number.");
    }
  };
  
  // Effect to trigger search if initialOrderNumber is provided and valid
  React.useEffect(() => {
    if (initialOrderNumber) {
      const parts = initialOrderNumber.split('-');
      if (parts.length === 4 && parts.every(p => p.length > 0)) {
        setPart1(parts[0]);
        setPart2(parts[1]);
        setPart3(parts[2]);
        setPart4(parts[3]);
        onSearch(initialOrderNumber);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderNumber]); // Only run on initialOrderNumber change

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 bg-zyberion-light-blue p-4 rounded-lg shadow">
      <span className="text-sm font-medium text-zyberion-gray self-center pt-5 pr-2">Order Number:</span>
      <Input
        ref={inputRefs[0]}
        type="text"
        value={part1}
        onChange={(e) => handleInputChange(0, e.target.value, 3)}
        maxLength={3}
        placeholder="ABC"
        className="w-20 text-center"
        containerClassName="mb-0"
      />
      <span className="text-zyberion-gray self-center pt-5">-</span>
      <Input
        ref={inputRefs[1]}
        type="text"
        value={part2}
        onChange={(e) => handleInputChange(1, e.target.value, 4)}
        maxLength={4}
        placeholder="1234"
        className="w-24 text-center"
        containerClassName="mb-0"
      />
      <span className="text-zyberion-gray self-center pt-5">-</span>
      <Input
        ref={inputRefs[2]}
        type="text"
        value={part3}
        onChange={(e) => handleInputChange(2, e.target.value, 4)}
        maxLength={4}
        placeholder="5678"
        className="w-24 text-center"
        containerClassName="mb-0"
      />
      <span className="text-zyberion-gray self-center pt-5">-</span>
      <Input
        ref={inputRefs[3]}
        type="text"
        value={part4}
        onChange={(e) => handleInputChange(3, e.target.value, 5)}
        maxLength={5}
        placeholder="90123"
        className="w-28 text-center"
        containerClassName="mb-0"
      />
      <Button type="submit" variant="primary" className="h-10">Search</Button>
    </form>
  );
};
    