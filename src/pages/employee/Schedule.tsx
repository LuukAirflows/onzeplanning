import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Shift {
  id: string;
  skill_id: string;
  date: string;
  start_time: string;
  end_time: string;
  user_id?: string;
  skill: {
    name: string;
  };
  user?: {
    first_name: string;
    last_name: string;
  };
}

interface UserSkill {
  skill_id: string;
}

function EmployeeSchedule() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { locale: nl }));
  const [schedule, setSchedule] = useState<Shift[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'personal' | 'company'>('personal');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      if (view === 'personal') {
        loadPersonalSchedule();
      } else {
        loadCompanySchedule();
      }
      loadUserSkills();
    }
  }, [currentWeek, view, user]);

  const loadPersonalSchedule = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedule_requirements')
        .select(`
          *,
          skill:skills (
            name
          ),
          user:users (
            first_name,
            last_name
          )
        `)
        .eq('user_id', user.id)
        .gte('date', format(currentWeek, 'yyyy-MM-dd'))
        .lte('date', format(addDays(currentWeek, 6), 'yyyy-MM-dd'))
        .order('date');

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Error loading personal schedule:', error);
      toast.error('Fout bij het laden van je rooster');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanySchedule = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedule_requirements')
        .select(`
          *,
          skill:skills (
            name
          ),
          user:users (
            first_name,
            last_name
          )
        `)
        .gte('date', format(currentWeek, 'yyyy-MM-dd'))
        .lte('date', format(addDays(currentWeek, 6), 'yyyy-MM-dd'))
        .order('date');

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Error loading company schedule:', error);
      toast.error('Fout bij het laden van het bedrijfsrooster');
    } finally {
      setLoading(false);
    }
  };

  const loadUserSkills = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('employee_skills')
        .select('skill_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserSkills(data || []);
    } catch (error) {
      console.error('Error loading user skills:', error);
      toast.error('Fout bij het laden van je vaardigheden');
    }
  };

  const canSignUpForShift = (shift: Shift) => {
    if (!user || shift.user_id) return false;
    return userSkills.some(skill => skill.skill_id === shift.skill_id);
  };

  const signUpForShift = async (shiftId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('schedule_requirements')
        .update({ user_id: user.id })
        .eq('id', shiftId);

      if (error) throw error;
      toast.success('Je bent ingepland voor deze dienst');
      if (view === 'personal') {
        loadPersonalSchedule();
      } else {
        loadCompanySchedule();
      }
    } catch (error) {
      console.error('Error signing up for shift:', error);
      toast.error('Fout bij het inplannen voor deze dienst');
    }
  };

  const cancelShift = async (shiftId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('schedule_requirements')
        .update({ user_id: null })
        .eq('id', shiftId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Je bent uitgeschreven voor deze dienst');
      if (view === 'personal') {
        loadPersonalSchedule();
      } else {
        loadCompanySchedule();
      }
    } catch (error) {
      console.error('Error canceling shift:', error);
      toast.error('Fout bij het uitschrijven voor deze dienst');
    }
  };

  const getDayShifts = (date: Date) => {
    return schedule.filter(
      shift => shift.date === format(date, 'yyyy-MM-dd')
    );
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Rooster</h1>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={view === 'personal' ? 'default' : 'ghost'}
              onClick={() => setView('personal')}
              className="text-sm"
            >
              Mijn Rooster
            </Button>
            <Button
              size="sm"
              variant={view === 'company' ? 'default' : 'ghost'}
              onClick={() => setView('company')}
              className="text-sm"
            >
              Bedrijfsrooster
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentWeek, 'd MMM', { locale: nl })} - {format(addDays(currentWeek, 6), 'd MMM', { locale: nl })}
          </span>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Mobile Calendar */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: 7 }, (_, index) => {
              const date = addDays(currentWeek, index);
              const dayShifts = getDayShifts(date);
              const hasShifts = dayShifts.length > 0;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`p-2 min-h-[60px] flex flex-col items-center justify-center ${
                    selectedDate && isSameDay(date, selectedDate)
                      ? 'bg-blue-50'
                      : 'bg-white'
                  } ${hasShifts ? 'font-bold' : ''}`}
                >
                  <span className="text-sm">{format(date, 'd')}</span>
                  {hasShifts && (
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Day Detail View */}
          {selectedDate && (
            <div className="p-4 border-t">
              <h3 className="font-medium mb-3">
                {format(selectedDate, 'EEEE d MMMM', { locale: nl })}
              </h3>
              <div className="space-y-2">
                {getDayShifts(selectedDate).map((shift) => (
                  <div
                    key={shift.id}
                    className={`p-3 rounded-lg ${
                      shift.user_id 
                        ? 'bg-blue-50 border border-blue-200'
                        : canSignUpForShift(shift)
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-gray-900">
                          {shift.skill.name}
                        </span>
                        <div className="text-sm text-gray-600">
                          {shift.start_time} - {shift.end_time}
                        </div>
                        {view === 'company' && shift.user && (
                          <div className="text-sm text-gray-600">
                            {shift.user.first_name} {shift.user.last_name}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {view === 'company' && canSignUpForShift(shift) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => signUpForShift(shift.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {shift.user_id === user?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => cancelShift(shift.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {getDayShifts(selectedDate).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Geen diensten gepland
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Calendar */}
        <div className="hidden sm:grid sm:grid-cols-7 sm:gap-px sm:bg-gray-200">
          {Array.from({ length: 7 }, (_, index) => {
            const date = addDays(currentWeek, index);
            const dayShifts = getDayShifts(date);

            return (
              <div key={index} className="bg-white p-4 min-h-[200px]">
                <div className="font-medium text-gray-900 mb-3">
                  {format(date, 'd MMMM', { locale: nl })}
                </div>
                <div className="space-y-2">
                  {dayShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`p-3 rounded-lg ${
                        shift.user_id 
                          ? 'bg-blue-50 border border-blue-200'
                          : canSignUpForShift(shift)
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-900">
                            {shift.skill.name}
                          </span>
                          <div className="text-sm text-gray-600">
                            {shift.start_time} - {shift.end_time}
                          </div>
                          {view === 'company' && shift.user && (
                            <div className="text-sm text-gray-600">
                              {shift.user.first_name} {shift.user.last_name}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {view === 'company' && canSignUpForShift(shift) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => signUpForShift(shift.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {shift.user_id === user?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => cancelShift(shift.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dayShifts.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Geen diensten gepland
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Legenda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {view === 'company' && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-xs text-gray-600">Beschikbare diensten</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-xs text-gray-600">Ingeplande diensten</span>
          </div>
          {view === 'company' && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">Niet beschikbaar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeSchedule;