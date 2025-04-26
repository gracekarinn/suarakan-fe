import { DeleteReportParams, StatusType } from "../interface";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:3000";

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const getStatusColor = (status: string | null): string => {
  switch(status) {
    case 'Received':
      return 'bg-blue-100 text-blue-800';
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const canEditReport = (status: string | null): boolean => {
  return status === 'Received';
};

export const canDeleteReport = (status: string | null): boolean => {
  return status === 'Received' || status === 'Rejected';
};

export const deleteReport = async ({ reportId, token }: DeleteReportParams): Promise<boolean> => {
  try {
    const response = await fetch(`${BE_URL}/api/v1/reports/${reportId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};