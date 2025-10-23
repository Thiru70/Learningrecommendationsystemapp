import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Bot, User, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  currentTask?: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ currentTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your learning assistant. Ask me anything about your current task or request alternative exercises if you need help.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('help') || lowercaseInput.includes('stuck')) {
      return "I understand you're having trouble! Let's break it down into smaller steps. Would you like me to:\n\n1. Explain the concept in simpler terms\n2. Show you a similar but easier example\n3. Provide a different approach to the problem";
    }

    if (lowercaseInput.includes('too hard') || lowercaseInput.includes('difficult')) {
      return "No problem! Here are some easier alternative tasks:\n\n• Print your name 5 times using a loop\n• Create a simple calculator for addition\n• Make a list of your favorite foods\n\nWould you like to try one of these instead?";
    }

    if (lowercaseInput.includes('why') || lowercaseInput.includes('reason')) {
      return `This task was recommended because it matches your current skill level and learning goals. Based on your recent progress with ${currentTask || 'previous exercises'}, this is the next logical step to build on what you've learned.`;
    }

    if (lowercaseInput.includes('example') || lowercaseInput.includes('show')) {
      return "Here's a quick example:\n\n```python\nfor i in range(1, 11):\n    print(i)\n```\n\nThis prints numbers 1 through 10. The range(1, 11) creates numbers from 1 to 10 (11 is exclusive). Try modifying it to print different ranges!";
    }

    if (lowercaseInput.includes('alternative') || lowercaseInput.includes('different')) {
      return "Here are some alternative tasks at a similar level:\n\n• Count from 10 to 1 backwards\n• Print even numbers between 1 and 20\n• Create a simple multiplication table\n\nWhich one sounds interesting to you?";
    }

    return "Great question! I can help you with:\n\n• Understanding task concepts better\n• Breaking down steps into smaller parts\n• Finding easier alternatives\n• Explaining why this was recommended\n\nWhat would be most helpful for you right now?";
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSend();
  };

  const quickActions = [
    'Explain this concept',
    'Show me an example',
    'This is too hard',
    'Suggest alternatives',
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="sr-only">AI Assistant</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <SheetTitle>AI Learning Assistant</SheetTitle>
              <SheetDescription>
                Ask questions or get help anytime
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span className="font-medium">Quick actions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Badge
                  key={action}
                  variant="outline"
                  className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-indigo-600'
                      : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`mt-1 ${
                      message.role === 'user'
                        ? 'text-indigo-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
