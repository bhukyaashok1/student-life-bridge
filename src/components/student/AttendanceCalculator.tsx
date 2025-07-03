import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calculator, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface SubjectAttendance {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}

interface AttendanceCalculatorProps {
  subjectAttendance: SubjectAttendance[];
  overallAttendance: {
    percentage: number;
    attendedClasses: number;
    totalClasses: number;
  };
}

export const AttendanceCalculator: React.FC<AttendanceCalculatorProps> = ({
  subjectAttendance,
  overallAttendance
}) => {
  const calculateClassesNeeded = (attended: number, total: number): number => {
    // To reach 75%: (attended + x) / (total + x) = 0.75
    // Solving: attended + x = 0.75 * (total + x)
    // attended + x = 0.75 * total + 0.75 * x
    // attended - 0.75 * total = 0.75 * x - x
    // attended - 0.75 * total = -0.25 * x
    // x = (0.75 * total - attended) / 0.25
    const needed = Math.ceil((0.75 * total - attended) / 0.25);
    return Math.max(0, needed);
  };

  const calculateMaxAbsences = (attended: number, total: number): number => {
    // How many classes can be missed while maintaining 75%?
    // attended / (total + x) >= 0.75
    // attended >= 0.75 * (total + x)
    // attended >= 0.75 * total + 0.75 * x
    // attended - 0.75 * total >= 0.75 * x
    // x <= (attended - 0.75 * total) / 0.75
    const maxMiss = Math.floor((attended - 0.75 * total) / 0.75);
    return Math.max(0, maxMiss);
  };

  const overallClassesNeeded = calculateClassesNeeded(
    overallAttendance.attendedClasses,
    overallAttendance.totalClasses
  );

  const overallMaxAbsences = calculateMaxAbsences(
    overallAttendance.attendedClasses,
    overallAttendance.totalClasses
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Attendance Calculator
        </CardTitle>
        <CardDescription>
          Calculate how many classes you need to attend to reach 75% attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Attendance Calculator */}
          <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Attendance Goal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {overallAttendance.percentage.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Current</p>
              </div>
              
              {overallAttendance.percentage < 75 ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {overallClassesNeeded}
                  </div>
                  <p className="text-sm text-gray-600">Classes needed to reach 75%</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {overallMaxAbsences}
                  </div>
                  <p className="text-sm text-gray-600">Classes you can miss</p>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">75%</div>
                <p className="text-sm text-gray-600">Target</p>
              </div>
            </div>
          </div>

          {/* Subject-wise Calculator */}
          {subjectAttendance.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Subject-wise Analysis</h4>
              <div className="space-y-3">
                {subjectAttendance.map((subject) => {
                  const classesNeeded = calculateClassesNeeded(subject.attended, subject.total);
                  const maxAbsences = calculateMaxAbsences(subject.attended, subject.total);
                  
                  return (
                    <div
                      key={subject.subject}
                      className={`p-3 border rounded-lg ${
                        subject.percentage >= 75 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {subject.percentage >= 75 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{subject.subject}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {subject.percentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600">
                            {subject.attended}/{subject.total} classes
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        {subject.percentage < 75 ? (
                          <div className="flex items-center gap-1 text-red-700">
                            <span>Need to attend</span>
                            <span className="font-bold">{classesNeeded}</span>
                            <span>more classes consecutively</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-700">
                            <span>Can miss</span>
                            <span className="font-bold">{maxAbsences}</span>
                            <span>more classes safely</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">💡 Tips:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Aim for 80%+ attendance to have a safety buffer</li>
              <li>• Attend classes regularly rather than in bursts</li>
              <li>• Medical emergencies are usually excused - consult your admin</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};