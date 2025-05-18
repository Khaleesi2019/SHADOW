import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Call } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { formatPhoneNumber, formatDateTime } from "@/lib/utils";
import { Check, X, PhoneIncoming, PhoneOutgoing, Phone } from "lucide-react";

interface CallLogsProps {
  deviceId: number | null;
}

export function CallLogs({ deviceId }: CallLogsProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  
  const { data: calls = [], isLoading } = useQuery<Call[]>({
    queryKey: ['/api/calls', deviceId],
    enabled: !!deviceId,
  });
  
  const pageCount = Math.ceil(calls.length / pageSize);
  const paginatedCalls = calls.slice(page * pageSize, (page + 1) * pageSize);
  
  if (!deviceId) {
    return (
      <div className="text-center py-8 text-gray-400">
        Please select a device to view call logs.
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading call logs...</p>
      </div>
    );
  }
  
  if (calls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No call logs found for this device.
      </div>
    );
  }
  
  const columns = [
    {
      header: "Type",
      accessorKey: (call: Call) => (
        <div className="flex items-center">
          {call.callType === 'incoming' ? (
            <PhoneIncoming className="h-4 w-4 text-green-500" />
          ) : call.callType === 'outgoing' ? (
            <PhoneOutgoing className="h-4 w-4 text-blue-500" />
          ) : (
            <Phone className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
      className: "w-16",
    },
    {
      header: "Phone Number",
      accessorKey: (call: Call) => (
        <div>
          <div className="font-medium">{formatPhoneNumber(call.phoneNumber)}</div>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: (call: Call) => (
        <div>
          {call.timestamp ? formatDateTime(call.timestamp) : 'Unknown date'}
        </div>
      ),
    },
    {
      header: "Duration",
      accessorKey: (call: Call) => (
        <div>
          {call.duration ? `${call.duration} sec` : 'N/A'}
        </div>
      ),
    }
  ];
  
  return (
    <DataTable
      data={paginatedCalls}
      columns={columns}
      className="w-full"
      pagination={{
        pageIndex: page,
        pageCount,
        onPageChange: setPage,
      }}
    />
  );
}