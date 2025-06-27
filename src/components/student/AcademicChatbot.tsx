
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AcademicChatbotProps {
  currentSGPA: number;
  currentCGPA: number;
  marks: Array<{
    id: string;
    subject: string;
    mid1: number;
    mid2: number;
    assignment: number;
    total: number;
  }>;
  semester: number;
}

export const AcademicChatbot: React.FC<AcademicChatbotProps> = ({
  currentSGPA,
  currentCGPA,
  marks,
  semester
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your Academic Assistant. I can help you understand your academic performance and plan for your target CGPA/SGPA. Your current SGPA is ${currentSGPA.toFixed(2)} and CGPA is ${currentCGPA.toFixed(2)}. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('academic-chatbot', {
        body: {
          message: inputMessage,
          context: {
            currentSGPA,
            currentCGPA,
            marks,
            semester,
            totalSubjects: marks.length,
            averageMarks: marks.length > 0 ? marks.reduce((sum, mark) => sum + mark.total, 0) / marks.length : 0
          }
        }
      });

      if (error) {
        throw error;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <CardTitle>Academic Assistant</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(true)}
            >
              Chat Now
            </Button>
          </div>
          <CardDescription>
            Get personalized advice about your CGPA, SGPA, and academic performance. Ask questions like:
            "What SGPA do I need to reach 8.5 CGPA?" or "How many marks do I need in the next exam?"
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <CardTitle>Academic Assistant</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            Minimize
          </Button>
        </div>
        <CardDescription>
          Ask me anything about your academic performance and goals!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-80 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0">
                      <Bot className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.isUser && (
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your CGPA targets, required marks, etc..."
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>Example questions:</p>
            <ul className="mt-1 space-y-1">
              <li>• "What SGPA do I need to reach 8.5 CGPA?"</li>
              <li>• "How many marks do I need in Mathematics to get A grade?"</li>
              <li>• "Can I achieve 9.0 CGPA by graduation?"</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
