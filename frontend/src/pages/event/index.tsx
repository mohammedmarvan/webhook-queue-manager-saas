import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CommonTable, type Column } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RotateCcw } from 'lucide-react';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EventDetailsModal } from '@/components/event/EventDetailsModal';
import { type Event } from '@/types/models'; // adjust to your schema
import { replayEvent } from '@/api/event';

export default function EventPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [replayEventId, setReplayEventId] = useState<string | null>(null);
  const [openReplayConfirm, setOpenReplayConfirm] = useState(false);

  const columns: Column<Event>[] = [
    { key: 'eventUid', label: 'Event UID' },
    { key: 'sourceName', label: 'Source' },
    { key: 'projectName', label: 'Project' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'completed'
              ? 'default'
              : row.status === 'failed'
                ? 'destructive'
                : 'secondary'
          }
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    { key: 'receivedAt', label: 'Received At' },
    { key: 'retryCount', label: 'Retries' },
  ];

  const handleReplay = async (eventId: string) => {
    try {
      // call your replay API here
      await replayEvent(eventId);
      AppToast.success('Event replay triggered');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log('Error in replaying event ', err);
      AppToast.error('Error replaying event');
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
      <PageHeader
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Events' },
        ]}
      />

      <CommonTable<Event>
        endpoint="/events"
        columns={columns}
        searchPlaceholder="Search events..."
        refreshKey={refreshKey}
        renderActions={(row) => (
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedEvent(row);
                setOpenDetails(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setReplayEventId(row.eventUid as string);
                setOpenReplayConfirm(true);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <EventDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        event={selectedEvent}
        onReplay={(id) => handleReplay(id)}
      />

      <ConfirmDialog
        open={openReplayConfirm}
        onOpenChange={setOpenReplayConfirm}
        title="Replay Event"
        description="Are you sure you want to replay this event? This will enqueue a new delivery attempt."
        confirmLabel="Replay"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (replayEventId) handleReplay(replayEventId);
          setOpenReplayConfirm(false);
        }}
      />
    </div>
  );
}
