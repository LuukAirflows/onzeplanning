import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Trash2,
  Users,
  Clock,
  AlertCircle,
  Menu
} from 'lucide-react';
import { scheduleAI } from '@/lib/scheduleAI';
import { supabase } from '@/lib/supabase';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { locale: nl }));
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [draggedSkill, setDraggedSkill] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);

  useEffect(() => {
    loadSchedule();
    loadSkills();
    loadEmployees();
    loadRequirements();
  }, [currentWeek]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('shifts')
        .select(`
          *,
          users:user_id (
            first_name,
            last_name,
            role
          )
        `)
        .gte('start_time', currentWeek.toISOString())
        .lte('start_time', addDays(currentWeek, 7).toISOString());

      setSchedule(data || []);
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast.error('Fout bij het laden van het rooster');
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const { data } = await supabase
        .from('skills')
        .select('*');
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Fout bij het laden van vaardigheden');
    }
  };

  const loadEmployees = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*, employee_skills(skill_id)')
        .neq('role', 'admin');
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Fout bij het laden van werknemers');
    }
  };

  const loadRequirements = async () => {
    try {
      const { data } = await supabase
        .from('schedule_requirements')
        .select('*, skill:skills(*)');
      setRequirements(data || []);
    } catch (error) {
      console.error('Error loading requirements:', error);
      toast.error('Fout bij het laden van roostereisen');
    }
  };

  const handleDragStart = (skill: any) => {
    setDraggedSkill(skill);
  };

  const handleDragEnd = () => {
    setDraggedSkill(null);
    setHoveredDay(null);
  };

  const handleDrop = async (date: Date) => {
    if (!draggedSkill) return;

    try {
      const { error } = await supabase
        .from('schedule_requirements')
        .insert({
          date: format(date, 'yyyy-MM-dd'),
          skill_id: draggedSkill.id,
          quantity: 1
        });

      if (error) throw error;

      toast.success('Vaardigheid toegevoegd aan rooster');
      loadRequirements();
    } catch (error) {
      console.error('Error adding requirement:', error);
      toast.error('Fout bij het toevoegen van roostereis');
    }
  };

  const removeRequirement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedule_requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Roostereis verwijderd');
      loadRequirements();
    } catch (error) {
      console.error('Error removing requirement:', error);
      toast.error('Fout bij het verwijderen van roostereis');
    }
  };

  const getRequirementsForDate = (date: Date) => {
    return requirements.filter(req => 
      format(parseISO(req.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getAvailableEmployees = (skillId: string) => {
    return employees.filter(emp => 
      emp.employee_skills.some((skill: any) => skill.skill_id === skillId)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rooster</h1>
        <div className="flex space-x-4">
          <Button 
            variant="outline"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => loadRequirements()}
            disabled={loading}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ververs</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skills Sidebar */}
        <div className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block lg:col-span-2 bg-white rounded-lg shadow p-4`}>
          <h2 className="font-semibold text-gray-900 mb-4">Vaardigheden</h2>
          <div className="space-y-2">
            {skills.map(skill => (
              <div
                key={skill.id}
                draggable
                onDragStart={() => handleDragStart(skill)}
                onDragEnd={handleDragEnd}
                className="bg-gray-50 p-3 rounded-md cursor-move hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">{skill.name}</div>
                <div className="text-sm text-gray-500">
                  {getAvailableEmployees(skill.id).length} beschikbaar
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-10">
          <div className="bg-white rounded-lg shadow">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-4 sm:space-y-0">
              <Button 
                variant="ghost"
                onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Vorige Week
              </Button>
              <h2 className="text-lg font-semibold text-center">
                {format(currentWeek, 'd MMM', { locale: nl })} - {format(addDays(currentWeek, 6), 'd MMM yyyy', { locale: nl })}
              </h2>
              <Button 
                variant="ghost"
                onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
                className="w-full sm:w-auto"
              >
                Volgende Week
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7 gap-px bg-gray-200">
              {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day, index) => {
                const date = addDays(currentWeek, index);
                const dayRequirements = getRequirementsForDate(date);
                const isHovered = hoveredDay === index;

                return (
                  <div
                    key={day}
                    className={`bg-white p-4 min-h-[200px] transition-colors ${
                      isHovered ? 'bg-gray-50' : ''
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setHoveredDay(index);
                    }}
                    onDragLeave={() => setHoveredDay(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(date);
                    }}
                  >
                    <div className="font-medium text-gray-900 mb-3">
                      <span className="sm:hidden">{format(date, 'EEEE', { locale: nl })}</span>
                      <span className="hidden sm:inline">{format(date, 'EEEE d MMMM', { locale: nl })}</span>
                    </div>
                    <div className="space-y-2">
                      {dayRequirements.map(req => (
                        <div
                          key={req.id}
                          className="group bg-white border rounded-md p-2 shadow-sm hover:shadow transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="font-medium">{req.skill.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{req.quantity}x</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => removeRequirement(req.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {getAvailableEmployees(req.skill.id).length} beschikbaar
                          </div>
                        </div>
                      ))}
                      {isHovered && draggedSkill && (
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-2 bg-gray-50">
                          <div className="text-gray-500">Sleep hier om toe te voegen</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Totaal Medewerkers</h3>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Geplande Diensten</h3>
              <p className="text-2xl font-bold">{requirements.reduce((acc, req) => acc + req.quantity, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Onvervulde Diensten</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;