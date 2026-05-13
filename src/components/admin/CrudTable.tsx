import { ReactNode, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "datetime";
export interface FieldDef { name: string; label: string; type: FieldType; placeholder?: string; }

interface Props {
  table: string;
  title: string;
  fields: FieldDef[];
  displayFields: string[];
  orderBy?: { column: string; ascending?: boolean };
}

export const CrudTable = ({ table, title, fields, displayFields, orderBy }: Props) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      let q = supabase.from(table).select("*");
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const reset = () => { setEditing(null); setForm({}); };

  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (editing) {
        const { error } = await supabase.from(table).update(payload).eq("id", (editing as Record<string, unknown>).id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries(); // refresh public site
      toast.success(editing ? "Updated" : "Created");
      setOpen(false); reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", table] }); qc.invalidateQueries(); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    const f: Record<string, unknown> = {};
    fields.forEach((fd) => f[fd.name] = row[fd.name] ?? (fd.type === "boolean" ? false : ""));
    setForm(f);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...form };
    fields.forEach((fd) => {
      if (fd.type === "number" && payload[fd.name] !== "" && payload[fd.name] != null) payload[fd.name] = Number(payload[fd.name]);
      if (payload[fd.name] === "") payload[fd.name] = null;
    });
    save.mutate(payload);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild>
            <Button onClick={reset} className="rounded-full"><Plus className="size-4 mr-2" />Add new</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Create"} {title.slice(0, -1)}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              {fields.map((fd) => (
                <div key={fd.name}>
                  <Label>{fd.label}</Label>
                  {fd.type === "textarea" ? (
                    <Textarea value={form[fd.name] ?? ""} onChange={(e) => setForm({ ...form, [fd.name]: e.target.value })} placeholder={fd.placeholder} className="mt-1.5" />
                  ) : fd.type === "boolean" ? (
                    <div className="mt-2"><Switch checked={!!form[fd.name]} onCheckedChange={(v) => setForm({ ...form, [fd.name]: v })} /></div>
                  ) : (
                    <Input type={fd.type === "number" ? "number" : fd.type === "datetime" ? "datetime-local" : "text"}
                      step={fd.type === "number" ? "0.01" : undefined}
                      value={form[fd.name] ?? ""} onChange={(e) => setForm({ ...form, [fd.name]: e.target.value })}
                      placeholder={fd.placeholder} className="mt-1.5" />
                  )}
                </div>
              ))}
              <DialogFooter>
                <Button type="submit" disabled={save.isPending} className="rounded-full">{editing ? "Save changes" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {displayFields.map((f) => <th key={f} className="text-left p-4 font-semibold">{f}</th>)}
                <th className="p-4 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={displayFields.length + 1} className="p-8 text-center text-muted-foreground">Loading...</td></tr>}
              {!isLoading && !data.length && <tr><td colSpan={displayFields.length + 1} className="p-8 text-center text-muted-foreground">No items yet.</td></tr>}
              {data.map((row: Record<string, unknown>) => (
                <tr key={row.id} className="border-t border-border">
                  {displayFields.map((f) => (
                    <td key={f} className="p-4 max-w-xs truncate">
                      {typeof row[f] === "boolean" ? (row[f] ? "Yes" : "No") : String(row[f] ?? "")}
                    </td>
                  ))}
                  <td className="p-4 flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(row)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this item?")) del.mutate(row.id as string); }}><Trash2 className="size-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
