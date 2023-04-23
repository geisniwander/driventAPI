export type ApplicationError = {
  name: string;
  message: string;
};

export type UserTicket = {
  id: number;
  status: string;
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type PaymentParams = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export type PaymentTypeParams = {
  paymentData: PaymentParams;
  userId: number;
};

export type PaymentTypeSchema = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export interface TypeRequest {
  ticketTypeId: number;
}

export interface UserIdRequest {
  userId: number;
}

export interface ticketIdRequest {
  ticketId: number;
}

export type CreateTicketType = {
  ticketTypeId: number;
  userId: number;
};

export type HotelRooms = {
  hotelId: number;
  userId: number;
};

export type FindPaymentsType = { userId: number; ticketId: number };
