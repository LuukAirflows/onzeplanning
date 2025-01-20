import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  status: string;
  employee_skills: EmployeeSkill[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
}

interface EmployeeSkill {
  skill_id: string;
}

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showManageEmployeeSkillsModal, setShowManageEmployeeSkillsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadEmployees();
    loadSkills();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          employee_skills (
            skill_id
          )
        `)
        .neq('role', 'admin')
        .order('first_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Fout bij het laden van werknemers');
    }
  };

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Fout bij het laden van vaardigheden');
    }
  };

  const addSkill = async () => {
    try {
      const { error } = await supabase
        .from('skills')
        .insert([
          {
            name: newSkill.name,
            description: newSkill.description,
          },
        ]);

      if (error) throw error;

      toast.success('Vaardigheid toegevoegd');
      setNewSkill({ name: '', description: '' });
      loadSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Fout bij het toevoegen van vaardigheid');
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      // First check if the skill is in use
      const { data: usedSkills, error: checkError } = await supabase
        .from('employee_skills')
        .select('id')
        .eq('skill_id', skillId)
        .limit(1);

      if (checkError) throw checkError;

      if (usedSkills && usedSkills.length > 0) {
        toast.error('Deze vaardigheid is nog in gebruik bij werknemers');
        return;
      }

      // If not in use, delete the skill
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      toast.success('Vaardigheid verwijderd');
      loadSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Fout bij het verwijderen van de vaardigheid');
    }
  };

  const addEmployeeSkill = async (employeeId: string, skillId: string) => {
    try {
      const { error } = await supabase
        .from('employee_skills')
        .insert([
          {
            user_id: employeeId,
            skill_id: skillId,
          },
        ]);

      if (error) throw error;

      toast.success('Vaardigheid toegekend aan werknemer');
      loadEmployees();
    } catch (error) {
      console.error('Error adding employee skill:', error);
      toast.error('Fout bij het toekennen van vaardigheid');
    }
  };

  const removeEmployeeSkill = async (employeeId: string, skillId: string) => {
    try {
      const { error } = await supabase
        .from('employee_skills')
        .delete()
        .eq('user_id', employeeId)
        .eq('skill_id', skillId);

      if (error) throw error;

      toast.success('Vaardigheid verwijderd van werknemer');
      loadEmployees();
    } catch (error) {
      console.error('Error removing employee skill:', error);
      toast.error('Fout bij het verwijderen van vaardigheid');
    }
  };

  const hasSkill = (employee: Employee, skillId: string) => {
    return employee.employee_skills.some(skill => skill.skill_id === skillId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Werknemers</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddSkillModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Vaardigheden Beheren
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Werknemer Toevoegen
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Zoek werknemers..."
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Functie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vaardigheden
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(skill => hasSkill(employee, skill.id))
                      .map(skill => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill.name}
                        </span>
                      ))
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowManageEmployeeSkillsModal(true);
                    }}
                  >
                    Vaardigheden
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Manage Skills Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Vaardigheden Beheren</h3>
              <button onClick={() => setShowAddSkillModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900">Nieuwe Vaardigheid Toevoegen</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700">Naam</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Beschrijving</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  rows={3}
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={addSkill}>
                  Toevoegen
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Bestaande Vaardigheden</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-sm text-gray-500">{skill.description}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => deleteSkill(skill.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowAddSkillModal(false)}>
                Sluiten
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Employee Skills Modal */}
      {showManageEmployeeSkillsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Vaardigheden van {selectedEmployee.first_name} {selectedEmployee.last_name}
              </h3>
              <button onClick={() => setShowManageEmployeeSkillsModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {skills.map((skill) => {
                const hasThisSkill = hasSkill(selectedEmployee, skill.id);
                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-sm text-gray-500">{skill.description}</div>
                    </div>
                    <Button
                      variant={hasThisSkill ? "outline" : "default"}
                      size="sm"
                      onClick={() => {
                        if (hasThisSkill) {
                          removeEmployeeSkill(selectedEmployee.id, skill.id);
                        } else {
                          addEmployeeSkill(selectedEmployee.id, skill.id);
                        }
                      }}
                    >
                      {hasThisSkill ? "Verwijderen" : "Toevoegen"}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowManageEmployeeSkillsModal(false)}>
                Sluiten
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;