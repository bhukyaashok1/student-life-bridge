
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Settings, Save, Users, Database, Bell, Lock } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    collegeName: 'St. Xavier\'s College of Engineering',
    address: '123 University Street, Education City',
    phone: '+1 (555) 123-4567',
    email: 'admin@stxavier.edu',
    website: 'www.stxavier.edu',
    academicYear: '2023-24'
  });

  const [systemSettings, setSystemSettings] = useState({
    maxStudentsPerClass: '60',
    attendanceRequirement: '75',
    passingMarks: '60',
    maxMarks: '100',
    workingDaysPerWeek: '6'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    examReminders: true,
    assignmentReminders: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: '8',
    sessionTimeout: '30',
    requirePasswordChange: false,
    enableTwoFactor: false
  });

  const saveSettings = (settingsType: string) => {
    console.log(`Saving ${settingsType} settings`);
    // In a real app, this would save to the database
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'system', label: 'System', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">College Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="collegeName">College Name</Label>
                      <Input
                        id="collegeName"
                        value={generalSettings.collegeName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, collegeName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Select value={generalSettings.academicYear} onValueChange={(value) => setGeneralSettings({ ...generalSettings, academicYear: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                          <SelectItem value="2025-26">2025-26</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={generalSettings.address}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={generalSettings.phone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={generalSettings.website}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => saveSettings('general')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxStudents">Max Students Per Class</Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={systemSettings.maxStudentsPerClass}
                        onChange={(e) => setSystemSettings({ ...systemSettings, maxStudentsPerClass: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="attendanceReq">Minimum Attendance Required (%)</Label>
                      <Input
                        id="attendanceReq"
                        type="number"
                        value={systemSettings.attendanceRequirement}
                        onChange={(e) => setSystemSettings({ ...systemSettings, attendanceRequirement: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="passingMarks">Passing Marks</Label>
                      <Input
                        id="passingMarks"
                        type="number"
                        value={systemSettings.passingMarks}
                        onChange={(e) => setSystemSettings({ ...systemSettings, passingMarks: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxMarks">Maximum Marks</Label>
                      <Input
                        id="maxMarks"
                        type="number"
                        value={systemSettings.maxMarks}
                        onChange={(e) => setSystemSettings({ ...systemSettings, maxMarks: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="workingDays">Working Days Per Week</Label>
                      <Select value={systemSettings.workingDaysPerWeek} onValueChange={(value) => setSystemSettings({ ...systemSettings, workingDaysPerWeek: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Days</SelectItem>
                          <SelectItem value="6">6 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button onClick={() => saveSettings('system')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save System Settings
                </Button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-600">
                            {key === 'emailNotifications' && 'Send notifications via email'}
                            {key === 'smsNotifications' && 'Send notifications via SMS'}
                            {key === 'attendanceAlerts' && 'Alert students about low attendance'}
                            {key === 'examReminders' && 'Send exam schedule reminders'}
                            {key === 'assignmentReminders' && 'Send assignment due date reminders'}
                          </div>
                        </div>
                        <button
                          onClick={() => setNotificationSettings({
                            ...notificationSettings,
                            [key]: !value
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={() => saveSettings('notifications')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passwordLength">Minimum Password Length</Label>
                      <Input
                        id="passwordLength"
                        type="number"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Require Password Change</div>
                        <div className="text-sm text-gray-600">Force users to change password on first login</div>
                      </div>
                      <button
                        onClick={() => setSecuritySettings({
                          ...securitySettings,
                          requirePasswordChange: !securitySettings.requirePasswordChange
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securitySettings.requirePasswordChange ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            securitySettings.requirePasswordChange ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Enable Two-Factor Authentication</div>
                        <div className="text-sm text-gray-600">Add an extra layer of security for admin accounts</div>
                      </div>
                      <button
                        onClick={() => setSecuritySettings({
                          ...securitySettings,
                          enableTwoFactor: !securitySettings.enableTwoFactor
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securitySettings.enableTwoFactor ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            securitySettings.enableTwoFactor ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <Button onClick={() => saveSettings('security')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
