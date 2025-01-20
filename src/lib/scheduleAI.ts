import { supabase } from './supabase';
import { addDays, format, startOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';

interface Employee {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Availability {
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Shift {
  id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
  role: string;
}

export class ScheduleAI {
  // Controleer of werknemers hun beschikbaarheid hebben doorgegeven
  async checkMissingAvailability(): Promise<Employee[]> {
    const startDate = startOfWeek(new Date(), { locale: nl });
    const endDate = addDays(startDate, 7);
    
    const { data: employees } = await supabase
      .from('users')
      .select('id, role, first_name, last_name, email')
      .neq('role', 'admin');

    const { data: availability } = await supabase
      .from('availability')
      .select('user_id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const employeesWithoutAvailability = employees?.filter(
      emp => !availability?.some(avail => avail.user_id === emp.id)
    ) || [];

    return employeesWithoutAvailability;
  }

  // Genereer automatisch rooster op basis van beschikbaarheid
  async generateSchedule(startDate: Date): Promise<Shift[]> {
    const { data: availability } = await supabase
      .from('availability')
      .select('*')
      .order('day_of_week');

    const { data: employees } = await supabase
      .from('users')
      .select('*')
      .neq('role', 'admin');

    if (!availability || !employees) return [];

    // AI logica voor optimale roosterindeling
    const schedule: Shift[] = [];
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    weekDays.forEach(day => {
      const dayAvailability = availability.filter(
        a => a.day_of_week === day.getDay()
      );

      // Verdeel shifts op basis van rol en beschikbaarheid
      const roles = [...new Set(employees.map(e => e.role))];
      roles.forEach(role => {
        const availableEmployees = employees
          .filter(e => e.role === role)
          .filter(e => 
            dayAvailability.some(a => 
              a.user_id === e.id
            )
          );

        if (availableEmployees.length > 0) {
          // Kies werknemer op basis van eerlijke verdeling van uren
          const selectedEmployee = availableEmployees[0]; // Simpele selectie voor demo
          const availability = dayAvailability.find(
            a => a.user_id === selectedEmployee.id
          );

          if (availability) {
            schedule.push({
              id: crypto.randomUUID(),
              user_id: selectedEmployee.id,
              start_time: new Date(
                `${format(day, 'yyyy-MM-dd')}T${availability.start_time}`
              ),
              end_time: new Date(
                `${format(day, 'yyyy-MM-dd')}T${availability.end_time}`
              ),
              role: selectedEmployee.role
            });
          }
        }
      });
    });

    return schedule;
  }

  // Herplan rooster bij ziekmelding
  async handleSickLeave(userId: string, date: Date): Promise<Shift[]> {
    const { data: sickEmployee } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!sickEmployee) return [];

    // Vind vervangende werknemer met dezelfde rol
    const { data: replacements } = await supabase
      .from('users')
      .select('*')
      .eq('role', sickEmployee.role)
      .neq('id', userId);

    if (!replacements?.length) return [];

    // Controleer beschikbaarheid van vervangers
    const { data: availability } = await supabase
      .from('availability')
      .select('*')
      .in('user_id', replacements.map(r => r.id))
      .eq('day_of_week', date.getDay());

    if (!availability?.length) return [];

    // Kies beste vervanger op basis van beschikbaarheid
    const replacement = replacements[0]; // Simpele selectie voor demo
    const replacementAvailability = availability.find(
      a => a.user_id === replacement.id
    );

    if (!replacementAvailability) return [];

    // Update bestaande shift met nieuwe werknemer
    const { data: updatedShift } = await supabase
      .from('shifts')
      .update({ user_id: replacement.id })
      .eq('user_id', userId)
      .eq('start_time', date.toISOString())
      .select();

    return updatedShift || [];
  }
}

export const scheduleAI = new ScheduleAI();