import { supabase } from '../lib/supabase';
import type { Computer, Student, Allocation, ComputerWithCount, StudentWithComputer } from '../lib/database.types';

export const computerService = {
  async getAll(): Promise<ComputerWithCount[]> {
    const { data: computers, error: computersError } = await supabase
      .from('computers')
      .select('*')
      .order('name');

    if (computersError) throw computersError;

    const { data: allocations, error: allocationsError } = await supabase
      .from('allocations')
      .select('computer_id');

    if (allocationsError) throw allocationsError;

    const countMap = allocations.reduce((acc, alloc) => {
      acc[alloc.computer_id] = (acc[alloc.computer_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return computers.map(computer => ({
      ...computer,
      student_count: countMap[computer.id] || 0
    }));
  },

  async getById(id: string): Promise<Computer | null> {
    const { data, error } = await supabase
      .from('computers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(name: string, location?: string): Promise<Computer> {
    const { data, error } = await supabase
      .from('computers')
      .insert({ name, location })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, name: string, location?: string): Promise<Computer> {
    const { data, error } = await supabase
      .from('computers')
      .update({ name, location })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('computers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const studentService = {
  async getAll(): Promise<StudentWithComputer[]> {
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('name');

    if (studentsError) throw studentsError;

    const { data: allocations, error: allocationsError } = await supabase
      .from('allocations')
      .select('student_id, computer_id, computers(name)')
      .order('student_id');

    if (allocationsError) throw allocationsError;

    const allocationMap = allocations.reduce((acc, alloc: any) => {
      acc[alloc.student_id] = {
        computer_id: alloc.computer_id,
        computer_name: alloc.computers?.name || null
      };
      return acc;
    }, {} as Record<string, { computer_id: string; computer_name: string | null }>);

    return students.map(student => ({
      ...student,
      computer_id: allocationMap[student.id]?.computer_id || null,
      computer_name: allocationMap[student.id]?.computer_name || null
    }));
  },

  async getById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByComputerId(computerId: string): Promise<Student[]> {
    const { data: allocations, error: allocationsError } = await supabase
      .from('allocations')
      .select('student_id')
      .eq('computer_id', computerId);

    if (allocationsError) throw allocationsError;

    if (!allocations || allocations.length === 0) return [];

    const studentIds = allocations.map(a => a.student_id);

    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .in('id', studentIds)
      .order('name');

    if (studentsError) throw studentsError;
    return students;
  },

  async create(name: string, studentId: string, email?: string): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert({ name, student_id: studentId, email })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, name: string, studentId: string, email?: string): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({ name, student_id: studentId, email })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const allocationService = {
  async getAll(): Promise<Allocation[]> {
    const { data, error } = await supabase
      .from('allocations')
      .select('*')
      .order('allocated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByComputerId(computerId: string): Promise<Allocation[]> {
    const { data, error } = await supabase
      .from('allocations')
      .select('*')
      .eq('computer_id', computerId)
      .order('allocated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByStudentId(studentId: string): Promise<Allocation | null> {
    const { data, error } = await supabase
      .from('allocations')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(studentId: string, computerId: string): Promise<Allocation> {
    await this.deleteByStudentId(studentId);

    const { data, error } = await supabase
      .from('allocations')
      .insert({ student_id: studentId, computer_id: computerId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, computerId: string): Promise<Allocation> {
    const { data, error } = await supabase
      .from('allocations')
      .update({ computer_id: computerId })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('allocations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async deleteByStudentId(studentId: string): Promise<void> {
    const { error } = await supabase
      .from('allocations')
      .delete()
      .eq('student_id', studentId);

    if (error) throw error;
  }
};
