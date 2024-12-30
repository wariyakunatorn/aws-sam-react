import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type DynamicData } from '@/types';

interface ItemFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  editForm: DynamicData;
  setEditForm: (form: DynamicData) => void;
  dynamicFields: Record<string, string>;
  setDynamicFields: (fields: Record<string, string>) => void;
  handleAddField: () => void;
  handleCreate: () => void;
  handleUpdate: () => void;
  removeField: (fieldName: string) => void;
  newField: { name: string; value: string };
  setNewField: (field: { name: string; value: string }) => void;
}

export function ItemFormDialog({
  isOpen,
  onClose,
  mode,
  editForm,
  setEditForm,
  dynamicFields,
  setDynamicFields,
  handleAddField,
  removeField,
  handleCreate,
  handleUpdate,
  newField,
  setNewField
}: ItemFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Item' : 'Edit Item'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new item with custom fields and values'
              : 'Modify the existing item fields and values'}
          </DialogDescription>
        </DialogHeader>
        {mode === 'create' ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Field</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Field Name</label>
                    <Input
                      placeholder="Enter field name"
                      value={newField.name}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Field Value</label>
                    <Input
                      placeholder="Enter value"
                      value={newField.value}
                      onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddField}
                  disabled={!newField.name.trim()}
                  variant="secondary"
                  className="w-full"
                >
                  Add Field
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Added Fields {Object.keys(dynamicFields).length > 0 && 
                    `(${Object.keys(dynamicFields).length})`}
                </span>
                {Object.keys(dynamicFields).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDynamicFields({})}
                    className="text-destructive"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {Object.entries(dynamicFields).map(([field, value]) => (
                  <div key={field} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{field}</div>
                      <div className="text-sm text-muted-foreground">{value}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field)}
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(editForm)
              .filter(([key]) => key !== 'id')
              .map(([fieldName, value]) => (
                <div key={fieldName} className="grid gap-2">
                  <label className="text-sm font-medium">{fieldName}</label>
                  <Input
                    value={value as string}
                    onChange={(e) => {
                      const newForm = { ...editForm };
                      newForm[fieldName] = e.target.value;
                      setEditForm(newForm);
                    }}
                  />
                </div>
              ))}
          </div>
        )}
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              mode === 'create' ? handleCreate() : handleUpdate();
            }}
            disabled={(mode === 'create' && Object.keys(dynamicFields).length === 0) ||
                     (mode === 'edit' && Object.keys(editForm).length <= 1)}
            size="sm"
          >
            {mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
