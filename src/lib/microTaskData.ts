// Micro-task data structure and mock data

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  recommendationReason: string;
  category: string;
  estimatedTime: string;
  steps: {
    step: number;
    title: string;
    content: string;
    codeExample?: string;
  }[];
  videoUrl?: string;
  completed?: boolean;
  helpful?: boolean;
  userComment?: string;
}

export const mockMicroTasks: MicroTask[] = [
  {
    id: '1',
    title: 'Practice with for-loops',
    description: 'Write a loop to print numbers 1–10',
    difficulty: 'Easy',
    recommendationReason: 'Based on recent quiz',
    category: 'Programming Basics',
    estimatedTime: '5 min',
    steps: [
      {
        step: 1,
        title: 'Understand the Loop Syntax',
        content: 'A for-loop in Python has three parts: initialization, condition, and increment. The basic syntax is: for variable in range(start, end)',
        codeExample: 'for i in range(1, 11):\n    print(i)',
      },
      {
        step: 2,
        title: 'Set Up Your Environment',
        content: 'Open your Python IDE or code editor. Create a new file called "loop_practice.py"',
      },
      {
        step: 3,
        title: 'Write the Loop',
        content: 'Type the for-loop code that iterates from 1 to 10. Remember that range(1, 11) generates numbers from 1 to 10.',
        codeExample: 'for i in range(1, 11):\n    print(i)',
      },
      {
        step: 4,
        title: 'Run and Verify',
        content: 'Execute your code and verify that it prints numbers 1 through 10, each on a new line.',
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'Create a simple function',
    description: 'Build a function that adds two numbers',
    difficulty: 'Easy',
    recommendationReason: 'Next in your learning path',
    category: 'Functions',
    estimatedTime: '8 min',
    steps: [
      {
        step: 1,
        title: 'Define the Function',
        content: 'Use the "def" keyword followed by the function name and parameters in parentheses.',
        codeExample: 'def add_numbers(a, b):\n    return a + b',
      },
      {
        step: 2,
        title: 'Add the Logic',
        content: 'Inside the function, add the two parameters and return the result.',
        codeExample: 'def add_numbers(a, b):\n    result = a + b\n    return result',
      },
      {
        step: 3,
        title: 'Test Your Function',
        content: 'Call the function with different values to verify it works correctly.',
        codeExample: 'print(add_numbers(5, 3))  # Output: 8\nprint(add_numbers(10, 20))  # Output: 30',
      },
    ],
  },
  {
    id: '3',
    title: 'Work with lists',
    description: 'Create a list and add/remove elements',
    difficulty: 'Medium',
    recommendationReason: 'Popular among learners like you',
    category: 'Data Structures',
    estimatedTime: '10 min',
    steps: [
      {
        step: 1,
        title: 'Create a List',
        content: 'Initialize an empty list or a list with initial values using square brackets.',
        codeExample: 'my_list = []\n# or\nmy_list = [1, 2, 3]',
      },
      {
        step: 2,
        title: 'Add Elements',
        content: 'Use the append() method to add elements to the end of the list.',
        codeExample: 'my_list.append(4)\nmy_list.append(5)\nprint(my_list)  # [1, 2, 3, 4, 5]',
      },
      {
        step: 3,
        title: 'Remove Elements',
        content: 'Use remove() to delete a specific value, or pop() to remove by index.',
        codeExample: 'my_list.remove(3)  # Removes the value 3\n# or\nmy_list.pop(0)  # Removes first element',
      },
      {
        step: 4,
        title: 'Practice',
        content: 'Try different list operations like insert(), extend(), and clear().',
      },
    ],
  },
  {
    id: '4',
    title: 'Understand conditional statements',
    description: 'Use if-else to make decisions in code',
    difficulty: 'Easy',
    recommendationReason: 'Recommended by AI',
    category: 'Control Flow',
    estimatedTime: '7 min',
    steps: [
      {
        step: 1,
        title: 'Basic If Statement',
        content: 'Write an if statement to check a condition.',
        codeExample: 'age = 18\nif age >= 18:\n    print("You are an adult")',
      },
      {
        step: 2,
        title: 'Add Else Clause',
        content: 'Use else to handle the case when the condition is false.',
        codeExample: 'if age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
      },
      {
        step: 3,
        title: 'Use Elif for Multiple Conditions',
        content: 'Add elif (else if) for checking multiple conditions.',
        codeExample: 'if age < 13:\n    print("Child")\nelif age < 18:\n    print("Teen")\nelse:\n    print("Adult")',
      },
    ],
  },
  {
    id: '5',
    title: 'Handle exceptions with try-except',
    description: 'Learn to catch and handle errors gracefully',
    difficulty: 'Medium',
    recommendationReason: 'Based on your profile',
    category: 'Error Handling',
    estimatedTime: '12 min',
    steps: [
      {
        step: 1,
        title: 'Understand Exceptions',
        content: 'Exceptions are errors that occur during program execution. Common ones include ValueError, TypeError, and ZeroDivisionError.',
      },
      {
        step: 2,
        title: 'Basic Try-Except',
        content: 'Wrap risky code in a try block and handle errors in except.',
        codeExample: 'try:\n    number = int(input("Enter a number: "))\nexcept ValueError:\n    print("That\'s not a valid number!")',
      },
      {
        step: 3,
        title: 'Multiple Exception Types',
        content: 'You can catch different exception types separately.',
        codeExample: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nexcept Exception as e:\n    print(f"An error occurred: {e}")',
      },
    ],
  },
];

export interface TaskInteraction {
  taskId: string;
  completed: boolean;
  helpful?: boolean;
  comment?: string;
  completedAt?: Date;
}
