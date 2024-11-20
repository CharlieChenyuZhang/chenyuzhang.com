import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Typography, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #000;
  color: #fff;
  padding: 2rem;
`;

const LayoutContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid white;
  display: grid;
  grid-template-areas:
    "text chat"
    "input chat"
    "button1 button2";
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 80%;
  color: #fff;
`;

const TextSection = styled.div`
  grid-area: text;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 8px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const ChatSection = styled.div`
  grid-area: chat;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
`;

const TextInputSection = styled.div`
  grid-area: input;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const AnswerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonSection = styled.div`
  grid-area: button1;
`;

const Button2Section = styled.div`
  margin-top: 20px;
  grid-area: button2;
`;

const CustomButton = styled(Button)`
  background-color: black !important;
  color: white !important;
  border: 1px solid white !important;
  &:hover {
    background-color: #888 !important;
  }
  width: 100%;
  padding: 1rem;
`;

const FrustratedButton = styled(CustomButton)`
  border: 1px solid red !important;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: white;
    fieldset {
      border-color: white;
    }
    &:hover fieldset {
      border-color: #888;
    }
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
  & .MuiInputBase-input {
    color: white;
  }
  & .MuiInputLabel-root {
    color: white;
  }
`;

const StyledPre = styled.pre`
  background-color: #333;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
`;

const STUDY_TIME = 1800; // 30 minutes in seconds

// List of questions and their answers
const questions = [
  {
    question: "Constant Time Access",
    code: `def get_first_element(arr):\n    return arr[0]`,
    answer: "O(1)",
  },
  {
    question: "Print All Elements",
    code: `def print_all_elements(arr):\n    for element in arr:\n        print(element)`,
    answer: "O(n)",
  },
  {
    question: "Sum of Array",
    code: `def sum_array(arr):\n    total = 0\n    for num in arr:\n        total += num\n    return total`,
    answer: "O(n)",
  },
  {
    question: "Linear Search",
    code: `def linear_search(arr, target):\n    for i, num in enumerate(arr):\n        if num == target:\n            return i\n    return -1`,
    answer: "O(n)",
  },
  {
    question: "Binary Search",
    code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
    answer: "O(log n)",
  },
  {
    question: "Factorial",
    code: `def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result`,
    answer: "O(n)",
  },
  {
    question: "Fibonacci",
    code: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,
    answer: "O(n)",
  },
  {
    question: "Reverse Array",
    code: `def reverse_array(arr):\n    return arr[::-1]`,
    answer: "O(n)",
  },
  {
    question: "Two Sum",
    code: `def two_sum(arr, target):\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            if arr[i] + arr[j] == target:\n                return [i, j]\n    return []`,
    answer: "O(n^2)",
  },
  {
    question: "Bubble Sort",
    code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    answer: "O(n^2)",
  },
  {
    question: "Selection Sort",
    code: `def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "O(n^2)",
  },
  {
    question: "Insertion Sort",
    code: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and key < arr[j]:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key`,
    answer: "O(n^2)",
  },
  {
    question: "Counting Sort",
    code: `def counting_sort(arr):\n    max_val = max(arr)\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    index = 0\n    for num, freq in enumerate(count):\n        for _ in range(freq):\n            arr[index] = num\n            index += 1`,
    answer: "O(n)",
  },
  {
    question: "Quick Sort",
    code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)`,
    answer: "O(n log n)",
  },
  {
    question: "Merge Sort",
    code: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
    answer: "O(n log n)",
  },
  {
    question: "Heapify",
    code: `def heapify(arr, n, i):\n    largest = i\n    left = 2 * i + 1\n    right = 2 * i + 2\n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)`,
    answer: "O(log n)",
  },
  {
    question: "Heap Sort",
    code: `def heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)`,
    answer: "O(n log n)",
  },
  {
    question: "Find Minimum Element in Rotated Sorted Array",
    code: `def find_min(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        else:\n            right = mid\n    return nums[left]`,
    answer: "O(log n)",
  },
  {
    question: "Binary Tree Inorder Traversal (Recursive)",
    code: `def inorder_traversal(root):\n    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right) if root else []`,
    answer: "O(n)",
  },
  {
    question: "Binary Tree Level Order Traversal",
    code: `def level_order_traversal(root):\n    levels = []\n    if not root:\n        return levels\n    queue = [root]\n    while queue:\n        level = []\n        next_queue = []\n        for node in queue:\n            level.append(node.val)\n            if node.left:\n                next_queue.append(node.left)\n            if node.right:\n                next_queue.append(node.right)\n        levels.append(level)\n        queue = next_queue\n    return levels`,
    answer: "O(n)",
  },
];

const LearningTasks = () => {
  const [timeLeft, setTimeLeft] = useState(STUDY_TIME);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    const initialTime = savedTime ? parseInt(savedTime, 10) : STUDY_TIME;
    setTimeLeft(initialTime);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          localStorage.removeItem("timeLeft");
          navigate("/project/relief/debrief");
          return 0;
        } else {
          const newTime = prev - 1;
          localStorage.setItem("timeLeft", newTime);
          return newTime;
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setSolvedCount(solvedCount + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setErrorMessage("");
    } else {
      setErrorMessage("Incorrect answer. Please try again.");
    }
  };

  return (
    <MainContainer>
      <Box textAlign="center" marginBottom="1rem" sx={{ marginTop: "100px" }}>
        <Typography variant="h6" fontWeight="bold">
          Time Left: {formatTime(timeLeft)}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          You solved {solvedCount} / {questions.length} questions.
        </Typography>
      </Box>

      <LayoutContainer>
        <TextSection>
          <Typography variant="body1" style={{ flexGrow: 1 }}>
            {"Find the time complexity of the following:"}
            <StyledPre>
              <code>{questions[currentQuestionIndex].code}</code>
            </StyledPre>
          </Typography>

          <TextInputSection>
            <AnswerContainer>
              {"O("}
              <StyledTextField
                variant="outlined"
                placeholder="Your answer"
                fullWidth
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setErrorMessage("");
                }}
              />
              {")"}
            </AnswerContainer>

            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
            <CustomButton onClick={handleAnswerSubmit} variant="outlined">
              Submit Answer
            </CustomButton>
          </TextInputSection>
        </TextSection>

        <ChatSection>
          <Typography variant="body1">
            Chat Bot here to explain unfamiliar concepts but won't give you
            answers
          </Typography>

          <TextInputSection>
            <StyledTextField
              variant="outlined"
              placeholder="Text input"
              fullWidth
            />
            <CustomButton variant="outlined">Submit Chat</CustomButton>
            <FrustratedButton variant="outlined">
              I am VERY frustrated! Please help!
            </FrustratedButton>
            <FrustratedButton variant="outlined">
              I am Moderately frustrated! Please help!
            </FrustratedButton>
            <FrustratedButton variant="outlined">
              I am Slightly frustrated! Please help!
            </FrustratedButton>
          </TextInputSection>
        </ChatSection>
      </LayoutContainer>
    </MainContainer>
  );
};

export default LearningTasks;
