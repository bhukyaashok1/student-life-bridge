
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Award } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { profile, studentData } = useAuth();

  if (!profile || !studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Loading your profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Your personal information and academic details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg">{profile.full_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="text-lg">{studentData.roll_number}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{profile.email}</p>
                </div>
              </div>
              
              {profile.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-lg">{profile.phone}</p>
                  </div>
                </div>
              )}
            </div>
            
            {profile.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-lg">{profile.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Academic Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Branch</p>
                <p className="text-lg">{studentData.branch}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Section</p>
                <p className="text-lg">{studentData.section}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p className="text-lg">{studentData.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Semester</p>
                <p className="text-lg">{studentData.semester}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Academic Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current SGPA</p>
                <p className="text-2xl font-bold text-green-600">{studentData.sgpa}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Overall CGPA</p>
                <p className="text-2xl font-bold text-blue-600">{studentData.cgpa}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
