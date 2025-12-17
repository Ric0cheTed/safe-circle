import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, User, Phone, Heart, Trash2, Edit2, X, Check } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const relationships = [
  "Partner",
  "Parent",
  "Sibling",
  "Friend",
  "Colleague",
  "Neighbor",
  "Other",
];

const TrustedContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Sarah Johnson", phone: "+44 7700 900123", relationship: "Partner" },
    { id: "2", name: "David Smith", phone: "+44 7700 900456", relationship: "Parent" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", relationship: "" });

  const openAddDialog = () => {
    setEditingContact(null);
    setFormData({ name: "", phone: "", relationship: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({ name: contact.name, phone: contact.phone, relationship: contact.relationship });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.relationship) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingContact) {
      setContacts(contacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...formData }
          : c
      ));
      toast.success("Contact updated");
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
      };
      setContacts([...contacts, newContact]);
      toast.success("Contact added");
    }
    setIsDialogOpen(false);
  };

  const confirmDelete = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      toast.success("Contact removed");
    }
    setIsDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-display font-semibold text-foreground">
              Trusted Contacts
            </h1>
            <p className="text-sm text-muted-foreground">
              People who will be notified in an emergency
            </p>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No contacts yet</h3>
              <p className="text-sm text-muted-foreground">
                Add trusted contacts who will be notified when you trigger an SOS
              </p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-card border border-border rounded-xl p-4 animate-fade-in"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{contact.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary mt-1">
                        <Heart className="h-3 w-3" />
                        <span>{contact.relationship}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => confirmDelete(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Button */}
        <div className="pt-4">
          <Button
            onClick={openAddDialog}
            className="w-full"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Trusted Contact
          </Button>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Add Contact"}
            </DialogTitle>
            <DialogDescription>
              {editingContact 
                ? "Update your trusted contact's information"
                : "Add someone you trust to be notified in emergencies"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Sarah Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +44 7700 900123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData({ ...formData, relationship: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                {editingContact ? "Save Changes" : "Add Contact"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {contactToDelete?.name} from your trusted contacts? They will no longer be notified in emergencies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default TrustedContacts;
