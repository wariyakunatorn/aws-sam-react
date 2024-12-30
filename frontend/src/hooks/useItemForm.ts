import { useState, useCallback } from 'react';
import { type DynamicData } from '@/types';

interface FieldInput {
  name: string;
  value: string;
}

export function useItemForm() {
  const [selectedItem, setSelectedItem] = useState<DynamicData | null>(null);
  const [editForm, setEditForm] = useState<DynamicData>({} as DynamicData);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
  const [newField, setNewField] = useState<FieldInput>({ name: '', value: '' });

  const resetForm = useCallback(() => {
    setSelectedItem(null);
    setEditForm({} as DynamicData);
    setModalMode('create');
    setDynamicFields({});
    setNewField({ name: '', value: '' });
  }, []);

  return {
    selectedItem,
    setSelectedItem,
    editForm,
    setEditForm,
    modalMode,
    setModalMode,
    dynamicFields,
    setDynamicFields,
    resetForm,
    newField,
    setNewField
  };
}
