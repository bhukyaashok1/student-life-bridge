
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Award, Edit } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

export const StudentProfile: React.FC = () => {
  const { profile, studentData, loading } = useAuth();
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [studentCreateError, setStudentCreateError] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleEditProfile = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          phone: editedProfile.phone,
          address: editedProfile.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      setShowEditProfile(false);
      // Reload the page to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const createDefaultStudentRecord = async () => {
    if (!profile || profile.user_type !== 'student') return;
    
    setIsCreatingStudent(true);
    setStudentCreateError(null);
    
    try {
      const { error } = await supabase
        .from('students')
        .insert({
          profile_id: profile.id,
          roll_number: `TEMP${Date.now()}`,
          branch: 'CSE',
          section: 'A',
          year: 1,
          semester: 1,
          sgpa: 0.00,
          cgpa: 0.00
        });

      if (error) {
        console.error('Error creating student record:', error);
        setStudentCreateError('Failed to create student record. Please contact administrator.');
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating student record:', error);
      setStudentCreateError('An unexpected error occurred. Please try again.');
    } finally {
      setIsCreatingStudent(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Loading your profile information...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mb-4">Unable to load profile data. Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  if (profile.user_type === 'student' && !studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mb-4">Student record not found. This usually happens for newly created accounts.</p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Record Missing</CardTitle>
              <CardDescription>
                Your profile exists but no student academic record was found. This needs to be created to access student features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={createDefaultStudentRecord}
                disabled={isCreatingStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreatingStudent ? 'Creating Record...' : 'Create Student Record'}
              </button>
              
              {studentCreateError && (
                <p className="text-red-600 mt-2">{studentCreateError}</p>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                Note: A temporary student record will be created. Please contact your administrator to update your academic details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Your personal information and academic details</p>
        </div>
        
        <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
              <DialogDescription>
                Update your personal details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={editedProfile.full_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  placeholder="Enter your address"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  <p className="text-lg">{profile.full_name || 'Not provided'}</p>
                </div>
              </div>
              
              {studentData && (
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Roll Number</p>
                    <p className="text-lg">{studentData.roll_number || 'Not assigned'}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{profile.email || 'Not provided'}</p>
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
          {studentData && (
            <>
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
                    <p className="text-lg">{studentData.branch || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Section</p>
                    <p className="text-lg">{studentData.section || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p className="text-lg">{studentData.year || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Semester</p>
                    <p className="text-lg">{studentData.semester || 'Not assigned'}</p>
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
                    <p className="text-2xl font-bold text-green-600">{studentData.sgpa || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Overall CGPA</p>
                    <p className="text-2xl font-bold text-blue-600">{studentData.cgpa || '0.00'}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
