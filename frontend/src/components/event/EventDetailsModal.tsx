import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RotateCcw } from 'lucide-react';
import { type Event, type Delivery } from '@/types/models';

interface Props {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  onReplay: (id: string) => void;
}

export function EventDetailsModal({ open, onClose, event, onReplay }: Props) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold py-6">
              Event View
            </DialogTitle>
            <div className="flex items-center gap-2 px-4">
              <Badge className="capitalize">{event.status}</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReplay(event.eventUid as string)}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Replay
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="pr-2 space-y-6 overflow-hidden">
          {/* Event Info */}
          <section>
            <h3 className="font-semibold mb-2">Event Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Source:</span> {event.sourceName}
              </div>
              <div>
                <span className="font-medium">Project:</span>{' '}
                {event.projectName}
              </div>
              <div>
                <span className="font-medium">Received:</span>{' '}
                {new Date(event.receivedAt).toLocaleString()}
              </div>
              {event.completedAt && (
                <div>
                  <span className="font-medium">Completed:</span>{' '}
                  {new Date(event.completedAt).toLocaleString()}
                </div>
              )}
              <div>
                <span className="font-medium">Retries:</span> {event.retryCount}
              </div>
            </div>
          </section>
          {/* Payload */}
          <section>
            <h3 className="font-semibold mb-2">Payload</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </section>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Deliveries */}
          <section className="flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold mb-2">Deliveries</h3>
            <div className="flex-1 overflow-y-auto overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attempt</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Delivered At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.deliveries?.map((d: Delivery) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.attemptNo}</TableCell>
                      <TableCell>{d.destinationName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            d.responseStatus &&
                            d.responseStatus >= 200 &&
                            d.responseStatus < 300
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {d.responseStatus ?? 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{d.durationMs ?? '-'} ms</TableCell>
                      <TableCell>{d.deliveredAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
