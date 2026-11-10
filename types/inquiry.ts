export interface InquiryItem {
  id: string;
  listingId?: string;
  propertyLocation?: string;
  senderName: string;
  senderEmail: string;
  message: string;
  status: "New" | "Followed Up" | "Resolved" | string;
  createdAt: string;
  notes?: string;
}

