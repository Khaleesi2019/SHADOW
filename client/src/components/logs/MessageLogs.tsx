import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { formatPhoneNumber, formatDateTime, truncateText } from "@/lib/utils";
import { MessageSquare, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface MessageLogsProps {
  deviceId: number | null;
}

export function MessageLogs({ deviceId }: MessageLogsProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', deviceId],
    enabled: !!deviceId,
  });
  
  const pageCount = Math.ceil(messages.length / pageSize);
  const paginatedMessages = messages.slice(page * pageSize, (page + 1) * pageSize);
  
  if (!deviceId) {
    return (
      <div className="text-center py-8 text-gray-400">
        Please select a device to view message logs.
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading message logs...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No message logs found for this device.
      </div>
    );
  }
  
  const columns = [
    {
      header: "Type",
      accessorKey: (message: Message) => (
        <div className="flex items-center">
          {message.messageType === 'incoming' ? (
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          )}
        </div>
      ),
      className: "w-16",
    },
    {
      header: "Phone Number",
      accessorKey: (message: Message) => (
        <div>
          <div className="font-medium">{formatPhoneNumber(message.phoneNumber)}</div>
        </div>
      ),
    },
    {
      header: "Message",
      accessorKey: (message: Message) => (
        <div>
          {message.content ? truncateText(message.content, 50) : "No content"}
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: (message: Message) => (
        <div>
          {message.timestamp ? formatDateTime(message.timestamp) : 'Unknown date'}
        </div>
      ),
    },
  ];
  
  return (
    <DataTable
      data={paginatedMessages}
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