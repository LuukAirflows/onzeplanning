import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserCircle2, Mail, Phone, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
}

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadProfile();
      loadSkills();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Fout bij het laden van je profiel');
    }
  };

  const loadSkills = async () => {
    if (!user?.email) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;

      const { data: skillsData, error: skillsError } = await supabase
        .from('employee_skills')
        .select(`
          skills (
            id,
            name,
            description
          )
        `)
        .eq('user_id', userData.id);

      if (skillsError) throw skillsError;
      setSkills(skillsData.map(item => item.skills));
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Fout bij het laden van je vaardigheden');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mijn Profiel</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle2 className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{profile?.role}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{profile?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mijn Vaardigheden
          </h3>
          <div className="space-y-4">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <p className="text-sm text-gray-500">{skill.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nog geen vaardigheden toegekend
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;