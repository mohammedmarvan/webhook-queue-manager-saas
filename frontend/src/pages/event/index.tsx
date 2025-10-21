import { useState, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CommonTable, type Column } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RotateCcw } from 'lucide-react';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EventDetailsModal } from '@/components/event/EventDetailsModal';
import { type Event } from '@/types/models';
import { replayEvent } from '@/api/event';
import { AxiosError } from 'axios';

export default function EventPage() {
  // Consolidated state management
  const [refreshKey, setRefreshKey] = useState(0);
  const [eventDetails, setEventDetails] = useState<{
    open: boolean;
    selectedEvent: Event | null;
  }>({ open: false, selectedEvent: null });
  const [replayDialog, setReplayDialog] = useState<{
    open: boolean;
    eventId: string | null;
  }>({ open: false, eventId: null });

  // Memoized status badge renderer
  const renderStatusBadge = useCallback((status: Event['status']) => {
    const variantMap = {
      completed: 'default',
      failed: 'destructive',
      received: 'secondary',
      processing: 'secondary',
      discarded: 'secondary',
    } as const;

    return (
      <Badge variant={variantMap[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    );
  }, []);

  // Memoize columns to prevent unnecessary re-renders
  const columns: Column<Event>[] = useMemo(
    () => [
      { key: 'eventUid', label: 'Event UID' },
      { key: 'sourceName', label: 'Source' },
      { key: 'projectName', label: 'Project' },
      {
        key: 'status',
        label: 'Status',
        render: (row) => renderStatusBadge(row.status),
      },
      { key: 'receivedAt', label: 'Received At' },
      { key: 'retryCount', label: 'Retries' },
    ],
    [renderStatusBadge]
  );

  // Optimized event handlers with useCallback
  const handleReplay = useCallback(async (eventId: string) => {
    try {
      await replayEvent(eventId);
      AppToast.success('Event replay triggered successfully');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error replaying event:', err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Failed to replay event. Please try again.'
      );
    }
  }, []);

  const handleViewDetails = useCallback((event: Event) => {
    setEventDetails({
      open: true,
      selectedEvent: event,
    });
  }, []);

  const handleReplayClick = useCallback((eventUid: string) => {
    setReplayDialog({
      open: true,
      eventId: eventUid,
    });
  }, []);

  const handleReplayConfirm = useCallback(() => {
    if (replayDialog.eventId) {
      handleReplay(replayDialog.eventId);
      setReplayDialog({ open: false, eventId: null });
    }
  }, [replayDialog.eventId, handleReplay]);

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
              onClick={() => handleViewDetails(row)}
              aria-label={`View details for event ${row.eventUid}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReplayClick(row.eventUid as string)}
              aria-label={`Replay event ${row.eventUid}`}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <EventDetailsModal
        open={eventDetails.open}
        onClose={() => setEventDetails((prev) => ({ ...prev, open: false }))}
        event={eventDetails.selectedEvent}
        onReplay={handleReplay}
      />

      <ConfirmDialog
        open={replayDialog.open}
        onOpenChange={(open) => setReplayDialog((prev) => ({ ...prev, open }))}
        title="Replay Event"
        description="Are you sure you want to replay this event? This will enqueue a new delivery attempt."
        confirmLabel="Replay"
        cancelLabel="Cancel"
        onConfirm={handleReplayConfirm}
      />
    </div>
  );
}
