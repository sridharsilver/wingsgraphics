import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Globe, Upload, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PageHeader as AdminPageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/clients")({
  component: AdminClientsPage,
});

function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", logo_url: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    const { data } = await supabase
      .from("wg_clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setClients(data);
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `clients/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!formData.name || !formData.logo_url) return;
    const { error } = await supabase.from("wg_clients").insert([formData]);
    if (!error) {
      setIsAddModalOpen(false);
      setFormData({ name: "", logo_url: "" });
      fetchClients();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this client?")) return;
    const { error } = await supabase.from("wg_clients").delete().eq("id", id);
    if (!error) fetchClients();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Manage Clients" 
        description="Add logos of brands you have worked with."
        action={
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-brand text-brand-foreground shadow-glow gap-2">
            <Plus size={16} /> Add Brand Logo
          </Button>
        }
      />

      {loading ? (
        <div className="h-64 grid place-items-center">
          <div className="size-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((c) => (
            <AdminCard key={c.id} className="group relative p-4 bg-surface border-border hover:border-brand/50 transition-all">
              <div className="h-20 flex items-center justify-center">
                <img src={c.logo_url} alt={c.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="mt-2 text-[10px] text-center font-bold uppercase tracking-wider text-muted-foreground truncate">{c.name}</div>
              <button 
                onClick={() => handleDelete(c.id)}
                className="absolute top-2 right-2 size-7 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={14} />
              </button>
            </AdminCard>
          ))}
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Client Logo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input placeholder="e.g. Google" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <div className="h-32 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                {formData.logo_url ? (
                  <img src={formData.logo_url} className="w-full h-full object-contain p-4" />
                ) : (
                  <>
                    <Upload className="text-muted-foreground" size={24} />
                    <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Click to upload"}</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-brand text-brand-foreground shadow-glow" disabled={uploading || !formData.logo_url}>
              Save Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
