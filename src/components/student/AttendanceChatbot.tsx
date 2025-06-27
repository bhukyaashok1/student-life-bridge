
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Send, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AttendanceChatbotProps {
  studentData: any;
  subjectAttendance: Array<{
    subject: string;
    attended: number;
    total: number;
    percentage: number;
    classesToReach75: number;
    maxAbsences: number;
  }>;
  overallAttendance: {
    totalClasses: number;
    attendedClasses: number;
    percentage: number;
  };
  onClose: () => void;
}

export const AttendanceChatbot: React.FC<AttendanceChatbotProps> = ({
  studentData,
  subjectAttendance,
  overallAttendance,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your attendance assistant. I can help you understand your attendance statistics, calculate how many classes you need to attend to reach 75%, and answer any questions about your academic progress. What would you like to know?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const generateAttendanceContext = () => {
    const context = `
Student Attendance Data:
- Overall Attendance: ${overallAttendance.percentage}% (${overallAttendance.attendedClasses}/${overallAttendance.totalClasses} classes)
- Student: ${studentData.branch} Year ${studentData.year}, Semester ${studentData.semester}, Section ${studentData.section}

Subject-wise breakdown:
${subjectAttendance.map(subject => 
  `- ${subject.subject}: ${subject.percentage}% (${subject.attended}/${subject.total} classes)
    * Classes needed to reach 75%: ${subject.classesToReach75}
    * Maximum absences allowed: ${subject.maxAbsences}`
).join('\n')}

The student needs to maintain 75% attendance to meet academic requirements.
`;
    return context;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('attendance-chatbot', {
        body: {
          message: inputText,
          context: generateAttendanceContext()
        }
      });

      if (error) {
        throw error;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I couldn\'t process your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
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

  const quickQuestions = [
    "How many classes do I need to attend to reach 75% overall?",
    "Which subjects need the most attention?",
    "How many classes can I miss without falling below 75%?",
    "What's my current attendance status?"
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-xl border-2 border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Attendance Assistant
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full p-4">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-80">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  message.isUser
                    ? 'bg-blue-600 text-white ml-4'
                    : 'bg-gray-100 text-gray-900 mr-4'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm mr-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your attendance..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputText.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
