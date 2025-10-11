// components/project/ProjectCombobox.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import api from '@/api/client';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // if you have a classnames helper

interface Project {
  id: string;
  name: string;
}

interface ProjectComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function ProjectCombobox({
  value,
  onChange,
  disabled = false,
  label = 'Project',
  placeholder = 'Select a project',
}: ProjectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects', { params: { limit: 100 } });
        setProjects(res.data.data.data || []);
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const selected = useMemo(
    () => projects.find((p) => String(p.id) === String(value)),
    [projects, value]
  );

  return (
    <div className="grid gap-3">
      <Label className="font-bold">{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selected ? selected.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search project..." />
            <CommandList>
              {loading && <div className="p-2 text-sm">Loading...</div>}
              <CommandEmpty>No project found.</CommandEmpty>

              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  // onSelect gives the item’s text; use id via closure
                  onSelect={() => {
                    onChange(p.id); // keep id type; parent can coerce if needed
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(value) === String(p.id)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {p.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
